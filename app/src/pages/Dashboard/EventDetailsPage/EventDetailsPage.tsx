// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Box, Button, Stack, Typography } from '@mui/material';
import { notifications } from '@opentalk/common';
import { EventId, InviteStatus, User } from '@opentalk/rest-api-rtk-query';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import {
  useGetEventQuery,
  useAcceptEventInviteMutation,
  useDeclineEventInviteMutation,
  useGetMeQuery,
  useGetRoomTariffQuery,
} from '../../../api/rest';
import SuspenseLoading from '../../../commonComponents/SuspenseLoading';
import EventTimePreview from '../../../components/EventTimePreview';
import InviteToMeeting from '../../../components/InviteToMeeting/InviteToMeeting';
import ParticipantAvatar from '../../../components/ParticipantAvatar';
import AssetTable from './fragments/AssetTable';
import ButtonBack from './fragments/ButtonBack';

const UserRow = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(2),
  flexDirection: 'row',
  alignItems: 'baseline',
  flexWrap: 'wrap',
}));

const ButtonContainer = styled(Stack)(({ theme }) => ({
  gap: theme.spacing(3),
  flexDirection: 'row',
  justifyContent: 'flex-end',
}));

const ParticipantLimitTypography = styled(Typography)(({ theme }) => ({
  paddingTop: theme.spacing(3),
}));

const EventDetailsPage = () => {
  const [acceptEventInvitation] = useAcceptEventInviteMutation();
  const [declineEventInvitation] = useDeclineEventInviteMutation();
  const { t } = useTranslation();
  const { eventId } = useParams<'eventId'>() as { eventId: EventId };
  const { data: event, isLoading } = useGetEventQuery({ eventId, inviteesMax: 20 });
  const { data: me } = useGetMeQuery();
  const isMeetingCreator = me?.id === event?.createdBy.id;
  const { data: tariff } = useGetRoomTariffQuery(event?.room.id ?? skipToken);
  const roomParticipantLimit = tariff?.quotas.roomParticipantLimit;

  if (isLoading || !event) return <SuspenseLoading />;

  const renderParticipantRows = () => {
    const reorderedInviteStatus = [
      InviteStatus.Pending,
      InviteStatus.Accepted,
      InviteStatus.Declined,
      InviteStatus.Tentative,
    ];

    return reorderedInviteStatus.map((status) => {
      const usersWithCurrentStatus = event.invitees && event.invitees.filter((user) => user.status === status);
      return usersWithCurrentStatus && usersWithCurrentStatus.length > 0 ? (
        <Stack key={status} mb={1}>
          <Typography mb={1}>{t(`dashboard-meeting-details-page-participant-${status}`)}</Typography>
          <UserRow>{usersWithCurrentStatus.map((user) => renderUser(user.profile))}</UserRow>
        </Stack>
      ) : null;
    });
  };

  const renderUser = (user: User) => {
    return (
      <Stack key={user.email} direction={'row'} spacing={1.5} alignItems={'center'}>
        <ParticipantAvatar src={user.avatarUrl}>{`${user.firstname} ${user.lastname}`}</ParticipantAvatar>
        <Stack>
          <Typography noWrap>
            {user.firstname} {user.lastname}
          </Typography>
          <Typography variant="caption" noWrap>
            {user.email}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  const getTimeInformationString = () => {
    if (event.isTimeIndependent) {
      return t('dashboard-meeting-details-page-time-independent');
    }
    const startDate = new Date(event.startsAt.datetime);
    if (event.isAllDay) {
      return t('dashboard-meeting-details-page-all-day');
    }

    const endDate = new Date(event.endsAt.datetime);
    return <EventTimePreview startDate={startDate} endDate={endDate} />;
  };

  const acceptInvite = () => {
    return acceptEventInvitation({ eventId })
      .unwrap()
      .then(() =>
        notifications.success(
          t(`dashbooard-event-accept-invitation-notification`, {
            meetingTitle: event.title,
          })
        )
      )
      .catch(() =>
        notifications.error(
          t(`error-general`, {
            meetingTitle: event.title,
          })
        )
      );
  };

  const declineInvite = () => {
    return declineEventInvitation({ eventId })
      .unwrap()
      .then(() =>
        notifications.success(
          t(`dashbooard-event-decline-invitation-notification`, {
            meetingTitle: event.title,
          })
        )
      )
      .catch(() =>
        notifications.error(
          t(`error-general`, {
            meetingTitle: event.title,
          })
        )
      );
  };

  return (
    <Stack justifyContent={'space-between'} height={'100%'}>
      <Stack>
        <Stack mb={4}>
          <Typography variant={'h1'}>{event.title}</Typography>
          <Typography mt={1}>{getTimeInformationString()}</Typography>
        </Stack>

        {event.description && event.description !== '' && (
          <Stack mb={4}>
            <Typography>{t('dashboard-meeting-details-page-description-title')}</Typography>
            <Box maxHeight={50} overflow={'auto'} mt={1}>
              <Typography variant={'body2'}>{event.description}</Typography>
            </Box>
          </Stack>
        )}

        <InviteToMeeting existingEvent={event} showOnlyLinkFields />
        {roomParticipantLimit && (
          <ParticipantLimitTypography>
            {t('dashboard-meeting-details-page-participant-limit', { maxParticipants: roomParticipantLimit })}
          </ParticipantLimitTypography>
        )}
        {event.invitees && event.invitees.length > 0 && <Stack mt={4}>{renderParticipantRows()}</Stack>}

        <AssetTable roomId={event.room.id} isMeetingCreator={isMeetingCreator} />
      </Stack>

      <ButtonContainer>
        <ButtonBack />
        {!isMeetingCreator && (
          <>
            <Button color="secondary" onClick={declineInvite} disabled={event.inviteStatus === InviteStatus.Declined}>
              {t('global-decline')}
            </Button>
            <Button color="primary" onClick={acceptInvite} disabled={event.inviteStatus === InviteStatus.Accepted}>
              {t('global-accept')}
            </Button>
          </>
        )}
      </ButtonContainer>
    </Stack>
  );
};

export default EventDetailsPage;
