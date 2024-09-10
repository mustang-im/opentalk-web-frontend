// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from './common';

export interface MeetingNotesParticipant {
  id: ParticipantId;
  displayName: string;
  avatarUrl?: string;
  isSelected: boolean;
}

export enum MeetingNotesAccess {
  Read = 'read',
  Write = 'write',
  None = 'none',
}

export interface MeetingNotesState {
  readonly: boolean;
}
