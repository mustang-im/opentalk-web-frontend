// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, Timestamp, TimerKind, TimerStyle, joinSuccess } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { TimerStarted, ReadyToContinue, TimerStopKind, TimerStopped } from '../../api/types/incoming/timer';

interface RealTime {
  format: string;
  duration: Duration;
}

interface State {
  startedAt?: Timestamp;
  timerId?: string;
  endsAt?: Timestamp;
  participantsReady: Array<ParticipantId>;
  readyCheckEnabled: boolean;
  title?: string;
  running: boolean;
  message?: 'started' | 'stopped';
  kind?: TimerKind;
  style?: TimerStyle;
  realTime?: RealTime;
  initialTime?: RealTime;
  kindStopTimer?: TimerStopKind;
}

const initialState = {
  startedAt: undefined,
  timerId: undefined,
  endsAt: undefined,
  participantsReady: [],
  readyCheckEnabled: false,
  title: undefined,
  running: false,
  kind: undefined,
  style: undefined,
  message: undefined,
  realTime: undefined,
  initialTime: undefined,
  kindStopTimer: undefined,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState: initialState as State,
  reducers: {
    setInitialStateTimer: () => initialState,
    startedTimer: (state, { payload }: PayloadAction<TimerStarted>) => {
      state.startedAt = payload.startedAt;
      state.endsAt = payload.endsAt;
      state.timerId = payload.timerId;
      state.readyCheckEnabled = payload.readyCheckEnabled;
      state.title = payload.title;
      state.running = true;
      state.message = payload.message;
      state.kind = payload.kind;
      state.style = payload.style;
    },
    stoppedTimer: (state, { payload }: PayloadAction<TimerStopped>) => {
      state.running = false;
      state.message = payload.message;
      state.kindStopTimer = payload.kind;
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
    setRealTime: (state, action) => {
      state.realTime = action.payload as RealTime;
    },
    setInitialTime: (state, action) => {
      state.initialTime = action.payload as RealTime;
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
        state.message = 'started';
        state.running = true;
      }
    });
  },
});

export const {
  startedTimer,
  stoppedTimer,
  updateParticipantsReady,
  setRealTime,
  setInitialTime,
  setInitialStateTimer,
} = timerSlice.actions;

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
export const selectInitialTime = (state: RootState) => state.timer.initialTime;
export const selectRealTime = (state: RootState) => state.timer.realTime;
export const selectTimerMessage = (state: RootState) => state.timer.message;
export const selectTimerStopKind = (state: RootState) => state.timer.kindStopTimer;

export default timerSlice.reducer;
