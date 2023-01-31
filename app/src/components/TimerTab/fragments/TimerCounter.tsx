// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import { notifications } from '@opentalk/common';
import { parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectTimerStartedAt, selectTimerEndsAt, selectTimerRunning } from '../../../store/slices/timerSlice';
import { getIntervalToDurationString } from '../../../utils/timeUtils';

const TimerCounter = () => {
  const { t } = useTranslation();
  const timerRunning = useAppSelector(selectTimerRunning);
  const endTime = useAppSelector(selectTimerEndsAt);
  const endDate = endTime ? new Date(parseISO(endTime)) : undefined;
  const startTime = useAppSelector(selectTimerStartedAt);
  const startDate = startTime ? new Date(parseISO(startTime)) : undefined;

  const getDuration = useCallback(() => {
    const now = new Date();

    //When timer has an end date from the backend it is standard.
    //For that situation we use the end date and count down from now, otherwise we count up from start date.
    if (endDate) {
      return getIntervalToDurationString({
        start: now,
        end: endDate,
      });
    }

    if (startDate === undefined) {
      notifications.error(t('timer-notification-error'));
      throw Error('There was an issue with the start time');
    }

    return getIntervalToDurationString({
      start: startDate,
      end: now,
    });
  }, [startDate, endDate]);

  const [remainingTime, setRemainingTime] = useState<string>(getDuration);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }

    const interval = setInterval(() => setRemainingTime(getDuration), 1000);
    return () => clearInterval(interval);
  }, [getDuration, timerRunning]);

  return (
    <div>
      <Typography variant="caption">{t(`timer-counter-${endDate ? 'remaining' : 'elapsed'}-time`)}</Typography>
      <Typography>{remainingTime}</Typography>
    </div>
  );
};

export default TimerCounter;
