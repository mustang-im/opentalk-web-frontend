// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Tariff } from '@opentalk/common';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/dist/query/fetchBaseQuery';
import { BaseQueryFn, FetchArgs } from '@reduxjs/toolkit/query';
import snakecaseKeys from 'snakecase-keys';

import { PublicRoom, PrivateRoom, UpdateRoomPayload, CreateRoomPayload, Tags, Tag } from '../types';
import { RoomId } from '../types';
import {
  AssetId,
  RoomAssets,
  RoomSipConfigResponse,
  UpdateRoomSipConfigPayload,
  CreateRoomInvitePayload,
  RoomInvite,
  RoomInvites,
} from '../types/room';
import { PagedPaginationParams } from './common';

export const addRoomEndpoints = <
  RoomEndpointBuilder extends EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, Record<string, unknown>, FetchBaseQueryMeta>,
    Tags,
    'api'
  >
>(
  builder: RoomEndpointBuilder
) => ({
  getRooms: builder.query<Array<PublicRoom>, PagedPaginationParams>({
    query: (params) => ({ url: 'rooms', params }),
    providesTags: (result) =>
      result
        ? [...result.map(({ id }) => ({ type: Tag.Room, id: id })), { type: Tag.Room, id: 'PARTIAL-LIST' }]
        : [{ type: Tag.Room, id: 'PARTIAL-LIST' }],
  }),
  getRoom: builder.query<PublicRoom, RoomId>({
    query: (id) => `rooms/${id}`,
    providesTags: (result) => (result ? [{ type: Tag.Room, id: result.id }] : []),
  }),
  getRoomTariff: builder.query<Tariff, RoomId>({
    query: (id) => `rooms/${id}/tariff`,
    providesTags: (result) => (result ? [{ type: Tag.Tariff, id: result.id }] : []),
  }),
  createRoom: builder.mutation<PrivateRoom, CreateRoomPayload>({
    query: (payload) => ({
      url: 'rooms',
      method: 'POST',
      body: snakecaseKeys(payload),
    }),
    invalidatesTags: [{ type: Tag.Room, id: 'PARTIAL-LIST' }],
  }),
  updateRoom: builder.mutation<PrivateRoom, { id: RoomId } & UpdateRoomPayload>({
    query: ({ id, ...payload }) => ({
      url: `rooms/${id}`,
      method: 'PATCH',
      body: snakecaseKeys(payload),
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: Tag.Room, id },
      { type: Tag.Room, id: 'PARTIAL-LIST' },
    ],
  }),
  deleteRoom: builder.mutation<unknown, RoomId>({
    query: (id) => ({
      url: `rooms/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: (result, error, id) => [
      { type: Tag.Room, id },
      { type: Tag.Room, id: 'PARTIAL-LIST' },
    ],
  }),
  /**
   * Create or update a SIP-Configuration for a specific room
   */
  updateRoomSipConfig: builder.mutation<RoomSipConfigResponse, { id: RoomId } & UpdateRoomSipConfigPayload>({
    query: ({ id, ...payload }) => ({
      url: `rooms/${id}/sip`,
      method: 'PUT',
      body: snakecaseKeys(payload),
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: Tag.Room, id },
      { type: Tag.Room, id: 'PARTIAL-LIST' },
    ],
  }),
  /**
   * Create an inviteId for a room
   */
  createRoomInvite: builder.mutation<RoomInvite, { id: RoomId } & CreateRoomInvitePayload>({
    query: ({ id, ...payload }) => ({
      url: `rooms/${id}/invites`,
      method: 'POST',
      body: snakecaseKeys(payload),
    }),
    invalidatesTags: (result, error, { id }) => [
      { type: Tag.RoomInvite, id },
      { type: Tag.RoomInvite, id: 'PARTIAL-LIST' },
    ],
  }),
  /**
   * get all invites for a room
   */
  getRoomInvites: builder.query<RoomInvites, { roomId: RoomId }>({
    query: ({ roomId }) => `rooms/${roomId}/invites`,
    providesTags: (result) =>
      result
        ? [
            ...result.map(({ inviteCode }) => ({ type: Tag.RoomInvite, id: inviteCode })),
            { type: Tag.RoomInvite, id: 'PARTIAL-LIST' },
          ]
        : [{ type: Tag.RoomInvite, id: 'PARTIAL-LIST' }],
  }),
  /*
   * get all assets for a room
   */
  getRoomAssets: builder.query<RoomAssets, RoomId>({
    query: (roomId) => ({ url: `rooms/${roomId}/assets` }),
    providesTags: (result) => {
      return result
        ? [...result.map(({ id }) => ({ type: Tag.Asset, id: id })), { type: Tag.Asset, id: 'PARTIAL-LIST' }]
        : [{ type: Tag.Asset, id: 'PARTIAL-LIST' }];
    },
  }),
  /*
   * delete an asset from room
   */
  deleteRoomAsset: builder.mutation<unknown, { roomId: RoomId; assetId: AssetId }>({
    query: ({ roomId, assetId }) => ({ url: `rooms/${roomId}/assets/${assetId}`, method: 'DELETE' }),
    invalidatesTags: (result, error, { assetId }) => [
      { type: Tag.Asset, assetId },
      { type: Tag.Asset, assetId: 'PARTIAL-LIST' },
    ],
  }),
});
