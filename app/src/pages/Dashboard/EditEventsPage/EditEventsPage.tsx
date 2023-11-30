// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Skeleton, Stack, Step, StepButton as MuiStepButton, Stepper, styled } from '@mui/material';
import { EditIcon } from '@opentalk/common';
import { EventId } from '@opentalk/rest-api-rtk-query';
import { useEffect, useState, useMemo } from 'react';
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

const ActiveStep = styled(Step)(({ theme }) => ({
  //Safari icon, Other browsers icon
  '& .MuiSvgIcon-root.MuiStepIcon-root.Mui-active, & .MuiSvgIcon-root circle': {
    color: theme.palette.secondary.dark,
  },
}));

const EditEventsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [getEvent, { data: event, isLoading, error }] = useLazyGetEventQuery();
  const { eventId, formStep } = useParams<'eventId' | 'formStep'>() as { eventId: EventId; formStep: string };
  const eventQuery = useMemo(() => ({ eventId: eventId, inviteesMax: 10 }), [eventId]);

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
        // #1457 When dealing with the edit page, all steps must be available per design.
        // Default value of future step for disabled is `true` and therefor button
        // appears unclickable.
        <ActiveStep key={label} disabled={activeStep === index}>
          <StepButton icon={activeStep !== index && <EditIcon />} onClick={() => setActiveStep(index)}>
            {t(label)}
          </StepButton>
        </ActiveStep>
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
          isUpdatable={true}
          existingEvent={event}
          onBackButtonClick={() => setActiveStep(0)}
          invitationsSent={() => getEvent(eventQuery)}
        />
      )}
    </Container>
  );
};

export default EditEventsPage;
