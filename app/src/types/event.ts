// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CallIn, EventId, RoomId, InviteCode } from '@opentalk/rest-api-rtk-query';

export interface StreamingLink {
  name: string;
  url: string;
}

export interface MeetingDetails {
  inviteCodeId: InviteCode;
  callIn?: CallIn;
  streamingLinks: StreamingLink[];
}

export interface EventInfo {
  title: string;
  id: EventId;
  isAdhoc: boolean;
  meetingDetails: MeetingDetails;
  roomId: RoomId;
}

export interface RoomInfo {
  id: RoomId;
  password: 'string';
  createdBy: {
    title: string;
    firstname: string;
    lastname: string;
    displayName: string;
    avatar_url: string;
  };
}
