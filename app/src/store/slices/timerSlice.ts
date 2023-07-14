// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, Timestamp, TimerKind, TimerStyle, joinSuccess } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { intervalToDuration } from 'date-fns';

import { RootState } from '../';
import { TimerStarted, ReadyToContinue } from '../../api/types/incoming/timer';

interface RemainingTime {
  duration: Duration;
  durationString: string;
}

interface State {
  startedAt?: Timestamp;
  timerId?: string;
  endsAt?: Timestamp;
  participantsReady: Array<ParticipantId>;
  readyCheckEnabled?: boolean;
  title?: string;
  running: boolean;
  kind?: TimerKind;
  style?: TimerStyle;
  remainingTime?: RemainingTime;
  totalDuration?: Duration;
}

const initialState: State = {
  startedAt: undefined,
  timerId: undefined,
  endsAt: undefined,
  participantsReady: [],
  readyCheckEnabled: undefined,
  title: undefined,
  running: false,
  kind: undefined,
  style: undefined,
  remainingTime: undefined,
  totalDuration: undefined,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState: initialState,
  reducers: {
    resetTimerState: () => initialState,
    startedTimer: (state, { payload }: PayloadAction<TimerStarted>) => {
      state.startedAt = payload.startedAt;
      state.endsAt = payload.endsAt;
      state.timerId = payload.timerId;
      state.readyCheckEnabled = payload.readyCheckEnabled;
      state.title = payload.title;
      state.running = true;
      state.kind = payload.kind;
      state.style = payload.style;
      state.totalDuration = intervalToDuration({
        start: new Date(payload.startedAt),
        end: new Date(payload.endsAt),
      });
    },
    stoppedTimer: (state) => {
      state.startedAt = undefined;
      state.endsAt = undefined;
      state.timerId = undefined;
      state.readyCheckEnabled = undefined;
      state.title = undefined;
      state.running = false;
      state.kind = undefined;
      state.style = undefined;
      state.totalDuration = undefined;
      state.remainingTime = undefined;
    },
    updateParticipantsReady: (state, { payload }: PayloadAction<ReadyToContinue>) => {
      if (payload.status === true && !state.participantsReady.includes(payload.participantId)) {
        state.participantsReady.push(payload.participantId);
        return;
      }
      if (payload.status === false) {
        state.participantsReady = state.participantsReady.filter((item) => item !== payload.participantId);
      }
    },
    updateRemainingTime: (state, { payload }: PayloadAction<RemainingTime>) => {
      state.remainingTime = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { timer } }) => {
      if (timer) {
        state.endsAt = timer.endsAt;
        state.kind = timer.kind;
        state.readyCheckEnabled = timer.readyCheckEnabled;
        state.startedAt = timer.startedAt;
        state.style = timer.style;
        state.timerId = timer.timerId;
        state.running = true;
      }
    });
  },
});

export const { startedTimer, stoppedTimer, updateParticipantsReady, updateRemainingTime, resetTimerState } =
  timerSlice.actions;

export const actions = timerSlice.actions;

export const selectTimerStartedAt = (state: RootState) => state.timer.startedAt;
export const selectTimerId = (state: RootState) => state.timer.timerId;
export const selectTimerEndsAt = (state: RootState) => state.timer.endsAt;
export const selectParticipantsReady = (state: RootState) => state.timer.participantsReady;
export const selectReadyCheckEnabled = (state: RootState) => state.timer.readyCheckEnabled;
export const selectTimerTitle = (state: RootState) => state.timer.title;
export const selectTimerRunning = (state: RootState) => state.timer.running;
export const selectTimerKind = (state: RootState) => state.timer.kind;
export const selectTimerStyle = (state: RootState) => state.timer.style;
export const selectTotalDuration = (state: RootState) => state.timer.totalDuration;
export const selectRemainingTime = (state: RootState) => state.timer.remainingTime;
export const selectCoffeeBreakTimerId = (state: RootState) =>
  state.timer.style === TimerStyle.CoffeeBreak ? state.timer.timerId : undefined;

export default timerSlice.reducer;
