// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, TimerStyle } from '@opentalk/common';

import { useAppSelector } from '../../hooks';
import { selectParticipantsReady, selectTimerStyle } from '../../store/slices/timerSlice';
import { selectIsCoffeeBreakOpen } from '../../store/slices/uiSlice';
import { selectIsModerator, selectOurUuid } from '../../store/slices/userSlice';
import CoffeeBreakLayer from '../CoffeeBreakLayer';
import { CoffeeBreakRequesters } from '../CoffeeBreakLayer/CoffeeBreakLayer';
import CoffeeBreakPopover from '../CoffeeBreakPopover';
import TimerPopover from '../TimerPopover';

const Timer = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const userId = useAppSelector(selectOurUuid);
  const timerStyle = useAppSelector(selectTimerStyle);
  const isModerator = useAppSelector(selectIsModerator);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const isUserReady = participantsAreReady.includes(userId as ParticipantId);
  const isCoffeeBreakOpen = useAppSelector(selectIsCoffeeBreakOpen);

  const renderTimer = () => {
    switch (timerStyle) {
      case TimerStyle.CoffeeBreak:
        if (isUserReady) {
          return <CoffeeBreakPopover anchorEl={anchorEl} />;
        }
        if (!isModerator) {
          return <CoffeeBreakLayer requester={CoffeeBreakRequesters.ViewMeeting} />;
        }
        return null;

      case undefined:
      case TimerStyle.Normal:
        if (isCoffeeBreakOpen && !isModerator) {
          return (
            <>
              <CoffeeBreakLayer requester={CoffeeBreakRequesters.ViewMeeting} />
              <TimerPopover anchorEl={anchorEl} />
            </>
          );
        }

        return <TimerPopover anchorEl={anchorEl} />;

      default:
        return null;
    }
  };

  return renderTimer();
};

export default Timer;
