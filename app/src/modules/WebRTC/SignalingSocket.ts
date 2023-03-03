// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { Message as IncomingMessage } from '../../api/types/incoming';
import { Message as OutgoingMessage } from '../../api/types/outgoing';
import { BaseEventEmitter } from '../EventListener';

// Currently, this is a living spec
const API_VERSION = '1.0';

/*
 * Signaling state chart:
 *              connect()     connection lost / reconnect()
 *             /             /
 * connecting -> connected <-> disconnected -+-> closed
 *            \____________\________________/
 *               close() is possible from all states
 */
export type SignalingState = 'connected' | 'disconnected' | 'closed';

export type SignalingConnectionEvent = {
  connectionstatechange: SignalingState;
  message: IncomingMessage;
};

export class SignalingSocket extends BaseEventEmitter<SignalingConnectionEvent> {
  private readonly url: URL;
  private readonly socket;

  private _debugReconnect = false;

  constructor(url: URL, ticket: string) {
    super();
    this.url = url;
    const windowRef = window;
    windowRef.debugKillSignaling = () => {
      this._debugReconnect = true;
      this.socket.close();
    };

    this.socket = new WebSocket(this.url, [`ticket#${ticket}`, `k3k-signaling-json-v${API_VERSION}`]);
    this.socket.onopen = this.onConnected;
    this.socket.onmessage = (ev) => {
      const message: IncomingMessage = convertToCamelCase(JSON.parse(ev.data), {
        // We exclude votingRecord, lastSeenTimestamp* because they contain id that must not be converted to the camel case
        // as we can no longer map them to the participants.
        stopPaths: [
          'payload.voting_record',
          'payload.chat.last_seen_timestamps_private',
          'payload.chat.last_seen_timestamps_group',
        ],
        deep: true,
      });
      this.eventEmitter.emit('message', message);
    };
    this.socket.onclose = this.onClose;
  }

  public isOpen() {
    return this.socket.readyState === WebSocket.OPEN;
  }

  private onConnected = () => {
    this.eventEmitter.emit('connectionstatechange', 'connected');
  };

  public sendMessage(message: OutgoingMessage) {
    let convertedMessage: OutgoingMessage;
    if (message.namespace === 'media' && message.payload.action === 'sdp_candidate') {
      convertedMessage = convertToSnakeCase(message, {
        exclude: ['sdpMLineIndex', 'sdpMid'],
      });
    } else {
      convertedMessage = convertToSnakeCase(message);
    }

    if (this.isOpen()) {
      this.socket.send(JSON.stringify(convertedMessage));
    } else {
      throw new Error('Websocket is not connected or not ready');
    }
  }

  public disconnect = () => {
    if (!this.isOpen()) {
      console.warn('disconnect signaling when not connected');
    }
    this.socket.close(1000, 'Normal Shutdown');
  };

  // For closure status codes see: https://www.rfc-editor.org/rfc/rfc6455.html#section-7.4.1
  private onClose = (e: CloseEvent) => {
    console.debug(`signaling socket closed with ${e.code}: ${e.reason}`);
    this.socket.onmessage = null;
    this.socket.onclose = null;

    // TODO remove
    if (this._debugReconnect) {
      console.info(`Debug action: mimic signaling websocket connection error`);
      this.eventEmitter.emit('connectionstatechange', 'disconnected');
      return;
    }
    switch (e.code) {
      case 1000:
      case 1001:
        // normal disconnect
        this.eventEmitter.emit('connectionstatechange', 'closed');
        break;

      case 1005: // No status / debug disconnect
      case 1006: // Abnormal closure
      case 1007: // Unsupported payload
      case 1012: // Server restart
      case 1013: // Try again later
        console.warn(`Connection Lost: Signaling websocket closed with reason ${e.code}: ${e.reason}`);
        this.eventEmitter.emit('connectionstatechange', 'disconnected');
        break;
      default:
        console.error(`Connection Lost: Signaling websocket closed with reason ${e.code}: ${e.reason}`);
        this.eventEmitter.emit('connectionstatechange', 'closed');
        break;
    }
  };
}
