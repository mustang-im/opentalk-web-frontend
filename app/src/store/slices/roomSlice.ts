// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FetchRequestError, FetchRequestState, InviteCode, RoomId } from '@opentalk/common';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { RootState } from '../';
import { fetchWithAuth, getControllerBaseUrl } from '../../utils/apiUtils';
import { hangUp, joinSuccess, startRoom } from '../commonActions';

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
  Leaving = 'leaving',
  Left = 'left',
  Failed = 'failed',
  ReadyToEnter = 'ready-to-enter',
}

interface RoomState {
  roomId?: RoomId;
  password?: string;
  invite: InviteState;
  connectionState: ConnectionState;
  resumptionToken?: string;
  waitingRoomEnabled: boolean;
  inRoom: boolean;
  error?: string;
}

export interface InviteRoomVerifyResponse {
  roomId: RoomId;
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
  inRoom: false,
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
    connectionClosed: (state, { payload: { errorCode } }: PayloadAction<{ errorCode?: number }>) => {
      state.inRoom = false;
      state.connectionState = errorCode ? ConnectionState.Failed : ConnectionState.Leaving;
      state.error = `websocket_error_${errorCode}`;
    },
    enterLobbyRoom: (state) => {
      state.connectionState = ConnectionState.Initial;
      state.inRoom = false;
      state.error = undefined;
    },
    enteredWaitingRoom: (state) => {
      state.connectionState = ConnectionState.Waiting;
      state.inRoom = false;
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
    setRoomError: (state, { payload: { error } }: PayloadAction<{ error?: string }>) => {
      state.error = error;
      state.connectionState = ConnectionState.Failed;
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
      state.inRoom = false;
    });
    builder.addCase(joinSuccess, (state, { payload }) => {
      state.connectionState = ConnectionState.Online;
      state.waitingRoomEnabled = Boolean(payload.moderation?.waitingRoomEnabled);
      state.inRoom = true;
    });
    builder.addCase(hangUp.pending, (state) => {
      state.connectionState = ConnectionState.Leaving;
    });
    builder.addCase(hangUp.fulfilled, (state) => {
      state.connectionState = ConnectionState.Left;
      state.inRoom = false;
    });
    builder.addCase(hangUp.rejected, (state) => {
      state.connectionState = ConnectionState.Failed;
    });
  },
});

export const actions = roomSlice.actions;
export const {
  connectionClosed,
  enteredWaitingRoom,
  readyToEnter,
  enableWaitingRoom,
  disableWaitingRoom,
  enterLobbyRoom,
  setRoomError,
} = actions;

export const selectRoomPassword = (state: RootState) => state.room.password;
export const selectRoomId = (state: RootState) => state.room.roomId;
export const selectInviteId = (state: RootState) => state.room.invite.inviteCode;
export const selectRoomConnectionState = (state: RootState) => state.room.connectionState;
export const selectWaitingRoomState = (state: RootState) => state.room.waitingRoomEnabled;
export const selectInRoomState = (state: RootState) => state.room.inRoom;

export default roomSlice.reducer;
