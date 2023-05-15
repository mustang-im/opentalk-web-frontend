// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionState, VideoSetting } from '@opentalk/common';
import { TimeoutId } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/types';
import { debounce, isEqual, max, some } from 'lodash';

import { BandwidthController } from './BandwidthController';
import { BaseWebRtcConnection } from './BaseWebRtcConnection';
import { MediaSignaling } from './MediaSignaling';
import { SubscriberConfig } from './WebRTC';
import { PACKET_LOSS_THRESHOLD } from './index';

const QUALITY_DEBOUNCE_TIME = 500; //ms
const RECOVERY_TIMEOUT = 10_000; //ms
const CLOSE_TIMEOUT = 30_000; //ms

export interface SubscriberState {
  audioRunning: boolean;
  videoRunning: boolean;
  connection: RTCIceConnectionState;
}

export class SubscriberConnection extends BaseWebRtcConnection {
  private mediaConfig: MediaSessionState;
  private stream: MediaStream | undefined;
  private subscriberState: SubscriberState = { audioRunning: false, videoRunning: false, connection: 'new' };
  private qualityTargetCount: Array<number> = [];

  private readyHandlers: (({ stream, reason }: { stream?: MediaStream; reason?: string }) => void)[] = [];

  // use a random base interval to avoid control ringing
  private bandwidthController = new BandwidthController(4000 * (0.7 + Math.random()), 5 * 60_000, 1000);
  private lossCount = 0;
  private expectRestart = false;

  private reconnectTimerHandle?: TimeoutId;
  private closeTimerHandle?: TimeoutId;

  private readonly updateQualityTarget: () => void;

  constructor(iceServers: RTCIceServer[], subscriberConfig: SubscriberConfig, signaling: MediaSignaling) {
    // quality setting needs to match the default setting of the backend
    super(iceServers, subscriberConfig, signaling, VideoSetting.High);

    this.mediaConfig = subscriberConfig;
    this.peerConnection.addEventListener('iceconnectionstatechange', () => {
      const state = this.peerConnection.iceConnectionState;
      switch (state) {
        case 'closed':
          this.close();
          break;
        case 'disconnected':
          this.subscriberState = {
            audioRunning: false,
            videoRunning: false,
            connection: this.peerConnection.iceConnectionState,
          };
          this.eventEmitter.emit('subscriberstatechanged', {
            subscriberState: this.subscriberState,
            ...this.descriptor,
          });
          console.warn(`Subscriber connection ${state}`);
          this.checkMediaCondition();
          break;
        case 'failed':
          this.subscriberState = {
            audioRunning: false,
            videoRunning: false,
            connection: this.peerConnection.iceConnectionState,
          };
          this.eventEmitter.emit('subscriberstatechanged', {
            subscriberState: this.subscriberState,
            ...this.descriptor,
          });
          this.iceRestart();
          console.warn(`Subscriber connection ${state}`);
          break;
        case 'connected':
          this.updateState();
      }
    });
    this.peerConnection.addEventListener('track', (event) => this.onTrackHandler(event));
    this.signaling.requestOffer(subscriberConfig);

    this.bandwidthController.addEventListener('limit', async (limit: VideoSetting) => {
      this.eventEmitter.emit('qualityLimit', { ...subscriberConfig, limit });
      this.updateQualityLimit(limit);
    });

    this.updateQualityTarget = debounce(this._updateQualityTarget.bind(this), QUALITY_DEBOUNCE_TIME, {
      maxWait: 2 * QUALITY_DEBOUNCE_TIME,
    });

    //downgrade on startup
    this.bandwidthController.downgradeTemporarily();
  }

  private iceRestart() {
    console.info(`Issue an ICE restart on subscriber connection ${this.descriptor}`);
    this.expectRestart = true;
    this.signaling.resubscribe(this.descriptor);
    this.stopReconnectTimer();
  }
  private setReconnectTimer() {
    if (this.reconnectTimerHandle !== undefined) {
      console.warn('reconnect timer is already set');
      return;
    }
    console.debug(`Set reconnect timer for subscriber connection ${this.descriptor}`);
    this.reconnectTimerHandle = setTimeout(this.iceRestart.bind(this), RECOVERY_TIMEOUT);
  }
  private stopReconnectTimer() {
    if (this.reconnectTimerHandle) {
      console.debug('clear reconnect timer');
      clearTimeout(this.reconnectTimerHandle);
      this.reconnectTimerHandle = undefined;
    }
  }

  private checkMediaCondition() {
    const hasBrokenTrack =
      (this.mediaConfig.audio && !this.subscriberState.audioRunning) ||
      (this.mediaConfig.video && !this.subscriberState.videoRunning);

    if (this.isActive() && hasBrokenTrack) {
      this.setReconnectTimer();
    } else {
      this.stopReconnectTimer();
    }
  }

  private updateCloseTimer() {
    if (this.isActive() && this.closeTimerHandle !== undefined) {
      clearTimeout(this.closeTimerHandle);
    }

    if (!this.isActive() && this.closeTimerHandle === undefined) {
      this.closeTimerHandle = setTimeout(() => {
        this.close();
        this.closeTimerHandle = undefined;
      }, CLOSE_TIMEOUT);
    }
  }

  public updateConfig(subscriberConfig: SubscriberConfig) {
    this.mediaConfig = subscriberConfig;
    this.checkMediaCondition();
    this.updateCloseTimer();
  }
  protected configureQuality(quality: VideoSetting) {
    this.signaling.configureReceiver(this.descriptor, quality);
  }

  public async updateStats() {
    const stats = await super.updateStats();

    const packetLoss = stats?.inbound?.packetLoss || 0;
    if (packetLoss > PACKET_LOSS_THRESHOLD) {
      this.lossCount++;
      // wait for one round if the publishers control takes care
      if (this.lossCount >= 2) {
        this.bandwidthController.downgradeTemporarily();
      }
    } else if (packetLoss < PACKET_LOSS_THRESHOLD / 2) {
      this.lossCount = Math.max(0, this.lossCount - 1);
    }

    if (this.lossCount > 0) {
      console.debug(`lossCount: ${this.lossCount}`, this.descriptor);
    }

    return stats;
  }

  private addTrackHandler(track: MediaStreamTrack) {
    const updateStateHandler = this.updateState.bind(this);
    track.addEventListener('mute', updateStateHandler);
    track.addEventListener('unmute', updateStateHandler);
    const endedHandler = () => {
      track.removeEventListener('mute', updateStateHandler);
      track.removeEventListener('unmute', updateStateHandler);
      track.removeEventListener('ended', endedHandler);
    };
    track.addEventListener('ended', endedHandler);
  }

  private updateState() {
    const nextState: SubscriberState = {
      videoRunning: false,
      audioRunning: false,
      connection: this.peerConnection.iceConnectionState,
    };
    if (this.peerConnection.iceConnectionState === 'connected' && this.stream?.active) {
      const liveTracks = this.stream.getTracks().filter((track) => track.readyState === 'live');
      // Allows us to recognize when a track has problems.
      // See https://w3c.github.io/mediacapture-main/#track-muted

      nextState.audioRunning = some(liveTracks, { kind: 'audio', muted: false });
      nextState.videoRunning = some(liveTracks, { kind: 'video', muted: false });
    }
    if (isEqual(this.subscriberState, nextState)) {
      return;
    }
    this.subscriberState = nextState;
    this.eventEmitter.emit('subscriberstatechanged', { subscriberState: this.subscriberState, ...this.descriptor });
    this.checkMediaCondition();
  }

  private onTrackHandler(event: RTCTrackEvent) {
    if (event.streams.length === 0) {
      return;
    }

    if (event.streams.length > 1) {
      console.warn('subscribe: track is part of more than one media stream:', event);
    }

    if (this.stream) {
      if (this.stream !== event.streams[0]) {
        console.error(
          'Received new track for a new stream: Peer connection with more than one stream? skipping track',
          event
        );
        return;
      }
      this.addTrackHandler(event.track);
    } else {
      this.stream = event.streams[0];
      this.stream.getTracks().forEach((track) => this.addTrackHandler(track));
      this.updateQualityTarget();
      this.readyHandlers.forEach((handler) => handler({ stream: this.stream }));
      this.readyHandlers = []; // clear when successful
    }
    this.updateState();
  }

  /**
   * @returns {Promise<MediaStream>} That resolves once the first track is available on the MediaStream.
   */
  public getMediaStream = () =>
    new Promise<MediaStream>((resolve, reject) => {
      if (this.stream) {
        resolve(this.stream);
      } else {
        this.readyHandlers.push(({ stream, reason }) => {
          stream ? resolve(stream) : reject(reason);
        });
      }
    });

  private _updateQualityTarget = () => {
    const settings = this.qualityTargetCount.map((count, setting) => (count > 0 ? setting : VideoSetting.Off));
    let maxQuality = max(settings);
    if (maxQuality === undefined) {
      maxQuality = VideoSetting.Off;
    }

    this.setQualityTarget(maxQuality);
    this.updateCloseTimer();
  };

  public isActive() {
    return this.mediaConfig.audio || (this.mediaConfig.video && this.currentQuality !== VideoSetting.Off);
  }

  private releaseCallback = (target: VideoSetting) => () => {
    const count = this.qualityTargetCount[target];
    if (count === undefined || count < 1) {
      console.error('release qualityTarget when none is reserved');
      return;
    }
    this.qualityTargetCount[target] = count - 1;
    this.updateQualityTarget();
  };

  public requestQuality(target: VideoSetting): (() => void) | undefined {
    if (target === VideoSetting.Off) {
      // no need to reserve
      return undefined;
    }

    const count = this.qualityTargetCount[target] || 0;
    this.qualityTargetCount[target] = count + 1;
    this.updateQualityTarget();

    return this.releaseCallback(target);
  }

  private async answerOffer(sdp: string) {
    await this.peerConnection.setRemoteDescription({
      sdp: sdp,
      type: 'offer',
    });
    const answer = await this.peerConnection.createAnswer({
      iceRestart: this.expectRestart,
    });
    this.expectRestart = false;
    await this.peerConnection.setLocalDescription(answer);
    return answer;
  }

  public handleOffer(sdp: string) {
    this.answerOffer(sdp)
      .then((answer) => {
        if (answer.sdp) {
          this.signaling.sdpAnswer(answer.sdp, this.descriptor);
        } else {
          console.warn('createAnswer returned no SDP', this.descriptor, answer, sdp);
        }
      })
      .catch((e) => {
        console.error('Failed to handle sdp offer', e, this.descriptor, sdp);
        this.close();
      });
  }

  public close() {
    this.stream?.getTracks().forEach((t) => t.stop());
    this.subscriberState = { audioRunning: false, videoRunning: false, connection: 'closed' };
    this.stopReconnectTimer();
    this.closeTimerHandle && clearTimeout(this.closeTimerHandle);
    super.close();
  }
}
