// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, styled } from '@mui/material';

import { TimerStyle } from '../../api/types/outgoing/timer';
import { useAppSelector } from '../../hooks';
import { selectTimerRunning } from '../../store/slices/timerSlice';
import CreateTimerForm from './fragments/CreateTimerForm';
import TimerOverview from './fragments/TimerOverview';

const Container = styled(Stack)({
  height: '100%',
  maxHeight: 'calc(100vh - 19em)',
  overflow: 'hidden',
});

const TimerTab = ({ timerStyle }: { timerStyle: TimerStyle }) => {
  const timerDidStart = useAppSelector(selectTimerRunning);

  return (
    <Container>
      {!timerDidStart ? <CreateTimerForm {...{ timerStyle }} /> : <TimerOverview {...{ timerStyle }} />}
    </Container>
  );
};

export default TimerTab;
