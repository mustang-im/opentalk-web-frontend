// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  BackendParticipant,
  NamespacedIncoming,
  ParticipantId,
  Timestamp,
  TimerKind,
  TimerStyle,
} from '@opentalk/common';

export interface TimerStarted {
  message: 'started';
  timerId: string;
  readyCheckEnabled: boolean;
  endsAt: Timestamp;
  title?: string;
  startedAt: Timestamp;
  kind?: TimerKind;
  style?: TimerStyle;
}

export enum TimerStopKind {
  ByModerator = 'by_moderator',
  Expired = 'expired',
  CreatorLeft = 'creator_left',
}

export interface TimerStopped {
  message: 'stopped';
  participantId: ParticipantId;
  kind: TimerStopKind;
}

/* MODERATOR ONLY */

// Signals to moderator that a participant is ready to continue
export interface ReadyToContinue extends BackendParticipant {
  message: 'updated_ready_status';
  status: boolean;
  participantId: ParticipantId;
}

export type Message = TimerStarted | TimerStopped | ReadyToContinue;

export type Timer = NamespacedIncoming<Message, 'timer'>;

export default Timer;
