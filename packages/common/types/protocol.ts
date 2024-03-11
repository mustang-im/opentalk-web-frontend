// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from './common';

export interface ProtocolParticipant {
  id: ParticipantId;
  displayName: string;
  avatarUrl?: string;
  isSelected: boolean;
}

export enum ProtocolAccess {
  Read = 'read',
  Write = 'write',
  None = 'none',
}

export interface ProtocolState {
  readonly: boolean;
}
