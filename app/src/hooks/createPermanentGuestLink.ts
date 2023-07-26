// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { useCallback, useEffect, useMemo } from 'react';

import { useAppSelector } from '.';
import { useLazyGetRoomInvitesQuery } from '../api/rest';
import { selectBaseUrl } from '../store/slices/configSlice';

export const createPermanentGuestLink = (roomId?: RoomId) => {
  if (!roomId) {
    return undefined;
  }

  const baseUrl = useAppSelector(selectBaseUrl);
  const createGuestLink = useCallback((inviteCode: string) => new URL(`/invite/${inviteCode}`, baseUrl), [baseUrl]);
  const [
    getRoomInvites,
    {
      data: invites,
      isSuccess: isGetInvitesSuccess,
      isLoading: isGetInvitesLoading,
      isUninitialized: isGetInvitesUninitialized,
    },
  ] = useLazyGetRoomInvitesQuery();

  useEffect(() => {
    getRoomInvites({ roomId: roomId });
  }, [getRoomInvites, roomId]);

  //TODO: Add a way to generate a new permanent link if none are present (button inside the input)
  const inviteUrl = useMemo(() => {
    if (isGetInvitesUninitialized || isGetInvitesLoading) return undefined;

    if (!isGetInvitesSuccess || invites === undefined || invites.length === 0) {
      console.error('No invite found for room ', roomId);
      return undefined;
    }
    const permanentInvite = invites.find((invite) => invite.expiration === null && invite.active);
    if (permanentInvite === undefined) {
      console.error('No permanent invite found for room ', roomId);
      return undefined;
    }
    return createGuestLink(permanentInvite.inviteCode);
  }, [isGetInvitesUninitialized, isGetInvitesLoading, isGetInvitesSuccess, invites, createGuestLink]);

  return inviteUrl;
};
