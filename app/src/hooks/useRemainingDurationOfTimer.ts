// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import { parseISO } from 'date-fns';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '.';
import { selectServerTimeOffset } from '../store/slices/roomSlice';
import { selectTimerStartedAt, selectTimerEndsAt } from '../store/slices/timerSlice';
import { getRemainingTimeForInterval } from '../utils/timeUtils';

interface RemainingTime {
  duration: Duration;
  durationString: string;
}

const useRemainingDurationOfTimer = () => {
  const { t } = useTranslation();
  const serverTimeOffset = useAppSelector(selectServerTimeOffset);
  const endTime = useAppSelector(selectTimerEndsAt);
  const startTime = useAppSelector(selectTimerStartedAt);
  const endDate = endTime ? new Date(parseISO(endTime)) : undefined;
  const startDate = useMemo(() => (startTime ? new Date(parseISO(startTime)) : undefined), [startTime]);

  const [remainingTime, setRemainingTime] = useState<RemainingTime | undefined>();

  const updateRemainingTime = useCallback(() => {
    const now = new Date(Date.now() + serverTimeOffset);

    if (startDate === undefined) {
      notifications.error(t('timer-notification-error'));
      throw Error('There was an issue with the start time');
    }
    //When timer has an end date from the backend it is standard.
    //For that situation we use the end date and count down from now, otherwise we count up from start date.
    if (endDate) {
      const remainingTime = getRemainingTimeForInterval({
        start: now,
        end: endDate,
      });
      setRemainingTime(remainingTime);
      return;
    }

    const remainingTime = getRemainingTimeForInterval({
      start: startDate,
      end: now,
    });
    setRemainingTime(remainingTime);
  }, [startDate, endDate]);

  useEffect(() => {
    if (!startDate) {
      return;
    }

    updateRemainingTime();
    //After we get the initial time we need to sync up the tickrate to the second in order to avoid mismatches in the different components showing time
    const TICK_INTERVAL = 1000;
    const now = new Date().getTime();
    const start = startDate.getTime();
    const runtime = now - start;
    const tick = Math.ceil(runtime / TICK_INTERVAL);
    const nextTick = start + tick * TICK_INTERVAL;
    let interval: ReturnType<typeof setInterval>;
    const timeout = setTimeout(() => {
      updateRemainingTime();
      interval = setInterval(() => updateRemainingTime(), TICK_INTERVAL);
    }, nextTick - now);

    return () => {
      clearTimeout(timeout);
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startDate]);

  return remainingTime;
};

export default useRemainingDurationOfTimer;
