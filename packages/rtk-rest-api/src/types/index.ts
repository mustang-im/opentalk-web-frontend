// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

export * from './common';
export * from './streaming';
export * from './tariff';
export type { UserMe, BaseUser, UpdateMePayload, User, RegisteredUser, UserOwnedAssets, UserOwnedAsset } from './user';
export { UserRole } from './user';
export type {
  Event,
  TimelessEvent,
  SingleEvent,
  RecurringEvent,
  EventException,
  EventInstance,
  EventAndInstanceId,
  EventInstanceId,
  EventId,
  CreateEventPayload,
  CreateEventExceptionPayload,
  UpdateEventPayload,
  UpdateEventInstancePayload,
  TimedEvent,
  RecurrencePattern,
  SharedFolderData,
} from './event';
export type {
  RoomId,
  InviteCode,
  SipId,
  PublicRoom,
  PrivateRoom,
  UpdateRoomPayload,
  CreateRoomPayload,
  RoomAssets,
  RoomInvite,
} from './room';
export type { EventInvite, CreateEventInvitePayload } from './eventInvite';
export {
  isTimelessEvent,
  isSingleEvent,
  isRecurringEvent,
  isEventException,
  isEventInstance,
  isEvent,
  EventType,
  EventStatus,
} from './event';
