// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TimerStyle } from '../../api/types/outgoing/timer';
import { useAppSelector } from '../../hooks';
import { selectTimerRunning } from '../../store/slices/timerSlice';
import CreateTimerForm from './fragments/CreateTimerForm';
import TimerOverview from './fragments/TimerOverview';

const TimerTab = ({ timerStyle }: { timerStyle: TimerStyle }) => {
  const timerDidStart = useAppSelector(selectTimerRunning);

  return !timerDidStart ? <CreateTimerForm {...{ timerStyle }} /> : <TimerOverview {...{ timerStyle }} />;
};

export default TimerTab;
