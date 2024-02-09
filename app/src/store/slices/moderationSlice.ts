// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';

interface ModerationState {
  hasHandUp: boolean;
  handUpdatedAt?: string;
  raiseHandsEnabled: boolean;
}

const initialState: ModerationState = {
  hasHandUp: false,
  raiseHandsEnabled: true,
};

export const moderationSlice = createSlice({
  name: 'moderation',
  initialState,
  reducers: {
    forceLowerHand: (state) => {
      state.hasHandUp = false;
    },
    enableRaisedHands: (state) => {
      state.raiseHandsEnabled = true;
    },
    disableRaisedHands: (state) => {
      state.raiseHandsEnabled = false;
    },
    /**
     * Inbound action
     */
    raisedHand: (state, { payload: { timestamp } }: PayloadAction<{ timestamp: string }>) => {
      state.hasHandUp = true;
      state.handUpdatedAt = timestamp;
    },
    /**
     * Inbound action
     */
    loweredHand: (state) => {
      state.hasHandUp = false;
      state.handUpdatedAt = undefined;
    },
  },
});

export const { forceLowerHand, disableRaisedHands, enableRaisedHands, raisedHand, loweredHand } =
  moderationSlice.actions;
export const actions = moderationSlice.actions;

export const selectHandUp = (state: RootState) => state.moderation.hasHandUp;
export const selectHandUpdatedAt = (state: RootState) => state.moderation.handUpdatedAt;
export const selectRaiseHandsEnabled = (state: RootState) => state.moderation.raiseHandsEnabled;

export default moderationSlice.reducer;
