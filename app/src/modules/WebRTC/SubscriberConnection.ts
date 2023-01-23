// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting } from '@opentalk/common';
import { debounce, max } from 'lodash';

import { BandwidthController } from './BandwidthController';
import { BaseWebRtcConnection } from './BaseWebRtcConnection';
import { MediaSignaling } from './MediaSignaling';
import { MediaDescriptor, MediaStreamState } from './WebRTC';

const QUALITY_DEBOUNCE_TIME = 500; //ms

export class SubscriberConnection extends BaseWebRtcConnection {
  private stream: MediaStream | undefined;
  private streamState: MediaStreamState = MediaStreamState.Offline;
  private qualityTargetCount: Array<number> = [];

  private readyHandlers: (({ stream, reason }: { stream?: MediaStream; reason?: string }) => void)[] = [];

  // use a random base interval to avoid control ringing
  private bandwidthController = new BandwidthController(4000 * (0.7 + Math.random()), 5 * 60_000, 1000);
  private lossCount = 0;

  private readonly updateQualityTarget: () => void;

  constructor(iceServers: RTCIceServer[], descriptor: MediaDescriptor, signaling: MediaSignaling) {
    // quality setting needs to match the default setting of the backend
    super(iceServers, descriptor, signaling, VideoSetting.High);

    this.peerConnection.addEventListener('iceconnectionstatechange', () => {
      const state = this.peerConnection.iceConnectionState;
      switch (state) {
        case 'closed':
          //TODO reconnect?
          this.close();
          break;
        case 'disconnected':
          this.streamState = MediaStreamState.Disconnected;
          this.eventEmitter.emit('streamstatechanged', { streamState: this.streamState, ...this.descriptor });
          console.warn('Subscriber connection disconnected');
          break;
        case 'failed':
          this.streamState = MediaStreamState.Failed;
          this.eventEmitter.emit('streamstatechanged', { streamState: this.streamState, ...this.descriptor });
          console.warn('Subscriber connection failed');
          break;
      }
    });
    this.peerConnection.addEventListener('track', (event) => this.onTrackHandler(event));
    this.signaling.requestOffer(descriptor);

    this.bandwidthController.addEventListener('limit', async (limit: VideoSetting) => {
      this.eventEmitter.emit('qualityLimit', { ...descriptor, limit });
      this.updateQualityLimit(limit);
    });

    this.updateQualityTarget = debounce(this._updateQualityTarget.bind(this), QUALITY_DEBOUNCE_TIME, {
      maxWait: 2 * QUALITY_DEBOUNCE_TIME,
    });

    //downgrade on startup
    this.bandwidthController.downgradeTemporarily();
  }

  protected configureQuality(quality: VideoSetting) {
    this.signaling.configureReceiver(this.descriptor, quality);
  }

  public async updateStats() {
    const stats = await super.updateStats();

    const packetLoss = stats?.inbound?.packetLoss || 0;
    if (packetLoss > 0.05) {
      this.lossCount++;
      // wait for one round if the publishers control takes care
      if (this.lossCount >= 2) {
        this.bandwidthController.downgradeTemporarily();
      }
    } else if (packetLoss < 0.01) {
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
    let nextState = MediaStreamState.Offline;
    if (this.stream?.active) {
      const liveTracks = this.stream.getTracks().filter((t) => t.readyState === 'live');
      // Allows us to recognize when a track has problems.
      // See https://w3c.github.io/mediacapture-main/#track-muted
      const brokenTracks = liveTracks.filter((t) => t.muted);

      if (brokenTracks.length === liveTracks.length) {
        nextState = MediaStreamState.Broken;
      } else if (brokenTracks.length > 0) {
        const audioBroken = brokenTracks.find((e) => e.kind === 'audio');
        const videoBroken = brokenTracks.find((e) => e.kind === 'video');

        if (audioBroken) {
          nextState = MediaStreamState.AudioBroken;
        }
        if (videoBroken) {
          nextState = MediaStreamState.VideoBroken;
        }
      } else {
        nextState = MediaStreamState.Ok;
      }
    }

    if (this.streamState !== nextState) {
      this.streamState = nextState;

      this.eventEmitter.emit('streamstatechanged', { streamState: this.streamState, ...this.descriptor });
    }
    this.streamState = nextState;
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
  };

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
      iceRestart: false,
    });
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
    this.streamState = MediaStreamState.Offline;
    super.close();
  }
}
