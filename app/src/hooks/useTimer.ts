// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications } from '@opentalk/common';
import { parseISO } from 'date-fns';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '.';
import { selectServerTimeOffset } from '../store/slices/roomSlice';
import {
  selectTimerStartedAt,
  selectTimerEndsAt,
  selectTimerRunning,
  updateRemainingTime,
} from '../store/slices/timerSlice';
import { getRemainingTimeForInterval } from '../utils/timeUtils';

const useTimer = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const timerRunning = useAppSelector(selectTimerRunning);
  const serverTimeOffset = useAppSelector(selectServerTimeOffset);
  const endTime = useAppSelector(selectTimerEndsAt);
  const startTime = useAppSelector(selectTimerStartedAt);
  const endDate = endTime ? new Date(parseISO(endTime)) : undefined;
  const startDate = startTime ? new Date(parseISO(startTime)) : undefined;

  const getDuration = useCallback(() => {
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
      dispatch(updateRemainingTime(remainingTime));
      return;
    }

    const remainingTime = getRemainingTimeForInterval({
      start: startDate,
      end: now,
    });
    dispatch(updateRemainingTime(remainingTime));
  }, [startDate, endDate]);

  useEffect(() => {
    if (!timerRunning) {
      return;
    }

    getDuration();

    const interval = setInterval(() => getDuration(), 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getDuration, timerRunning]);
};

export default useTimer;
