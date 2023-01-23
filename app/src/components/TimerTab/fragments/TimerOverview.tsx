// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { stopTimer } from '../../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectTimerId } from '../../../store/slices/timerSlice';
import TimerCounter from './TimerCounter';
import UserList from './UserList';

const Container = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'grid',
  gap: theme.spacing(2),
  overflow: 'auto',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'repeat(2, auto) 1fr auto',
  justifyContent: 'center',
}));

const TabTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const TimerOverview = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const timerId = useAppSelector(selectTimerId);

  const handleStop = () => {
    if (timerId) {
      dispatch(stopTimer.action({ timerId }));
    }
  };

  return (
    <Container>
      <TabTitle variant={'h2'}>{t('timer-header-title')}</TabTitle>
      <TimerCounter />
      <UserList />
      <Stack justifySelf={'center'}>
        <Button color="secondary" onClick={handleStop}>
          {t('timer-overview-button-stop')}
        </Button>
      </Stack>
    </Container>
  );
};

export default TimerOverview;
