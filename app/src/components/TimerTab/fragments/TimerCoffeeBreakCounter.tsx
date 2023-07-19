// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, styled, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useGetRemainingDurationOfTimer } from '../../../hooks';
import { TimerCounterProps } from './TimerTypes';

const Content = styled(Box)<TimerCounterProps>(({ alignItems = 'initial' }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: alignItems,
  gap: '0.5rem',
}));

const TimerCoffeeBreakCounter = ({ alignItems }: TimerCounterProps) => {
  const { t } = useTranslation();
  const remainingTime = useGetRemainingDurationOfTimer();

  return (
    <Content alignItems={alignItems}>
      <Typography variant="caption">{t(`coffee-break-title-counter`)}</Typography>
      <Typography>{remainingTime?.durationString}</Typography>
    </Content>
  );
};

export default TimerCoffeeBreakCounter;
