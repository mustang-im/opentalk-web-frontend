// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { stopTimer, TimerStyle } from '../../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectTimerId } from '../../../store/slices/timerSlice';
import TimerCoffeeBreakCounter from './TimerCoffeeBreakCounter';
import TimerNormalCounter from './TimerNormalCounter';
import UserList from './UserList';

const Container = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'grid',
  gap: theme.spacing(2),
  overflow: 'auto',
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'auto 1fr auto',
  justifyContent: 'center',
}));

const BoxNormal = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
}));

const TabTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const TimerOverview = ({ timerStyle }: { timerStyle: TimerStyle }) => {
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
      {timerStyle === TimerStyle.CoffeeBreak && (
        <>
          <Typography variant={'h2'}>{t('coffee-break-header-title')}</Typography>
          <TimerCoffeeBreakCounter />
        </>
      )}

      {timerStyle === TimerStyle.Normal && (
        <>
          <TabTitle variant={'h2'}>{t('timer-header-title')}</TabTitle>
          <BoxNormal>
            <TimerNormalCounter />
            <UserList />
          </BoxNormal>
        </>
      )}

      <Stack justifySelf={'center'}>
        <Button color="secondary" onClick={handleStop}>
          {t('timer-overview-button-stop')}
        </Button>
      </Stack>
    </Container>
  );
};

export default TimerOverview;
