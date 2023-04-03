// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';

import { TimerStyle } from '../api/types/outgoing/timer';
import { selectParticipants } from '../store/slices/participantsSlice';
import { selectTimerRunning, selectTimerStyle } from '../store/slices/timerSlice';
import { selectDisplayName, selectOurUuid } from '../store/slices/userSlice';
import { useAppSelector } from './';

export const isCoffeeBreakActive = (): boolean => {
  const timerStyle = useAppSelector(selectTimerStyle);
  const timerRunning = useAppSelector(selectTimerRunning);
  const coffeeBreakRunning = timerStyle === TimerStyle.CoffeeBreak && timerRunning;
  return coffeeBreakRunning;
};

export const useDisplayName = () => {
  const participants = useAppSelector(selectParticipants);
  const ourUuid = useAppSelector(selectOurUuid);
  const displayName = useAppSelector(selectDisplayName);
  return {
    resolve: (id: ParticipantId) => {
      if (ourUuid === id) {
        return displayName;
      } else {
        return participants[id]?.displayName;
      }
    },
  };
};
