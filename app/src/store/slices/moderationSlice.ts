// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';
import { ForceMute, ForceMuteType } from '../../types';
import { joinSuccess } from '../commonActions';

interface ModerationState {
  hasHandUp: boolean;
  handUpdatedAt?: string;
  raiseHandsEnabled: boolean;
  forceMute: ForceMute;
}

const initialState: ModerationState = {
  hasHandUp: false,
  raiseHandsEnabled: true,
  forceMute: {
    type: ForceMuteType.Disabled,
    allowList: [],
  },
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
    forceMuteEnabled: (state, { payload: { allowList } }: PayloadAction<Pick<ForceMute, 'allowList'>>) => {
      state.forceMute = {
        type: ForceMuteType.Enabled,
        allowList,
      };
    },
    forceMuteDisabled: (state) => {
      state.forceMute = {
        type: ForceMuteType.Disabled,
        allowList: [],
      };
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
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, action) => {
      const forceMute = action.payload.forceMute;
      if (forceMute) {
        state.forceMute = forceMute;
      } else {
        state.forceMute = {
          type: ForceMuteType.Disabled,
          allowList: [],
        };
      }
    });
  },
});

export const {
  forceLowerHand,
  disableRaisedHands,
  enableRaisedHands,
  raisedHand,
  loweredHand,
  forceMuteEnabled,
  forceMuteDisabled,
} = moderationSlice.actions;
export const actions = moderationSlice.actions;

export const selectHandUp = (state: RootState) => state.moderation.hasHandUp;
export const selectHandUpdatedAt = (state: RootState) => state.moderation.handUpdatedAt;
export const selectRaiseHandsEnabled = (state: RootState) => state.moderation.raiseHandsEnabled;
export const selectForceMute = (state: RootState) => state.moderation.forceMute;
export const selectMicrophonesEnabled = (state: RootState) =>
  state.moderation.forceMute.type === ForceMuteType.Disabled;

export default moderationSlice.reducer;
