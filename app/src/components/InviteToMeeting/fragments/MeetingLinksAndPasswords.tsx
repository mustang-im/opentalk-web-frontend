// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PlatformKind } from '@opentalk/common';
import { Event } from '@opentalk/rest-api-rtk-query';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useCreateRoomInviteMutation,
  useGetMeQuery,
  useGetRoomInvitesQuery,
  useGetStreamingTargetsQuery,
} from '../../../api/rest';
import { useAppSelector } from '../../../hooks';
import { selectBaseUrl, selectFeatures } from '../../../store/slices/configSlice';
import { composeInviteUrl } from '../../../utils/apiUtils';
import LinkField, { FieldKeys } from './LinkField';

interface MeetingLinksAndPasswordsProps {
  event: Event;
}

const MeetingLinksAndPasswords = ({ event }: MeetingLinksAndPasswordsProps) => {
  const { t } = useTranslation();
  const baseURL = useAppSelector(selectBaseUrl);
  const [highlightedField, setHighlightedField] = useState<FieldKeys>();

  const roomURL = useMemo(() => new URL(`/room/${event.room.id}`, baseURL), [baseURL, event]);

  const roomSharedFolderURL = event.sharedFolder?.readWrite?.url;
  const roomSharedFolderPassword = event.sharedFolder?.readWrite?.password;
  const callInDetails = event.room.callIn;
  const sipLink = callInDetails ? `${callInDetails.tel},,${callInDetails.id},,${callInDetails.password}` : undefined;

  const { data: invites, isLoading, isFetching } = useGetRoomInvitesQuery({ roomId: event.room.id });
  const foundInvite = useMemo(
    () => invites && invites.find((invite) => invite.active && invite.expiration === null),
    [invites]
  );
  const permanentGuestLink = useMemo(() => {
    if (foundInvite) {
      return composeInviteUrl(baseURL, event.room.id, foundInvite.inviteCode);
    }
  }, [foundInvite]);

  const { data: me } = useGetMeQuery();
  const isCreator = me?.id === event.createdBy.id;
  const [createRoomInvite] = useCreateRoomInviteMutation();

  const roomPassword = event.room.password?.trim() || undefined;
  const features = useAppSelector(selectFeatures);

  const { data: streamingTargets } = useGetStreamingTargetsQuery(event.room.id);
  const streamingTargetURL = useMemo(() => {
    if (!streamingTargets || !streamingTargets[0]) {
      return undefined;
    }

    const target = streamingTargets[0];

    switch (target.kind) {
      case PlatformKind.Custom:
      case PlatformKind.Provider:
        return target.publicUrl;
      case PlatformKind.BuiltIn:
      default:
        return undefined;
    }
  }, [streamingTargets]);

  useEffect(() => {
    if (isLoading || isFetching || foundInvite) {
      return;
    }

    if (isCreator) {
      createRoomInvite({ id: event.room.id });
      return;
    }
  }, [foundInvite, isLoading, isFetching]);

  return (
    <>
      <LinkField
        fieldKey={FieldKeys.RoomLink}
        checked={highlightedField === FieldKeys.RoomLink}
        value={roomURL}
        setHighlightedField={setHighlightedField}
        tooltip={t('dashboard-invite-to-meeting-room-link-tooltip')}
      />
      {callInDetails && sipLink && (
        <LinkField
          fieldKey={FieldKeys.SipLink}
          checked={highlightedField === FieldKeys.SipLink}
          value={sipLink}
          setHighlightedField={setHighlightedField}
        />
      )}
      <LinkField
        fieldKey={FieldKeys.GuestLink}
        checked={highlightedField === FieldKeys.GuestLink}
        value={permanentGuestLink}
        setHighlightedField={setHighlightedField}
        tooltip={t('dashboard-invite-to-meeting-guest-link-tooltip')}
        isLoading={isLoading || isFetching}
      />
      <LinkField
        fieldKey={FieldKeys.RoomPassword}
        checked={highlightedField === FieldKeys.RoomPassword}
        value={roomPassword}
        setHighlightedField={setHighlightedField}
        tooltip={t('dashboard-invite-to-meeting-room-password-tooltip')}
      />
      {features.sharedFolder && roomSharedFolderURL && (
        <>
          <LinkField
            fieldKey={FieldKeys.SharedFolderLink}
            checked={highlightedField === FieldKeys.SharedFolderLink}
            value={roomSharedFolderURL}
            setHighlightedField={setHighlightedField}
          />
          <LinkField
            fieldKey={FieldKeys.SharedFolderPassword}
            checked={highlightedField === FieldKeys.SharedFolderPassword}
            value={roomSharedFolderPassword}
            setHighlightedField={setHighlightedField}
          />
        </>
      )}
      {streamingTargetURL && (
        <LinkField
          fieldKey={FieldKeys.LivestreamLink}
          checked={highlightedField === FieldKeys.LivestreamLink}
          value={streamingTargetURL}
          setHighlightedField={setHighlightedField}
        />
      )}
    </>
  );
};

export default MeetingLinksAndPasswords;
