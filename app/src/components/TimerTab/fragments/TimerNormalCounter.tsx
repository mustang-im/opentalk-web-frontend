// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectTimerEndsAt, selectRemainingTime } from '../../../store/slices/timerSlice';
import { TimerCounterProps } from './TimerTypes';

const Content = styled(Box)<TimerCounterProps>(({ alignItems = 'initial' }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: alignItems,
  gap: '0.5rem',
}));

const TimerNormalCounter = ({ alignItems }: TimerCounterProps) => {
  const { t } = useTranslation();
  const realTime = useAppSelector(selectRemainingTime);
  const endTime = useAppSelector(selectTimerEndsAt);
  const endDate = Boolean(endTime);

  return (
    <Content alignItems={alignItems}>
      <Typography variant="caption">{t(`timer-counter-${endDate ? 'remaining' : 'elapsed'}-time`)}</Typography>
      <Typography>{realTime?.durationString}</Typography>
    </Content>
  );
};

export default TimerNormalCounter;
