// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Tariff } from '@opentalk/common';
import { EndpointBuilder } from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import { BaseQueryFn, FetchArgs, FetchBaseQueryError, FetchBaseQueryMeta } from '@reduxjs/toolkit/query';
import snakeCaseKeys from 'snakecase-keys';

import { UserMe, UpdateMePayload, BaseUser, EventId, Tag, Tags, UserId } from '../types';
import { User } from '../types/user';

export type FindUsersParams = {
  /**
   * Query String matching parts of a user
   */
  q: string;
};
export const addUserEndpoints = <
  RoomEndpointBuilder extends EndpointBuilder<
    BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError, Record<string, unknown>, FetchBaseQueryMeta>,
    Tags,
    'api'
  >
>(
  builder: RoomEndpointBuilder
) => ({
  getMe: builder.query<UserMe, void>({
    query: () => 'users/me',
    providesTags: [{ type: Tag.User, id: 'ME' }],
  }),
  updateMe: builder.mutation<UserMe, UpdateMePayload>({
    query: (updatedMe) => ({
      url: 'users/me',
      method: 'PATCH',
      body: snakeCaseKeys(updatedMe),
    }),
    invalidatesTags: [{ type: Tag.User, id: 'ME' }],
  }),
  getMeTariff: builder.query<Tariff, void>({
    query: () => 'users/me/tariff',
    providesTags: (result) => (result ? [{ type: Tag.Tariff, id: result.id }] : []),
  }),
  getUser: builder.query<BaseUser, UserId>({
    query: (id) => `users/${id}`,
    providesTags: (result) => (result ? [{ type: Tag.User, id: result.id }] : []),
  }),
  // TODO(r.floren) we could implement a debounce based ratelimit here I guess as a safeguard, else this should realisticly
  // be included in the caller, else this would create a bad UX with jittering all over the place.
  findUsers: builder.query<Array<User>, { q: string }>({
    query: (params) => ({
      url: 'users/find',
      params,
    }),
    providesTags: (result) =>
      result
        ? [
            ...result.map(({ email }) => ({ type: Tag.FindUser, id: email })),
            { type: Tag.FindUser, id: 'PARTIAL-LIST' },
          ]
        : [{ type: Tag.FindUser, id: 'PARTIAL-LIST' }],
  }),
  /**
   * mark an event as favorite
   */
  markFavoriteEvent: builder.mutation<unknown, EventId>({
    query: (eventId) => ({
      url: `users/me/event_favorites/${eventId}`,
      method: 'PUT',
    }),
    invalidatesTags: (_result, _error, eventId) => [
      { type: Tag.User, id: 'ME' },
      { type: Tag.Event, id: eventId },
      { type: Tag.Event, id: 'PARTIAL-LIST' },
    ],
  }),
  /**
   * unmark a favorite event
   */
  unmarkFavoriteEvent: builder.mutation<unknown, EventId>({
    query: (eventId) => ({
      url: `users/me/event_favorites/${eventId}`,
      method: 'DELETE',
    }),
    invalidatesTags: (_result, _error, eventId) => [
      { type: Tag.User, id: 'ME' },
      { type: Tag.Event, id: eventId },
    ],
  }),
});
