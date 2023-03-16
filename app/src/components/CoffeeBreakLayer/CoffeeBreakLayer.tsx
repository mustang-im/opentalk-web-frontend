// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, setHotkeysEnabled } from '@opentalk/common';
import { useEffect, useState, memo, useCallback } from 'react';

import { readyToContinue, TimerStyle } from '../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectParticipantsReady,
  selectTimerId,
  selectTimerRunning,
  selectTimerStartedAt,
  selectTimerStyle,
  setInitialStateTimer,
} from '../../store/slices/timerSlice';
import { selectOurUuid } from '../../store/slices/userSlice';
import { FullScreenLayer } from './fragments/FullScreenLayer';
import { InsideLayer } from './fragments/InsideLayer';

export enum CoffeeBreakRequesters {
  ViewMeeting,
  LayerInside,
}

interface CoffeeBreakLayerProps {
  requester: CoffeeBreakRequesters;
}

const CoffeeBreakLayer = ({ requester }: CoffeeBreakLayerProps) => {
  const dispatch = useAppDispatch();
  const timerId = useAppSelector(selectTimerId);
  const isTimerRunning = useAppSelector(selectTimerRunning);
  const userId = useAppSelector(selectOurUuid);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const timerStartTime = useAppSelector(selectTimerStartedAt);
  const timerStyle = useAppSelector(selectTimerStyle);
  const [open, setOpen] = useState(isTimerRunning);
  const isUserReady = participantsAreReady.includes(userId as ParticipantId);

  const handleDone = useCallback(() => {
    if (timerStartTime && timerId) {
      dispatch(readyToContinue.action({ timerId, status: !isUserReady }));
    }
  }, [timerStartTime, timerId]);

  const clearTimer = useCallback(() => {
    if (!isTimerRunning) {
      dispatch(setInitialStateTimer());
    }
  }, [isTimerRunning]);

  useEffect(() => {
    if (!open) {
      clearTimer();
    }
    dispatch(setHotkeysEnabled(!open));
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    handleDone();
    clearTimer();
  };

  useEffect(() => {
    if (timerStyle === TimerStyle.CoffeeBreak) {
      setOpen(true);
    }

    return () => {
      setOpen(false);
    };
  }, [timerStartTime]);

  const renderRequesterLayer = () => {
    switch (requester) {
      case CoffeeBreakRequesters.ViewMeeting:
        return <FullScreenLayer {...{ open, handleClose }} />;

      case CoffeeBreakRequesters.LayerInside:
        return <InsideLayer {...{ open, handleClose }} />;

      default:
        return null;
    }
  };

  return renderRequesterLayer();
};

export default memo(CoffeeBreakLayer);
