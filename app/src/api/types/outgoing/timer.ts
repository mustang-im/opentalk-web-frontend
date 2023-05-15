// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule, Namespaced, TimerKind, TimerStyle } from '@opentalk/common';

import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';
import { sendMessage } from '../../index';

export interface StartTimer {
  action: 'start';
  enableReadyCheck: boolean;
  duration?: number;
  title?: string;
  kind?: TimerKind;
  style?: TimerStyle;
}
export interface StopTimer {
  action: 'stop';
  timerId: string;
}

export interface ReadyToContinue {
  action: 'update_ready_status';
  timerId: string;
  status: boolean;
}

export type Action = StartTimer | StopTimer | ReadyToContinue;

export type Timer = Namespaced<Action, 'timer'>;

export const startTimer = createSignalingApiCall<StartTimer>('timer', 'start');
export const stopTimer = createSignalingApiCall<StopTimer>('timer', 'stop');
export const readyToContinue = createSignalingApiCall<ReadyToContinue>('timer', 'update_ready_status');

export const handler = createModule<RootState>((builder) => {
  builder.addCase(startTimer.action, (_state, { payload }) => {
    sendMessage(startTimer(payload));
  });
  builder.addCase(stopTimer.action, (_state, { payload }) => {
    sendMessage(stopTimer(payload));
  });
  builder.addCase(readyToContinue.action, (_state, { payload }) => {
    sendMessage(readyToContinue(payload));
  });
});

export default Timer;
