// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Skeleton, Stack, styled, Typography } from '@mui/material';
import { notifications } from '@opentalk/common';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useCreateEventMutation, useLazyGetEventQuery } from '../../../api/rest';
import InviteToMeeting from '../../../components/InviteToMeeting/InviteToMeeting';

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  height: '100%',
  overflow: 'auto',
  gap: theme.spacing(2),
}));

const AttentionMessageTypography = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(14),
  padding: theme.spacing(2, 0),
}));

const CreateDirectMeeting = () => {
  const [createEvent, { data: event, isLoading: createEventIsLoading, error }] = useCreateEventMutation();
  const { t } = useTranslation();
  const [getEvent, { data: updatedEvent, isLoading: getEventLoading, error: getEventError }] = useLazyGetEventQuery();

  const handleCreateRoom = useCallback(async () => {
    const creationDate = new Date();
    const creationHours = creationDate.getHours().toString().padStart(2, '0');
    const creationMinutes = creationDate.getMinutes().toString().padStart(2, '0');

    try {
      await createEvent({
        title: `Ad-hoc Meeting ${creationHours}:${creationMinutes}`,
        description: '',
        isTimeIndependent: true,
        waitingRoom: false,
        recurrencePattern: [],
        isAdhoc: true,
      }).unwrap();
    } catch (err) {
      notifications.error(t('dashboard-meeting-notification-error'));
    }
  }, [createEvent, t]);

  useEffect(() => {
    handleCreateRoom();
  }, [createEvent, handleCreateRoom]);

  useEffect(() => {
    if (!getEventLoading && getEventError) {
      notifications.error(t('dashboard-meeting-notification-error'));
    }
  }, [getEventLoading, getEventError, t]);

  const renderLoading = () => (
    <Stack spacing={2}>
      <Skeleton height={40} />
      <Skeleton height={80} />
      <Skeleton height={40} />
      <Skeleton height={80} />
    </Stack>
  );

  if (!event || createEventIsLoading || error) {
    return renderLoading();
  }

  return (
    <Container>
      <Stack>
        <Typography variant={'h1'}>{t('dashboard-direct-meeting-title')}</Typography>
        <AttentionMessageTypography>{t('dashboard-adhoc-meeting-attention')}</AttentionMessageTypography>
      </Stack>
      <InviteToMeeting
        isUpdatable={true}
        existingEvent={updatedEvent ?? event}
        directMeeting
        invitationsSent={() => getEvent({ eventId: event.id, inviteesMax: 10 })}
      />
    </Container>
  );
};

export default CreateDirectMeeting;
