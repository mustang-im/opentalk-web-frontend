// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, styled, Stack, Box } from '@mui/material';
import { TimerStyle } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { stopTimer } from '../../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectTimerId } from '../../../store/slices/timerSlice';
import TimerCoffeeBreakCounter from './TimerCoffeeBreakCounter';
import TimerNormalCounter from './TimerNormalCounter';
import UserList from './UserList';

const TimerBoxContainer = styled(Stack)({
  overflow: 'hidden',
  flex: 1,
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
    <Stack flex={1} spacing={1} overflow="hidden">
      <TimerBoxContainer spacing={1}>
        {timerStyle === TimerStyle.CoffeeBreak && (
          <Box>
            <TimerCoffeeBreakCounter />
          </Box>
        )}

        {timerStyle === TimerStyle.Normal && (
          <>
            <Box>
              <TimerNormalCounter />
            </Box>
            <UserList />
          </>
        )}
      </TimerBoxContainer>

      <Button color="secondary" onClick={handleStop}>
        {timerStyle === TimerStyle.Normal && t('timer-overview-button-stop')}
        {timerStyle === TimerStyle.CoffeeBreak && t('coffee-break-overview-button-stop')}
      </Button>
    </Stack>
  );
};

export default TimerOverview;
