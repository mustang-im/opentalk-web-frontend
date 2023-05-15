// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Box, styled, Stack } from '@mui/material';
import { TimerStyle } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { stopTimer } from '../../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectTimerId } from '../../../store/slices/timerSlice';
import TimerCoffeeBreakCounter from './TimerCoffeeBreakCounter';
import TimerNormalCounter from './TimerNormalCounter';
import UserList from './UserList';

const TimerBoxContainer = styled(Box)({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  alignSelf: 'flex-start',
});

const TimerBoxItem = styled(Box)({
  paddingTop: '1rem',
});

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
    <Stack height="100%">
      {timerStyle === TimerStyle.CoffeeBreak && (
        <TimerBoxContainer>
          <TimerBoxItem>
            <TimerCoffeeBreakCounter />
          </TimerBoxItem>
        </TimerBoxContainer>
      )}

      {timerStyle === TimerStyle.Normal && (
        <TimerBoxContainer>
          <TimerBoxItem>
            <TimerNormalCounter />
          </TimerBoxItem>
          <TimerBoxItem>
            <UserList />
          </TimerBoxItem>
        </TimerBoxContainer>
      )}

      <Button color="secondary" onClick={handleStop}>
        {timerStyle === TimerStyle.Normal && t('timer-overview-button-stop')}
        {timerStyle === TimerStyle.CoffeeBreak && t('coffee-break-overview-button-stop')}
      </Button>
    </Stack>
  );
};

export default TimerOverview;
