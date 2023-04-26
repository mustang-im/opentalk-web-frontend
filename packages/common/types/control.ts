// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Timestamp } from './common';

export enum TimerKind {
  Stopwatch = 'stopwatch',
  Countdown = 'countdown',
}

export enum TimerStyle {
  CoffeeBreak = 'coffee-break',
  Normal = 'normal',
}

export interface TimerState {
  endsAt: Timestamp;
  kind: TimerKind;
  readyCheckEnabled: boolean;
  startedAt: Timestamp;
  style: TimerStyle;
  timerId: string;
}
