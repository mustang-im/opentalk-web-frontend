// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useAppSelector } from '../../hooks';
import { selectTimerActive } from '../../store/slices/timerSlice';
import { TimerStyle } from '../../types';
import ActiveTimerOverview from './fragments/ActiveTimerOverview';
import CreateTimerForm from './fragments/CreateTimerForm';

const TimerTab = ({ timerStyle }: { timerStyle: TimerStyle }) => {
  const isTimerRunning = useAppSelector(selectTimerActive);

  return !isTimerRunning ? (
    <CreateTimerForm timerStyle={timerStyle} />
  ) : (
    <ActiveTimerOverview timerStyle={timerStyle} />
  );
};

export default TimerTab;
