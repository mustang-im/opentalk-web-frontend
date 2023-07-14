// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TimerStyle } from '@opentalk/common';

import { useAppSelector } from '../../hooks';
import { selectTimerStyle } from '../../store/slices/timerSlice';
import CoffeeBreakPopover from '../CoffeeBreakPopover';
import TimerPopover from '../TimerPopover';

const Timer = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const timerStyle = useAppSelector(selectTimerStyle);

  const renderTimer = () => {
    switch (timerStyle) {
      case TimerStyle.CoffeeBreak:
        return <CoffeeBreakPopover anchorEl={anchorEl} />;
      case TimerStyle.Normal:
        return <TimerPopover anchorEl={anchorEl} />;
      default:
        return null;
    }
  };

  return renderTimer();
};

export default Timer;
