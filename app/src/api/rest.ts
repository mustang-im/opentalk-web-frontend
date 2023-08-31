// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FetchRequestError, ParticipantId, RoomId } from '@opentalk/common';
import { auth_error, EventTypeError } from '@opentalk/react-redux-appauth';
import { fetchQuery, createOpenTalkApiWithReactHooks } from '@opentalk/rest-api-rtk-query';
import { createAsyncThunk, isRejectedWithValue, Middleware } from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { RootState } from '../store';
import { fetchWithAuth, getControllerBaseUrl } from '../utils/apiUtils';

export interface ApiErrorWithBody<T extends string> {
  code: T;
  message: string;
}

export interface NewRoom {
  password?: string;
}

export interface Room {
  id: RoomId;
  owner: ParticipantId;
  password?: string;
}

interface FeedbackData {
  lang: string;
  browser: string;
  form: Array<FeedbackFormData>;
}

interface FeedbackFormData {
  name: string;
  type: 'rating' | 'text';
  value: string;
}

export enum StartRoomError {
  WrongRoomPassword = 'wrong_room_password',
  InvalidCredentials = 'invalid_credentials',
  InvalidBreakoutRoomId = 'invalid_breakout_room_id',
  NoBreakoutRooms = 'no_breakout_rooms',
  InvalidJson = 'invalid_json',
  NotFound = 'not_found',
  Forbidden = 'forbidden',
}

export const addRoom = createAsyncThunk<Room, NewRoom, { state: RootState; rejectValue: FetchRequestError }>(
  'control/addRoom',
  async (newRoomRequest, thunkApi) => {
    const { getState, rejectWithValue } = thunkApi;

    // Fetch new credentials
    const response = await fetchWithAuth(new URL('v1/rooms', getControllerBaseUrl(getState().config)), {
      method: 'POST',
      body: JSON.stringify(convertToSnakeCase(newRoomRequest)),
    });

    if (!response.ok) {
      return rejectWithValue({
        status: response.status,
        statusText: await response.text(),
      });
    }
    return convertToCamelCase(await response.json(), { deep: true }) as Room;
  }
);

export const sendFeedback = createAsyncThunk<void, FeedbackData, { state: RootState }>(
  'control/feedback',
  async (newFeedback, { getState }) => {
    const { userSurveyUrl, userSurveyApiKey } = getState().config;

    if (userSurveyUrl === undefined || userSurveyApiKey === undefined) {
      throw new Error('user survey params are not configured');
    }
    const response = await fetch(new URL(userSurveyUrl), {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-API-KEY': userSurveyApiKey,
      },
      body: JSON.stringify(convertToSnakeCase(newFeedback)),
    });

    if (!response.ok) {
      throw new Error(`user survey submission failed with code ${response.status}: ${await response.text()}`);
    }
  }
);

const baseQuery = fetchQuery({
  baseUrl: ({ getState }) => `${getControllerBaseUrl((getState() as RootState).config).toString()}v1`,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access_token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const restApi = createOpenTalkApiWithReactHooks(baseQuery);

export const rtkQueryErrorLoggerMiddlware: Middleware =
  ({ dispatch }) =>
  (next) =>
  (action) => {
    // If rtk query get rejected dispatch auth error
    if (isRejectedWithValue(action)) {
      if (action.payload.status === 401) {
        dispatch(
          auth_error({
            name: EventTypeError.SessionExpired,
            message: `${EventTypeError.SessionExpired}-message`,
          })
        );
        return;
      } else if (action.payload.status >= 500) {
        dispatch(
          auth_error({
            name: EventTypeError.SystemCurrentlyUnavailable,
            message: `${EventTypeError.SystemCurrentlyUnavailable}-message`,
          })
        );
        return;
      }
    } else {
      return next(action);
    }
  };

// Re-export the most common api hooks
export const {
  useDeleteEventMutation,
  useMarkFavoriteEventMutation,
  useUnmarkFavoriteEventMutation,
  useGetMeQuery,
  useGetMeTariffQuery,
  useGetRoomTariffQuery,
  useLazyGetMeQuery,
  useGetEventsQuery,
  useLazyGetEventsQuery,
  useCreateEventMutation,
  useUpdateMeMutation,
  useFindUsersQuery,
  useLazyFindUsersQuery,
  useCreateEventInviteMutation,
  useUpdateRoomSipConfigMutation,
  useGetEventQuery,
  useLazyGetEventQuery,
  useUpdateEventMutation,
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
  useRevokeEventUserInviteMutation,
  useGetRoomQuery,
  useGetRoomInvitesQuery,
  useGetRoomAssetsQuery,
  useDeleteRoomAssetMutation,
  useCreateRoomInviteMutation,
  useLazyGetRoomInvitesQuery,
  useCreateEventSharedFolderMutation,
  useDeleteEventSharedFolderMutation,
} = restApi;
