// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Opaque } from 'type-fest';

import { SipId } from './room';
import { BaseUser } from './user';

export type UserId = Opaque<string, 'userId'>;
export type Email = Opaque<string, 'email'>;

export type DateTime = Opaque<string, 'dateTime'>;

export enum Tag {
  Room = 'Room',
  Tariff = 'Tariff',
  RoomInvite = 'RoomInvite',
  User = 'User',
  FindUser = 'FindUser',
  Event = 'Event',
  EventInstance = 'EventInstance',
  EventInvite = 'EventInvite',
  Asset = 'Asset',
  StreamingTargets = 'StreamingTargets',
}

export const tags = Object.entries(Tag).map(([, value]) => value);

/**
 * This extracts all possible elements of tags as
 */
export type Tags = typeof tags[number];

export type DateTimeWithTimezone = {
  /**
   * datetime in UTC, formatted as RFC3339/ISO8601 string
   */
  datetime: string;
  /**
   * Valid IANA timezone string, usually retrieved via
   * Intl.DateTimeFormat().resolvedOptions().timeZone;
   */
  timezone: string;
};

/**
 * The status of an invite
 */
export enum InviteStatus {
  Accepted = 'accepted',
  Tentative = 'tentative',
  Pending = 'pending',
  Declined = 'declined',
  Added = 'added',
}

export type PagePaginated<T> = {
  first?: number;
  prev?: number;
  next?: number;
  last?: number;

  data: Array<T>;
};

export type CursorPaginated<T> = {
  before?: string;
  after?: string;
  data: Array<T>;
};

export interface EntityBase {
  createdBy: BaseUser;
  createdAt: DateTime;
  updatedBy: BaseUser;
  updatedAt: DateTime;
}

export interface CallIn {
  id: SipId;
  tel: string;
  password: string;
  uri?: string;
}
