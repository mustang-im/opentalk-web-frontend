// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  BackendParticipant,
  ErrorStruct,
  isErrorStruct,
  NamespacedIncoming,
  ParticipantId,
  ParticipantMediaState,
  Tariff,
  Timestamp,
} from '@opentalk/common';
import { InitialAutomod } from '@opentalk/components';

import { InitialPoll } from '../../../store/slices/pollSlice';
import { TimerKind, TimerStyle } from '../outgoing/timer';
import { InitialBreakout } from './breakout';
import { InitialChat } from './chat';

interface AssociatedParticipant {
  id: ParticipantId;
}

export enum Role {
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
}

export interface WhiteboardState {
  status: 'initialized' | 'not_initialized';
  url: string;
}

export interface RecordingState {
  state: 'recording';
  recordingId?: string;
}

export interface TimerState {
  endsAt: Timestamp;
  kind: TimerKind;
  readyCheckEnabled: boolean;
  startedAt: Timestamp;
  style: TimerStyle;
  timerId: string;
}

export interface JoinSuccess {
  message: 'join_success';
  id: ParticipantId;
  role: Role;
  avatarUrl?: string;
  participants: Array<BackendParticipant>;
  chat: InitialChat;
  automod?: InitialAutomod;
  breakout?: InitialBreakout;
  polls: InitialPoll;
  whiteboard?: WhiteboardState;
  moderation?: {
    raiseHandsEnabled: boolean;
    waitingRoomParticipants: Array<BackendParticipant>;
    waitingRoomEnabled: boolean;
  };
  media?: ParticipantMediaState;
  recording: null | RecordingState;
  timer?: TimerState;
  tariff: Tariff;
  closesAt: Timestamp;
}

export interface JoinBlocked {
  message: 'join_blocked';
  reason: 'participant-limit-reached';
}

export interface Joined extends BackendParticipant {
  message: 'joined';
}

export interface Left extends AssociatedParticipant {
  message: 'left';
}

export interface Update extends BackendParticipant {
  message: 'update';
}

export interface RoleUpdated {
  message: 'role_updated';
  newRole: Role;
}

// Currently this is a string
export type ControlError = string;

export const isError = isErrorStruct;

export type Message = JoinSuccess | JoinBlocked | Update | Joined | Left | RoleUpdated | ErrorStruct<ControlError>;
export type Control = NamespacedIncoming<Message, 'control'>;

export default Control;
