// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useRemainingDurationOfTimer } from '../../../hooks';
import { selectTimerEndsAt } from '../../../store/slices/timerSlice';
import { TimerCounterProps } from './TimerTypes';

const Content = styled(Box)<TimerCounterProps>(({ alignItems = 'initial' }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: alignItems,
  gap: '0.5rem',
}));

const TimerNormalCounter = ({ alignItems }: TimerCounterProps) => {
  const { t } = useTranslation();
  const remainingTime = useRemainingDurationOfTimer();
  const endTime = useAppSelector(selectTimerEndsAt);

  return (
    <Content alignItems={alignItems}>
      <Typography variant="caption">{t(`timer-counter-${endTime ? 'remaining' : 'elapsed'}-time`)}</Typography>
      <Typography>{remainingTime?.durationString}</Typography>
    </Content>
  );
};

export default TimerNormalCounter;
