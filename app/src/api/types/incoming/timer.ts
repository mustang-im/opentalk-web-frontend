// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BackendParticipant, NamespacedIncoming, ParticipantId, Timestamp } from '@opentalk/common';

export interface StartTimer {
  message: 'started';
  timerId: string;
  readyCheckEnabled: boolean;
  endsAt: Timestamp;
  kind: 'count_down' | 'count_up';
  title?: string;
  startedAt: Timestamp;
}
export interface StopTimer {
  message: 'stopped';
  participantId: ParticipantId;
  kind: 'by_moderator' | 'expired' | 'creator_left';
}

/* MODERATOR ONLY */

// Signals to moderator that a participant is ready to continue
export interface ReadyToContinue extends BackendParticipant {
  message: 'updated_ready_status';
  status: boolean;
  participantId: ParticipantId;
}

export type Message = StartTimer | StopTimer | ReadyToContinue;

export type Timer = NamespacedIncoming<Message, 'timer'>;

export default Timer;
