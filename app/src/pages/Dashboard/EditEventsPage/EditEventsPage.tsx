// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Skeleton, Stack, Step, StepButton as MuiStepButton, Stepper, styled } from '@mui/material';
import { EditIcon } from '@opentalk/common';
import { EventId } from '@opentalk/rest-api-rtk-query';
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useLazyGetEventQuery } from '../../../api/rest';
import CreateOrUpdateMeetingForm from '../../../components/CreateOrUpdateMeetingForm';
import InviteToMeeting from '../../../components/InviteToMeeting/InviteToMeeting';

const steps = [
  {
    label: 'global-meeting',
  },
  {
    label: 'global-participants',
  },
];

const StepButton = styled(MuiStepButton)({
  padding: 0,
  margin: 0,
});

const Container = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr',
  height: '100%',
  overflow: 'hidden auto',
  gap: theme.spacing(2),
}));

const EditEventsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [getEvent, { data: event, isLoading, error }] = useLazyGetEventQuery();
  const { meetingId, formStep } = useParams<'meetingId' | 'formStep'>() as { meetingId: EventId; formStep: string };
  const eventQuery = useMemo(() => ({ eventId: meetingId, inviteesMax: 10 }), [meetingId]);

  useEffect(() => {
    getEvent(eventQuery);
  }, [getEvent, eventQuery]);

  useEffect(() => {
    if (!isLoading && !event && error) {
      navigate('/dashboard/meetings/create');
    }
  }, [event, isLoading, navigate, error]);

  useEffect(() => {
    formStep && setActiveStep(parseInt(formStep));
  }, [formStep]);

  const StepperHeader = () => (
    <Stepper activeStep={activeStep}>
      {steps.map(({ label }, index) => (
        <Step key={label}>
          <StepButton
            icon={activeStep !== index && <EditIcon />}
            onClick={() => setActiveStep(index)}
            disabled={activeStep === index}
          >
            {t(label)}
          </StepButton>
        </Step>
      ))}
    </Stepper>
  );

  const PlaceholderSkeleton = () => (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Skeleton variant="text" width={450} />
        <Skeleton variant="rectangular" height={40} />
      </Stack>
      <Stack spacing={1}>
        <Skeleton variant="text" width={250} />
        <Skeleton variant="rectangular" height={40} />
      </Stack>
    </Stack>
  );

  if (isLoading) {
    return (
      <Container>
        <StepperHeader />
        <PlaceholderSkeleton />
      </Container>
    );
  }

  return (
    <Container>
      <StepperHeader />
      {activeStep === 0 && (
        <CreateOrUpdateMeetingForm existingEvent={event} onForwardButtonClick={() => setActiveStep(1)} />
      )}
      {activeStep === 1 && event && (
        <InviteToMeeting
          existingEvent={event}
          onBackButtonClick={() => setActiveStep(0)}
          invitationsSent={() => getEvent(eventQuery)}
        />
      )}
    </Container>
  );
};

export default EditEventsPage;
