// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, Timestamp } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { StartTimer, ReadyToContinue, TimerStopKind } from '../../api/types/incoming/timer';
import { TimerState } from './../../api/types/incoming/control';
import { TimerKind, TimerStyle } from './../../api/types/outgoing/timer';

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
    startedTimer: (
      state,
      { payload: { payload, timestamp } }: PayloadAction<{ payload: StartTimer; timestamp: Timestamp }>
    ) => {
      state.startedAt = timestamp;
      state.endsAt = payload.endsAt;
      state.timerId = payload.timerId;
      state.readyCheckEnabled = payload.readyCheckEnabled;
      state.title = payload.title;
      state.running = true;
      state.message = payload.message;
      state.kind = payload.kind;
      state.style = payload.style;
    },
    joinedTimer: (state, { payload }: PayloadAction<TimerState>) => {
      state.endsAt = payload.endsAt;
      state.kind = payload.kind;
      state.readyCheckEnabled = payload.readyCheckEnabled;
      state.startedAt = payload.startedAt;
      state.style = payload.style;
      state.timerId = payload.timerId;
      state.message = 'started';
      state.running = true;
    },
    stoppedTimer: (state, { payload }: { payload: { message: 'stopped'; kindStopTimer: TimerStopKind } }) => {
      state.running = false;
      state.message = payload.message;
      state.kindStopTimer = payload.kindStopTimer;
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
});

export const {
  startedTimer,
  stoppedTimer,
  updateParticipantsReady,
  setRealTime,
  setInitialTime,
  setInitialStateTimer,
  joinedTimer,
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
