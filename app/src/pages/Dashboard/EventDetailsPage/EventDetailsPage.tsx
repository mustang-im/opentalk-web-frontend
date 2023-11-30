// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Box, Button, Stack, Typography, useTheme } from '@mui/material';
import { notifications } from '@opentalk/common';
import { EventId, InviteStatus } from '@opentalk/rest-api-rtk-query';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
import InvitedParticipants from '../../../components/InvitedParticipants';
import AssetTable from './fragments/AssetTable';
import ButtonBack from './fragments/ButtonBack';

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
  const { data: event, isLoading, isError, isFetching } = useGetEventQuery({ eventId, inviteesMax: 20 });
  const { data: me } = useGetMeQuery();
  const isMeetingCreator = me?.id === event?.createdBy.id;
  const { data: tariff } = useGetRoomTariffQuery(event?.room.id ?? skipToken);
  const roomParticipantLimit = tariff?.quotas.roomParticipantLimit;
  const theme = useTheme();
  const navigate = useNavigate();

  if (isLoading || isFetching) return <SuspenseLoading />;

  if (isError) {
    notifications.error(t('error-unauthorized'));
    navigate('/dashboard');
    return null;
  }

  if (!event) return null;

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
    <Stack
      justifyContent={'space-between'}
      height={'100%'}
      overflow="auto"
      style={{ paddingRight: theme.spacing(5), marginRight: theme.spacing(-5) }}
    >
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

        <Stack mb={2}>
          <InviteToMeeting existingEvent={event} showOnlyLinkFields isUpdatable={false} />
        </Stack>
        {roomParticipantLimit && (
          <ParticipantLimitTypography>
            {t('dashboard-meeting-details-page-participant-limit', { maxParticipants: roomParticipantLimit })}
          </ParticipantLimitTypography>
        )}

        {event.invitees && event.invitees.length > 0 && <InvitedParticipants eventId={event.id} isUpdatable={false} />}

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
