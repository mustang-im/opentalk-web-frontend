// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FetchRequestError, FetchRequestState, InviteCode, RoomId, RoomMode } from '@opentalk/common';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { RootState } from '../';
import { StartTimer } from '../../api/types/incoming/timer';
import { TimerStyle } from '../../api/types/outgoing/timer';
import { fetchWithAuth, getControllerBaseUrl } from '../../utils/apiUtils';
import { hangUp, joinSuccess, startRoom } from '../commonActions';
import { startedTimer, stoppedTimer } from './timerSlice';

interface InviteState extends FetchRequestState {
  active?: boolean;
  expiration?: string;
  inviteCode?: InviteCode;
}

export enum ConnectionState {
  Initial = 'initial',
  Setup = 'setup',
  Starting = 'starting',
  Waiting = 'waiting',
  Online = 'online',
  Reconnecting = 'reconnecting',
  Leaving = 'leaving',
  Left = 'left',
  Failed = 'failed',
  Blocked = 'blocked',
  ReadyToEnter = 'ready-to-enter',
}

interface RoomState {
  roomId?: RoomId;
  password?: string;
  invite: InviteState;
  connectionState: ConnectionState;
  resumptionToken?: string;
  waitingRoomEnabled: boolean;
  error?: string;
  serverTimeOffset: number;
  passwordRequired: boolean;
  participantLimit: number;
  currentMode?: RoomMode;
}

export interface InviteRoomVerifyResponse {
  roomId: RoomId;
  passwordRequired: boolean;
}

const initialInviteState: InviteState = {
  loading: false,
  error: undefined,
  active: undefined,
  expiration: undefined,
  inviteCode: undefined,
};

const initialState: RoomState = {
  roomId: undefined,
  password: undefined,
  invite: initialInviteState,
  connectionState: ConnectionState.Initial,
  waitingRoomEnabled: false,
  serverTimeOffset: 0,
  passwordRequired: false,
  participantLimit: 0,
};

export const fetchRoomByInviteId = createAsyncThunk<
  InviteRoomVerifyResponse,
  InviteCode,
  { state: RootState; rejectValue: FetchRequestError }
>('room/fetchRoomByInviteId', async (inviteCode, thunkApi) => {
  const { getState, rejectWithValue } = thunkApi;
  const verifyUrl = new URL('v1/invite/verify', getControllerBaseUrl(getState().config));

  try {
    const body = JSON.stringify(convertToSnakeCase({ inviteCode }));

    const response = await fetchWithAuth(verifyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });

    if (!response.ok) {
      return rejectWithValue({
        status: response.status,
        statusText: await response.text(),
      });
    }

    return convertToCamelCase(await response.json(), { deep: true }) as InviteRoomVerifyResponse;
  } catch (error) {
    return rejectWithValue({
      status: 500,
      statusText: error as string,
    });
  }
});

export const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    joinBlocked: (state, { payload: { reason } }: PayloadAction<{ reason?: string }>) => {
      state.connectionState = ConnectionState.Blocked;
      state.error = reason;
    },
    connectionClosed: (state, { payload: { errorCode } }: PayloadAction<{ errorCode?: number }>) => {
      state.connectionState = errorCode ? ConnectionState.Reconnecting : ConnectionState.Leaving;
      state.error = `websocket_error_${errorCode}`;
    },
    enteredWaitingRoom: (state) => {
      state.connectionState = ConnectionState.Waiting;
    },
    readyToEnter: (state) => {
      state.connectionState = ConnectionState.ReadyToEnter;
    },
    enableWaitingRoom: (state) => {
      state.waitingRoomEnabled = true;
    },
    disableWaitingRoom: (state) => {
      state.waitingRoomEnabled = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoomByInviteId.pending, (state) => {
      state.invite.loading = true;
    });
    builder.addCase(fetchRoomByInviteId.fulfilled, (state, { payload, meta }) => {
      state.roomId = payload.roomId;
      state.invite.loading = false;
      state.invite.inviteCode = meta.arg;
      state.connectionState = ConnectionState.Setup;
      state.resumptionToken = undefined;
      state.passwordRequired = payload.passwordRequired;
    });
    builder.addCase(fetchRoomByInviteId.rejected, (state, { payload }) => {
      state.invite = {
        ...initialInviteState,
        error: payload,
        loading: false,
      };
      state.connectionState = ConnectionState.Failed;
    });
    builder.addCase(
      startRoom.pending,
      (
        state,
        {
          meta: {
            arg: { roomId, password },
          },
        }
      ) => {
        state.error = undefined;
        state.connectionState = ConnectionState.Starting;
        state.roomId = roomId;
        state.password = password;
      }
    );
    builder.addCase(startRoom.fulfilled, (state, { payload: { resumption } }) => {
      state.resumptionToken = resumption;
    });
    builder.addCase(startRoom.rejected, (state, payload) => {
      if ('code' in payload.error) {
        state.error = payload.error.code;
      }
      state.connectionState = ConnectionState.Failed;
    });
    builder.addCase(joinSuccess, (state, { payload }) => {
      state.serverTimeOffset = payload.serverTimeOffset;
      state.connectionState = ConnectionState.Online;
      state.waitingRoomEnabled = Boolean(payload.moderation?.waitingRoomEnabled);
      state.participantLimit = payload.tariff.quotas?.roomParticipantLimit;
    });
    builder.addCase(hangUp.pending, (state) => {
      state.connectionState = ConnectionState.Leaving;
    });
    builder.addCase(hangUp.fulfilled, (state) => {
      state.connectionState = ConnectionState.Left;
    });
    builder.addCase(hangUp.rejected, (state) => {
      state.connectionState = ConnectionState.Failed;
    });
    builder.addCase(startedTimer, (state, { payload: { payload } }: PayloadAction<{ payload: StartTimer }>) => {
      if (payload.style === TimerStyle.CoffeeBreak) {
        state.currentMode = RoomMode.CoffeeBreak;
      } else {
        state.currentMode = undefined;
      }
    });
    builder.addCase(stoppedTimer, (state) => {
      state.currentMode = undefined;
    });
  },
});

export const actions = roomSlice.actions;
export const {
  joinBlocked,
  connectionClosed,
  enteredWaitingRoom,
  readyToEnter,
  enableWaitingRoom,
  disableWaitingRoom,
} = actions;

export const selectRoomPassword = (state: RootState) => state.room.password;
export const selectRoomId = (state: RootState) => state.room.roomId;
export const selectInviteId = (state: RootState) => state.room.invite.inviteCode;
export const selectRoomConnectionState = (state: RootState) => state.room.connectionState;
export const selectWaitingRoomState = (state: RootState) => state.room.waitingRoomEnabled;
export const selectServerTimeOffset = (state: RootState) => state.room.serverTimeOffset;
export const selectPasswordRequired = (state: RootState) => state.room.passwordRequired;
export const selectParticipantLimit = (state: RootState) => state.room.participantLimit;
export const selectCurrentRoomMode = (state: RootState) => state.room.currentMode;

export default roomSlice.reducer;
