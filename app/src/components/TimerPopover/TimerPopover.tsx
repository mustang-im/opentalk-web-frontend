// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useAppSelector } from '../../hooks';
import { selectTimerStyle } from '../../store/slices/timerSlice';
import { TimerStyle } from '../../types';
import CoffeeBreakPopover from './fragments/CoffeeBreakPopover';
import NormalTimerPopover from './fragments/NormalTimerPopover';

const TimerPopover = () => {
  const timerStyle = useAppSelector(selectTimerStyle);

  if (!timerStyle) {
    return null;
  }

  return timerStyle === TimerStyle.CoffeeBreak ? <CoffeeBreakPopover /> : <NormalTimerPopover />;
};

export default TimerPopover;
