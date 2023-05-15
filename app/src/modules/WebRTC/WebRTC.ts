// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  MediaSessionState,
  MediaSessionType,
  ParticipantId,
  Timestamp,
  TrickleCandidate,
  VideoSetting,
} from '@opentalk/common';

import { MediaStatusChange } from '../../api/types/incoming/media';
import { formatBitRate } from '../../utils/numberUtils';
import { BaseEventEmitter } from '../EventListener';
import { BandwidthController } from './BandwidthController';
import { BaseWebRtcConnection } from './BaseWebRtcConnection';
import { MediaSignaling } from './MediaSignaling';
import { PublisherConnection } from './PublisherConnection';
import { StatsEvent } from './Statistics/ConnectionStats';
import { SubscriberConnection, SubscriberState } from './SubscriberConnection';
import { TurnProvider } from './TurnProvider';

const STATS_INTERVAL = 2000; // ms

export interface MediaDescriptor {
  participantId: ParticipantId;
  mediaType: MediaSessionType;
}

export type MediaId = string & { readonly __tag: unique symbol };

export const idFromDescriptor = (descriptor: MediaDescriptor): MediaId =>
  `${descriptor.participantId}/${descriptor.mediaType}` as MediaId;

export const descriptorFromId = (id: MediaId): MediaDescriptor => {
  const [participantId, mediaType] = id.split('/');
  return { participantId: participantId as ParticipantId, mediaType: mediaType as MediaSessionType };
};

export type SubscriberConfig = MediaDescriptor & MediaSessionState;

export interface SubscriberStateChanged extends MediaDescriptor {
  subscriberState: SubscriberState;
}

export interface QualityLimit extends MediaDescriptor {
  limit: VideoSetting;
}

export type WebRtcContextEvent = {
  // A 'subscriberadded' event is sent when a new connection was created.
  subscriberadded: SubscriberConfig;
  // A 'subscriberchange' event is sent when an existing connection has been updated.
  subscriberchange: SubscriberConfig;
  // A 'subscriberstatechanged' event is sent when the state of a subscriber media stream changes, e.g. the first track is online.
  subscriberstatechanged: SubscriberStateChanged;
  // A 'subscriberclose' event is sent when a new connection was closed and removed from the WebRTC context.
  subscriberclose: MediaDescriptor;
  // 'statsUpdated' reports the connection bandwidth and packet loss for all active connections
  statsupdated: Record<MediaId, StatsEvent>;
  subscriberLimit: QualityLimit;
  upstreamLimit: VideoSetting;
};

export class WebRtc extends BaseEventEmitter<WebRtcContextEvent> {
  private statsBitrate = { up: 0, down: 0, upLoss: 0, downLoss: 0 };
  private readonly maxVideoBandwidth: number;
  private readonly signaling: MediaSignaling;
  private readonly turnProvider: TurnProvider;

  /*
  This map hold the state of all known subscribers
  `connection` is set, when it is initiated until then
  `action` holds a promise to await the initialisation
  `state` reflects the backend state and is updated as early as possible
  */
  private subscribers: Map<
    MediaId,
    { connection?: SubscriberConnection; action?: Promise<SubscriberConnection>; state: SubscriberConfig }
  > = new Map();

  private publishers: Map<MediaId, PublisherConnection> = new Map();
  private statsTimer?: NodeJS.Timer;

  private publisherController = new BandwidthController(4 * STATS_INTERVAL, 10 * 60_000, STATS_INTERVAL);

  public constructor(signaling: MediaSignaling, turnProvider: TurnProvider, maxVideoBandwidth: number) {
    super();
    this.maxVideoBandwidth = maxVideoBandwidth;
    this.signaling = signaling;
    this.turnProvider = turnProvider;

    this.startStats();

    this.publisherController.addEventListener('limit', async (limit: VideoSetting) => {
      this.eventEmitter.emit('upstreamLimit', limit);
      this.publishers.forEach((publisher) => publisher.updateQualityLimit(limit));
    });
    //downgrade on startup
    this.publisherController.downgradeTemporarily();
  }

  private startStats() {
    if (this.statsTimer === undefined) {
      this.statsTimer = setInterval(async () => {
        const statsMap: Record<MediaId, StatsEvent> = {};

        const fetchStats = async (mediaId: MediaId, connection: BaseWebRtcConnection) => {
          const connectionStats = await connection.updateStats();
          if (connectionStats !== undefined) {
            statsMap[mediaId] = connectionStats;
          }
        };

        for (const [mediaId, subscriberItem] of this.subscribers) {
          const subscriber = subscriberItem.connection;
          if (subscriber) {
            await fetchStats(mediaId, subscriber);
          }
        }

        for (const [mediaId, publisher] of this.publishers) {
          await fetchStats(mediaId, publisher);
        }

        this.statsBitrate = Object.values(statsMap).reduce(
          (acc, { connection, inbound, outbound }) => {
            const result = {
              up: acc.up + (connection?.bitRateUp || outbound?.bitRate || 0),
              down: acc.down + (connection?.bitRateDown || inbound?.bitRate || 0),
              downLoss: 0,
              upLoss: 0,
            };
            if (inbound) {
              result.downLoss = Math.max(acc.downLoss, connection?.packetLoss || inbound?.packetLoss || 0);
            }
            if (outbound) {
              result.upLoss = Math.max(acc.upLoss, connection?.packetLoss || outbound?.packetLoss || 0);
            }
            return result;
          },
          { up: 0, down: 0, upLoss: 0, downLoss: 0 }
        );

        if (this.statsBitrate.upLoss > 0.05) {
          this.publisherController.downgradeTemporarily();
        }

        if (this.statsBitrate.upLoss > 0 || this.statsBitrate.downLoss > 0) {
          console.debug(
            `bandwidth up:${formatBitRate(this.statsBitrate.up)} down:${formatBitRate(
              this.statsBitrate.down
            )} upLoss:${((this.statsBitrate.upLoss || 0) * 100).toFixed(2)}% downLoss:${(
              (this.statsBitrate.downLoss || 0) * 100
            ).toFixed(2)}%`,
            statsMap
          );
        }

        this.eventEmitter.emit('statsupdated', statsMap);
      }, STATS_INTERVAL);
    }
  }

  private stopStats() {
    if (this.statsTimer !== undefined) {
      clearInterval(this.statsTimer);
      this.statsTimer = undefined;
    }
  }

  private getPublisherConnection = (descriptor: MediaDescriptor) => this.publishers.get(idFromDescriptor(descriptor));

  private getSubscriberConnection(descriptor: MediaDescriptor) {
    const subscriber = this.subscribers.get(idFromDescriptor(descriptor));
    if (subscriber === undefined) {
      throw new Error(`unknown connection (handle: ${idFromDescriptor(descriptor)})`);
    }
    if (subscriber?.action) {
      return subscriber?.action;
    }
    if (subscriber.connection === undefined) {
      throw new Error(`no connection for subscription for ${idFromDescriptor(descriptor)}`);
    }
    return subscriber.connection;
  }

  // To be used for the dispatch signaling messages on _existing_ connections
  private async getOnlineConnection(descriptor: MediaDescriptor) {
    const connection = this.getPublisherConnection(descriptor) || (await this.getSubscriberConnection(descriptor));
    if (connection === undefined) {
      throw new Error(`unknown connection (handle: ${idFromDescriptor(descriptor)})`);
    }
    return connection;
  }

  /**
   * Gets called with signals from the signaling server when a EndOfSdpCandidates arrives.
   *
   * @param descriptor
   */
  public async handleEndOfSdpCandidates(descriptor: MediaDescriptor) {
    const connection = await this.getOnlineConnection(descriptor);
    return connection.handleSdpCandidate();
  }

  /**
   * Gets called with signals from the signaling server when a SDPCandidate arrives.
   *
   * In this case to react to this event, you should bind to the onTrack callback which is exposed via the Promise from the subscribe function
   * @param descriptor
   * @param candidate
   */
  public async handleSdpCandidate(descriptor: MediaDescriptor, candidate: TrickleCandidate) {
    const connection = await this.getOnlineConnection(descriptor);
    return connection.handleSdpCandidate(candidate);
  }

  /**
   * Gets called with signals from the signaling server when an SDPOffer arrives.
   *
   * The onSdpOffer callback should send the passed answer to the signaling server.
   * @param descriptor
   * @param sdp
   */
  public async handleSdpOffer(descriptor: MediaDescriptor, sdp: string) {
    const subscriber = await this.getSubscriberConnection(descriptor);
    subscriber.handleOffer(sdp);
  }

  /**
   * Gets called with signals from the signaling server when an SDPAnswer arrives.
   *
   * In this case to react to this event, you should bind to the onTrack callback which is exposed via the Promise from the subscribe function
   * @param descriptor
   * @param sdp
   */
  public async handleSdpAnswer(descriptor: MediaDescriptor, sdp: string) {
    const connection = await this.getOnlineConnection(descriptor);
    if (connection instanceof PublisherConnection) {
      connection.handleAnswer(sdp);
    } else {
      console.error(
        `SDP answer is expected on publishers only. suscriber: ${idFromDescriptor(descriptor)} ; SDP message: ${sdp}`
      );
    }
  }

  /**
   * Gets called when a connection is up/down from the perspective of the signaling server.
   *
   * @param descriptor
   * @param up
   */
  public async setConnectionState(descriptor: MediaDescriptor, up: boolean) {
    const connection = await this.getOnlineConnection(descriptor).catch(() => {
      if (up) {
        console.error(
          `failed to set connection state 'up' because there is no connection available for subscriber ${idFromDescriptor(
            descriptor
          )}.`
        );
      }
      return undefined;
    });
    if (connection !== undefined) {
      connection.up = up;
    }
  }

  public async handleMediaStatus(descriptor: MediaDescriptor, statusChange: MediaStatusChange) {
    const connection = await this.getOnlineConnection(descriptor);
    if (connection instanceof PublisherConnection) {
      connection.updateMediaStatus(statusChange);
    } else {
      console.error(
        `media status is expected on publishers only. subscriber:${idFromDescriptor(descriptor)}; change:'${
          statusChange.kind
        }': ${statusChange.receiving}`
      );
    }
  }

  /**
   * Gets called when the backend sees thar a connection is slow, i.e. has packet loss.
   *
   * @param descriptor
   * @param direction
   * @param timestamp
   */
  public async handleSlowNotification(
    descriptor: MediaDescriptor,
    direction: 'upstream' | 'downstream',
    timestamp: Timestamp
  ) {
    const connection = await this.getOnlineConnection(descriptor);
    if (connection instanceof PublisherConnection) {
      console.debug('publisher slow link message', descriptor, direction, timestamp);
    }
    if (connection instanceof SubscriberConnection) {
      console.debug('subscriber slow link message', descriptor, direction, timestamp);
    }
  }

  /**
   * Gets called to access subscribers the media stream.
   *
   * @param descriptor
   */
  public async getMediaStream(descriptor: MediaDescriptor): Promise<MediaStream> {
    const mediaId = idFromDescriptor(descriptor);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw new Error(`subscriber media (handle: ${mediaId}) not available`);
    }
    if (subscriber.connection !== undefined) {
      return subscriber.connection.getMediaStream();
    }

    if (subscriber.action === undefined) {
      subscriber.action = this.createSubscriber(subscriber.state);
      this.subscribers.set(mediaId, subscriber);
    }
    const connection = await subscriber.action;
    subscriber.action = undefined;
    subscriber.connection = connection;
    this.subscribers.set(mediaId, subscriber);
    return connection.getMediaStream();
  }

  public async requestQuality(descriptor: MediaDescriptor, target: VideoSetting): Promise<(() => void) | undefined> {
    const mediaId = idFromDescriptor(descriptor);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw new Error(`subscriber media (handle: ${idFromDescriptor(descriptor)}) not available`);
    }

    let connection = subscriber.connection;
    if (subscriber.action !== undefined) {
      connection = await subscriber.action;
    }

    if (connection === undefined) {
      subscriber.action = this.createSubscriber(subscriber.state);
      this.subscribers.set(mediaId, subscriber);
      subscriber.action.catch((e) => console.error('failed to fetch TURN credentials', e));
      connection = await subscriber.action;
    }
    return connection.requestQuality(target);
  }

  private async createSubscriber(subscriberConfig: SubscriberConfig): Promise<SubscriberConnection> {
    const mediaId = idFromDescriptor(subscriberConfig);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw new Error(`Subscriber was closed while connect in progress for ${idFromDescriptor(subscriberConfig)}`);
    }
    if (subscriber?.connection) {
      throw new Error(`Subscriber connection already exists for ${idFromDescriptor(subscriberConfig)}`);
    }

    const iceServers = await this.turnProvider.get();

    subscriber.state = subscriberConfig;
    const connection = new SubscriberConnection(iceServers, subscriberConfig, this.signaling);

    const closeHandler = () => {
      const mediaId = idFromDescriptor(subscriberConfig);
      this.eventEmitter.emit('subscriberclose', subscriberConfig);
      const subscriber = this.subscribers.get(mediaId);
      if (subscriber !== undefined) {
        subscriber.connection = undefined;
        this.subscribers.set(mediaId, subscriber);
      } else {
        console.warn(`missing WebRTC subsciber state for ${mediaId}`);
      }
      connection.removeEventListener('closed', closeHandler);
      connection.removeEventListener('subscriberstatechanged', changeHandler);
      connection.removeEventListener('qualityLimit', limitHandler);
    };

    const changeHandler = (subscriberStateEvent: SubscriberStateChanged) => {
      this.eventEmitter.emit('subscriberstatechanged', subscriberStateEvent);
    };

    const limitHandler = (qualityLimit: QualityLimit) => {
      this.eventEmitter.emit('subscriberLimit', qualityLimit);
    };

    connection.addEventListener('closed', closeHandler);
    connection.addEventListener('subscriberstatechanged', changeHandler);
    connection.addEventListener('qualityLimit', limitHandler);

    subscriber.connection = connection;
    subscriber.action = undefined;
    this.subscribers.set(mediaId, subscriber);
    return connection;
  }

  /**
   * Gets called with signals from the signaling server when the media state has changed or
   * the availability of a participant has changed.
   *
   * Will initiate a subscriber connection for new media a descriptors is available
   *
   * @param subscriberConfig
   */
  public updateMedia(subscriberConfig: SubscriberConfig) {
    const mediaId = idFromDescriptor(subscriberConfig);

    if (!this.subscribers.has(mediaId)) {
      this.subscribers.set(mediaId, { state: subscriberConfig });
      this.eventEmitter.emit('subscriberadded', subscriberConfig);
    }

    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      throw 'subscriber not available when added just before';
    }

    if (subscriberConfig.audio && subscriber.connection === undefined) {
      if (subscriber.action === undefined) {
        subscriber.action = this.createSubscriber(subscriberConfig);
        this.subscribers.set(mediaId, subscriber);
        subscriber.action.catch((e) => console.error('failed to fetch TURN credentials', e));
      } else {
        console.debug(`updating subscriber while connect in progress - skip notification`, subscriberConfig);
      }
    } else {
      subscriber.connection?.updateConfig(subscriberConfig);
      this.eventEmitter.emit('subscriberchange', subscriberConfig);
    }
  }

  public async unsubscribe(descriptor: MediaDescriptor) {
    const mediaId = idFromDescriptor(descriptor);
    const subscriber = this.subscribers.get(mediaId);
    if (subscriber === undefined) {
      return;
    }
    subscriber.connection?.close();
    subscriber.connection = undefined;
  }

  public async unsubscribeParticipant(id: ParticipantId) {
    const videoDescriptor = { participantId: id, mediaType: MediaSessionType.Video };
    const screenDescriptor = { participantId: id, mediaType: MediaSessionType.Screen };

    const videoConnection = this.subscribers.get(idFromDescriptor(videoDescriptor));
    if (videoConnection) {
      await this.unsubscribe(videoDescriptor);
    }
    const screenConnection = this.subscribers.get(idFromDescriptor(screenDescriptor));
    if (screenConnection) {
      await this.unsubscribe(screenDescriptor);
    }
  }

  public async createPublisher(descriptor: MediaDescriptor, stream: MediaStream, quality: VideoSetting) {
    const mediaId = idFromDescriptor(descriptor);
    // async work first to avoid races
    const iceServers = await this.turnProvider.get();
    const oldConnection = this.getPublisherConnection(descriptor);
    if (oldConnection !== undefined) {
      throw new Error(`republishing for ${descriptor.mediaType} - close old connection first`);
    }

    const connection = new PublisherConnection(
      iceServers,
      descriptor,
      this.signaling,
      stream,
      quality,
      this.maxVideoBandwidth
    );
    const videoCloseHandler = () => {
      this.publishers.delete(mediaId);
      connection.removeEventListener('closed', videoCloseHandler);
    };
    connection.addEventListener('closed', videoCloseHandler);
    this.publishers.set(mediaId, connection);

    connection.updateQualityLimit(this.publisherController.qualityLimit);

    return connection;
  }

  /**
   * This function cancels the connection to each subscriber in case of a shutdown.
   **/
  public close() {
    console.info('shutdown webRTC context');
    this.stopStats();

    this.publishers.forEach((publisher) => publisher.close());
    this.publishers.clear();

    this.subscribers.forEach(({ connection }) => connection?.close());
    this.subscribers.clear();

    this.eventEmitter.all.clear();
  }
}
