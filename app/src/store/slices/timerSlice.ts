// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, Timestamp } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { StartTimer, ReadyToContinue } from '../../api/types/incoming/timer';

interface State {
  startedAt?: Timestamp;
  timerId?: string;
  endsAt?: Timestamp;
  participantsReady: Array<ParticipantId>;
  readyCheckEnabled: boolean;
  title?: string;
  running: boolean;
}

const initialState = {
  startedAt: undefined,
  timerId: undefined,
  endsAt: undefined,
  participantsReady: [],
  readyCheckEnabled: false,
  title: undefined,
  running: false,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState: initialState as State,
  reducers: {
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
    },
    stoppedTimer: (state) => {
      state.running = false;
      state.participantsReady = [];
    },
    updateParticpantsReady: (state, { payload }: PayloadAction<ReadyToContinue>) => {
      if (payload.status === true && !state.participantsReady.includes(payload.participantId)) {
        state.participantsReady.push(payload.participantId);
        return;
      }
      if (payload.status === false) {
        state.participantsReady = state.participantsReady.filter((item) => item !== payload.participantId);
      }
    },
  },
});

export const { startedTimer, stoppedTimer, updateParticpantsReady } = timerSlice.actions;

export const actions = timerSlice.actions;

export const selectTimerStartedAt = (state: RootState) => state.timer.startedAt;
export const selectTimerId = (state: RootState) => state.timer.timerId;
export const selectTimerEndsAt = (state: RootState) => state.timer.endsAt;
export const selectParticipantsReady = (state: RootState) => state.timer.participantsReady;
export const selectReadyCheckEnabled = (state: RootState) => state.timer.readyCheckEnabled;
export const selectTimerTitle = (state: RootState) => state.timer.title;
export const selectTimerRunning = (state: RootState) => state.timer.running;

export default timerSlice.reducer;
