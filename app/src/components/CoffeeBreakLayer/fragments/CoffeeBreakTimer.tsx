// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography } from '@mui/material';
import { isNumber } from 'lodash';
import { useEffect, useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectInitialTime, selectRealTime } from '../../../store/slices/timerSlice';

const TimerTypography = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'isRed',
})<{ isRed: string; component: 'div' }>(({ theme, isRed }) => ({
  fontSize: '5rem',
  color: isRed ? theme.palette.error.main : theme.palette.common.white,

  [`${theme.breakpoints.down('lg')}`]: {
    fontSize: '5rem',
  },
}));

const CoffeeBreakTimer = () => {
  const realTime = useAppSelector(selectRealTime);
  const initialTime = useAppSelector(selectInitialTime);
  const [isRed, setIsRed] = useState(false);

  useEffect(() => {
    if (!initialTime || !realTime) {
      return;
    }

    if (!isNumber(initialTime.duration.minutes) || !isNumber(realTime.duration.minutes)) {
      return;
    }

    const initialMinute = initialTime.duration.minutes + 1;
    let redTimerStartMinute;
    if (initialMinute <= 5) {
      redTimerStartMinute = 0;
    } else if (initialMinute <= 15) {
      redTimerStartMinute = 2;
    } else {
      redTimerStartMinute = 4;
    }

    if (realTime.duration.minutes <= redTimerStartMinute) {
      setIsRed(true);
    }

    return () => {
      setIsRed(false);
    };
  }, [initialTime, realTime]);

  return (
    <TimerTypography isRed={isRed ? 'active' : ''} component="div">
      {realTime?.format}
    </TimerTypography>
  );
};

export default CoffeeBreakTimer;
