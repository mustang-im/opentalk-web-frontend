// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BackendParticipant, BreakoutRoomId, GroupId, ParticipantId, RoomId, Tariff } from '@opentalk/common';
import { InitialAutomod } from '@opentalk/components';
import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { InitialBreakout } from '../api/types/incoming/breakout';
import { RecordingState, Role, JoinBlocked, ControlMessage } from '../api/types/incoming/control';
import localMediaContext from '../modules/Media/LocalMedia';
import localScreenContext from '../modules/Media/LocalScreen';
import { ConferenceRoom, shutdownConferenceContext } from '../modules/WebRTC';
import { getControllerBaseUrl } from '../utils/apiUtils';
import { RootState } from './index';
import { ChatMessage } from './slices/chatSlice';
import { Participant } from './slices/participantsSlice';
import { InitialPoll } from './slices/pollSlice';
import { ConnectionState } from './slices/roomSlice';

export interface RoomCredentials {
  roomId: RoomId;
  password?: string;
  inviteCode?: string;
  breakoutRoomId: BreakoutRoomId | null;
}

export const joinSuccess = createAction<{
  participantId: ParticipantId;
  role: Role;
  avatarUrl?: string;
  chat: {
    enabled: boolean;
    roomHistory: ChatMessage[];
    lastSeenTimestampGlobal?: string;
    lastSeenTimestampsGroup?: Record<string, string>;
    lastSeenTimestampsPrivate?: Record<string, string>;
  };
  groups: GroupId[];
  automod?: InitialAutomod;
  breakout?: InitialBreakout;
  polls?: InitialPoll;
  participants: Participant[];
  moderation?: {
    raiseHandsEnabled: boolean;
    waitingRoomEnabled: boolean;
    waitingRoomParticipants: Array<BackendParticipant>;
  };
  isPresenter?: boolean;
  recording?: null | RecordingState;
  serverTimeOffset: number;
  tariff: Tariff;
}>('signaling/control/join_success');

export const joinBlocked = createAction<JoinBlocked>(`signaling/control/${ControlMessage.JOIN_BLOCKED}`);

export const login = createAsyncThunk<{ permission: Array<string> }, string, { state: RootState; rejectValue: Error }>(
  'user/login',
  async (idToken: string, thunkApi) => {
    const { getState } = thunkApi;
    const baseUrl = getControllerBaseUrl(getState().config);
    const response = await fetch(new URL('v1/auth/login', baseUrl).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertToSnakeCase({ idToken })),
    });

    return convertToCamelCase(await response.json(), { deep: true });
  }
);

export const startRoom = createAsyncThunk<
  { conferenceContext: ConferenceRoom; resumption: string },
  RoomCredentials & { displayName: string },
  { state: RootState }
>('room/start', async (credentials, { getState }) => {
  const config = getState().config;
  const { resumptionToken, roomId } = getState().room;
  if (credentials.displayName.length === 0) {
    throw new Error('displayName must ne non empty');
  }
  return ConferenceRoom.create(credentials, config, credentials.roomId === roomId ? resumptionToken : undefined);
});

export const hangUp = createAsyncThunk<void, void, { state: RootState }>('room/hangup', async (_, { getState }) => {
  const { connectionState } = getState().room;
  if (connectionState !== ConnectionState.Leaving) {
    throw new Error(`cannot hangup when state is '${connectionState}' and not 'leaving'.`);
  }
  await shutdownConferenceContext();
  localScreenContext.release();
  return localMediaContext.release();
});
