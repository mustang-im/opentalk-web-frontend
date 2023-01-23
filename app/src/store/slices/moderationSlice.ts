import { AutomodParameter, ParticipantId } from '@opentalk/common';
import {
  AutomodRemainingUpdated,
  AutomodSpeakerUpdated,
  AutomodStartAnimation,
  AutomodStarted,
} from '@opentalk/components';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';
import automod from '../../api/types/outgoing/automod';
import { lowerHand, raiseHand } from '../../api/types/outgoing/control';
import { joinSuccess } from '../commonActions';

interface ModerationState {
  loading: boolean;
  active: boolean;
  parameters?: AutomodParameter;
  remaining?: Array<ParticipantId>;
  history?: Array<ParticipantId>;
  speaker?: ParticipantId;
  animationRunning: boolean;
  animationInformation?: Omit<AutomodStartAnimation, 'message'>;
  hasHandUp: boolean;
  handUpdatedAt?: string;
  raiseHandsEnabled: boolean;
}

const initialState: ModerationState = {
  loading: false,
  active: false,
  animationRunning: false,
  hasHandUp: false,
  raiseHandsEnabled: true,
};

export const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    started: (state, { payload }: PayloadAction<AutomodStarted>) => {
      state.loading = false;
      state.active = true;
      state.parameters = {
        allowDoubleSelection: payload.allowDoubleSelection,
        considerHandRaise: payload.considerHandRaise,
        selectionStrategy: payload.selectionStrategy,
        showList: payload.showList,
        timeLimit: payload.timeLimit,
        animationOnRandom: payload.animationOnRandom,
      };
      state.history = payload.history;
      state.remaining = payload.remaining;
    },
    stopped: (state) => {
      state.active = false;
      state.loading = false;
      state.remaining = [];
      state.history = [];
      // Todo do we want to clean up the AutomodParameters here? Or are they useful (to show them as a default)
    },
    speakerUpdated: (state, action: PayloadAction<AutomodSpeakerUpdated>) => {
      state.loading = false;
      state.speaker = action.payload.speaker || undefined;
      if (action.payload.remaining) {
        state.remaining = action.payload.remaining;
      }
      if (action.payload.history) {
        state.history = action.payload.history;
      }
      state.animationRunning = false;
    },
    remainingUpdated: (state, action: PayloadAction<AutomodRemainingUpdated>) => {
      state.loading = false;
      state.remaining = action.payload.remaining;
    },
    animationStarted: (state, action: PayloadAction<AutomodStartAnimation>) => {
      state.animationRunning = true;
      state.animationInformation = action.payload;
    },
    forceLowerHand: (state) => {
      state.hasHandUp = false;
    },
    enableRaisedHands: (state) => {
      state.raiseHandsEnabled = true;
    },
    disableRaisedHands: (state) => {
      state.raiseHandsEnabled = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(automod.actions.start.action, (state) => {
        state.loading = true;
      })
      .addCase(automod.actions.stop.action, (state) => {
        state.loading = true;
      })
      .addCase(automod.actions.edit.action, (state) => {
        state.loading = true;
      })
      .addCase(raiseHand.action, (state) => {
        state.hasHandUp = true;
        state.handUpdatedAt = new Date().toISOString();
      })
      .addCase(lowerHand.action, (state) => {
        state.hasHandUp = false;
        state.handUpdatedAt = new Date().toISOString();
      })
      .addCase(joinSuccess, (state, { payload }) => {
        state.active = payload.automod !== undefined;
        if (payload.automod) {
          state.speaker = payload.automod.speaker || undefined;
          state.parameters = {
            allowDoubleSelection: payload.automod.config.allowDoubleSelection,
            considerHandRaise: payload.automod.config.considerHandRaise,
            selectionStrategy: payload.automod.config.selectionStrategy,
            showList: payload.automod.config.showList,
            timeLimit: payload.automod.config.timeLimit,
            animationOnRandom: payload.automod.config.animationOnRandom,
          };
          state.remaining = payload.automod.config.remaining;
          state.history = payload.automod.config.history;
        }
      });
  },
});

export const {
  started,
  stopped,
  speakerUpdated,
  remainingUpdated,
  forceLowerHand,
  disableRaisedHands,
  enableRaisedHands,
} = moderationSlice.actions;
export const actions = moderationSlice.actions;

export const selectModerationLoading = (state: RootState) => state.moderation.loading;
export const selectModerationActive = (state: RootState) => state.moderation.active;
export const selectParameters = (state: RootState) => state.moderation.parameters;
export const selectSelectionMode = (state: RootState) => state.moderation.parameters?.selectionStrategy || undefined;
export const selectRemaining = (state: RootState) => state.moderation.remaining;
export const selectHistory = (state: RootState) => state.moderation.history;
export const selectSpeaker = (state: RootState) => state.moderation.speaker;
export const selectHandUp = (state: RootState) => state.moderation.hasHandUp;
export const selectHandUpdatedAt = (state: RootState) => state.moderation.handUpdatedAt;
export const selectRaiseHandsEnabled = (state: RootState) => state.moderation.raiseHandsEnabled;

export default moderationSlice.reducer;
