// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DateTime } from './common';
import { User } from './user';

export type Invite = {
  inviteCode: string;
  room: string;
  active: boolean;
  expiration: DateTime;
  created: DateTime;
  createdBy: User;
  updated: DateTime;
  updatedBy: User;
};

export type Invites = Array<Invite>;

export type CreateInvitePayload = {
  expiration?: DateTime;
};
