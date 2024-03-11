// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BreakoutRoomId, GroupId, ParticipantId, ParticipationKind, Role, WaitingState } from './common';
import { ProtocolAccess } from './protocol';

export interface Participant {
  id: ParticipantId;
  breakoutRoomId: BreakoutRoomId | null;
  displayName: string;
  avatarUrl?: string;
  handIsUp: boolean;
  joinedAt: string;
  leftAt: string | null;
  handUpdatedAt?: string;
  groups: GroupId[];
  participationKind: ParticipationKind;
  lastActive: string;
  role?: Role;
  waitingState: WaitingState;
  protocolAccess: ProtocolAccess;
  isPresenter: boolean;
  isSpeaking: boolean;
}

export type FilterableParticipant = Pick<Participant, 'displayName'>;
