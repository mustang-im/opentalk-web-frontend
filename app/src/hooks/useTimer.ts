// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notifications, ParticipantId } from '@opentalk/common';
import { parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '.';
import { TimerStyle } from '../api/types/outgoing/timer';
import { useMediaContext } from '../components/MediaProvider';
import { selectServerTimeOffset } from '../store/slices/roomSlice';
import {
  selectTimerStartedAt,
  selectTimerEndsAt,
  selectTimerRunning,
  setRealTime,
  setInitialTime,
  setInitialStateTimer,
  selectTimerMessage,
  selectTimerStyle,
  selectTimerStopKind,
  selectParticipantsReady,
} from '../store/slices/timerSlice';
import { selectIsModerator, selectOurUuid } from '../store/slices/userSlice';
import { getDuration as getDurationUtil } from '../utils/timeUtils';

const useTimer = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [initial, setIntial] = useState(false);
  const timerRunning = useAppSelector(selectTimerRunning);
  const timerMessage = useAppSelector(selectTimerMessage);
  const timerStyle = useAppSelector(selectTimerStyle);
  const kindStopTimer = useAppSelector(selectTimerStopKind);
  const isModerator = useAppSelector(selectIsModerator);
  const serverTimeOffset = useAppSelector(selectServerTimeOffset);
  const endTime = useAppSelector(selectTimerEndsAt);
  const startTime = useAppSelector(selectTimerStartedAt);
  const endDate = endTime ? new Date(parseISO(endTime)) : undefined;
  const startDate = startTime ? new Date(parseISO(startTime)) : undefined;
  const userId = useAppSelector(selectOurUuid);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const isUserReady = participantsAreReady.includes(userId as ParticipantId);
  const mediaContext = useMediaContext();

  const getDuration = useCallback(() => {
    const now = new Date(Date.now() + serverTimeOffset);

    let timer = {
      format: '',
      duration: {} as Duration,
    };

    //When timer has an end date from the backend it is standard.
    //For that situation we use the end date and count down from now, otherwise we count up from start date.
    if (endDate) {
      timer = getDurationUtil({
        start: now,
        end: endDate,
      });
    }

    if (startDate === undefined) {
      notifications.error(t('timer-notification-error'));
      throw Error('There was an issue with the start time');
    }

    if (!endDate) {
      timer = getDurationUtil({
        start: startDate,
        end: now,
      });
    }

    dispatch(setRealTime(timer));
    if (!initial) {
      dispatch(setInitialTime(timer));
      setIntial(true);
    }
  }, [startDate, endDate, initial]);

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

  const disableMedia = useCallback(async () => {
    try {
      await mediaContext.trySetVideo(false);
      await mediaContext.trySetAudio(false);
    } catch (error) {
      console.error('Something went wrong : ', error);
    }
  }, [mediaContext]);

  const switchStartedTimerStyle = useCallback(() => {
    switch (timerStyle) {
      case TimerStyle.CoffeeBreak: {
        disableMedia();
        break;
      }
    }
  }, [timerStyle]);

  const switchStoppedTimerStyle = useCallback(() => {
    setIntial(false);
    switch (timerStyle) {
      case TimerStyle.Normal: {
        if (kindStopTimer === 'expired') {
          notifications.info(t('timer-notification-ran-out'));
        }

        if (kindStopTimer === 'by_moderator') {
          notifications.info(t('timer-notification-stopped'));
        }

        dispatch(setInitialStateTimer());

        break;
      }

      case TimerStyle.CoffeeBreak: {
        notifications.info(t('coffee-break-notification'));
        if (isModerator || isUserReady) {
          dispatch(setInitialStateTimer());
        }
        break;
      }
    }
  }, [timerStyle, isUserReady]);

  useEffect(() => {
    switch (timerMessage) {
      case 'started': {
        switchStartedTimerStyle();
        break;
      }

      case 'stopped': {
        switchStoppedTimerStyle();
        break;
      }
    }
  }, [timerMessage]);
};

export default useTimer;
