// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CallIn, EventId } from '@opentalk/rest-api-rtk-query';

import { InviteCode, RoomId } from './common';

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
