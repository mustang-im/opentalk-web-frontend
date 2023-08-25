// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  ParticipantId,
  Timestamp,
  TimerKind,
  TimerStopKind,
  TimerStyle,
  joinSuccess,
  notifications,
  timerStarted,
  timerStopped,
} from '@opentalk/common';
import { createListenerMiddleware, createSlice, PayloadAction, TypedStartListening } from '@reduxjs/toolkit';
import { intervalToDuration } from 'date-fns';
import i18next from 'i18next';

import { AppDispatch, RootState } from '../';
import { ReadyToContinue } from '../../api/types/incoming/timer';
import localMediaContext from '../../modules/Media/LocalMedia';

interface State {
  startedAt?: Timestamp;
  timerId?: string;
  endsAt?: Timestamp;
  participantsReady: Array<ParticipantId>;
  readyCheckEnabled?: boolean;
  title?: string;
  kind?: TimerKind;
  style?: TimerStyle;
  totalDuration?: Duration;
  timerStopKind?: TimerStopKind;
}

const initialState: State = {
  startedAt: undefined,
  timerId: undefined,
  endsAt: undefined,
  participantsReady: [],
  readyCheckEnabled: undefined,
  title: undefined,
  kind: undefined,
  style: undefined,
  totalDuration: undefined,
  timerStopKind: undefined,
};

export const timerSlice = createSlice({
  name: 'timer',
  initialState: initialState,
  reducers: {
    resetTimerState: () => initialState,
    updateParticipantsReady: (state, { payload }: PayloadAction<ReadyToContinue>) => {
      if (payload.status === true && !state.participantsReady.includes(payload.participantId)) {
        state.participantsReady.push(payload.participantId);
        return;
      }
      if (payload.status === false) {
        state.participantsReady = state.participantsReady.filter(
          (item: ParticipantId) => item !== payload.participantId
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { participantId, participantsReady, timer } }) => {
      if (timer) {
        state.timerId = timer.timerId;
        state.startedAt = timer.startedAt;
        state.endsAt = timer.endsAt;
        state.kind = timer.kind;
        state.readyCheckEnabled = timer.readyCheckEnabled;
        state.style = timer.style;
        state.participantsReady = participantsReady;
        if (timer.readyStatus === true) {
          state.participantsReady.push(participantId);
        }
        if (timer.endsAt) {
          state.totalDuration = intervalToDuration({
            start: new Date(timer.startedAt),
            end: new Date(timer.endsAt),
          });
        }
        state.timerStopKind = undefined;
      }
    });
    builder.addCase(timerStarted, (state, { payload }) => {
      state.timerId = payload.timerId;
      state.startedAt = payload.startedAt;
      state.endsAt = payload.endsAt;
      state.readyCheckEnabled = payload.readyCheckEnabled;
      state.title = payload.title;
      state.kind = payload.kind;
      state.style = payload.style;
      if (payload.endsAt) {
        state.totalDuration = intervalToDuration({
          start: new Date(payload.startedAt),
          end: new Date(payload.endsAt),
        });
      }
      state.timerStopKind = undefined;
    });
    builder.addCase(timerStopped, (state, { payload }) => {
      state.timerId = undefined;
      state.startedAt = undefined;
      state.endsAt = undefined;
      state.readyCheckEnabled = undefined;
      state.title = undefined;
      state.kind = undefined;
      state.style = undefined;
      state.totalDuration = undefined;
      state.participantsReady = [];
      state.timerStopKind = payload.kind;
    });
  },
});

export const { updateParticipantsReady, resetTimerState } = timerSlice.actions;

export const actions = timerSlice.actions;

export const selectTimerStartedAt = (state: RootState) => state.timer.startedAt;
export const selectTimerId = (state: RootState) => state.timer.timerId;
export const selectTimerEndsAt = (state: RootState) => state.timer.endsAt;
export const selectParticipantsReady = (state: RootState) => state.timer.participantsReady;
export const selectReadyCheckEnabled = (state: RootState) => state.timer.readyCheckEnabled;
export const selectTimerTitle = (state: RootState) => state.timer.title;
export const selectTimerActive = (state: RootState) => state.timer.startedAt && !state.timer.timerStopKind;
export const selectTimerKind = (state: RootState) => state.timer.kind;
export const selectTimerStyle = (state: RootState) => state.timer.style;
export const selectTotalDuration = (state: RootState) => state.timer.totalDuration;
export const selectCoffeeBreakTimerId = (state: RootState) =>
  state.timer.style === TimerStyle.CoffeeBreak ? state.timer.timerId : undefined;

export default timerSlice.reducer;

export const timerMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = timerMiddleware.startListening as AppStartListening;

startAppListening({
  actionCreator: timerStarted,
  effect: (action, listenerApi) => {
    const mediaState = listenerApi.getOriginalState().media;

    //Avoid sending reconfigure if both video and audio tracks are not active
    const isAnyMediaTrackEnabled = mediaState.audioEnabled || mediaState.videoEnabled;
    if (action.payload.style === TimerStyle.CoffeeBreak && isAnyMediaTrackEnabled) {
      localMediaContext.reconfigure({ audio: false, video: false });
    }
  },
});

startAppListening({
  actionCreator: timerStopped,
  effect: (action, listenerApi) => {
    const timerStyle = listenerApi.getOriginalState().timer.style;
    if (timerStyle === TimerStyle.Normal) {
      switch (action.payload.kind) {
        case TimerStopKind.Expired:
          notifications.info(i18next.t('timer-notification-ran-out'));
          break;
        case TimerStopKind.ByModerator:
          notifications.info(i18next.t('timer-notification-stopped'));
          break;
        case TimerStopKind.CreatorLeft:
        default:
          break;
      }
    }
    if (timerStyle === TimerStyle.CoffeeBreak) {
      notifications.info(i18next.t('coffee-break-notification'));
    }
  },
});
