// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { TimerStyle } from '../types';

interface HotkeysState {
  hotkeysEnabled: boolean;
}

const initialState: HotkeysState = {
  hotkeysEnabled: false,
};

export const hotkeysSlice = createSlice({
  name: 'hotkeys',
  initialState,
  reducers: {
    setHotkeysEnabled: (state, { payload: enabled }: PayloadAction<boolean>) => {
      state.hotkeysEnabled = enabled;
    },
  },
});

export const { setHotkeysEnabled } = hotkeysSlice.actions;

/**
 * Since we cannot go up and pull information from the main repository
 * and moving global state to the common package is highly expensive,
 * we have to use this workaround to pickup needed information.
 */
type RootLikeState = {
  timer: { style: TimerStyle };
  hotkeys: HotkeysState,
}

export const selectHotkeysEnabled = createSelector(
  (state: RootLikeState) => state.timer.style,
  (state: RootLikeState) => state.hotkeys.hotkeysEnabled,
  (style, hotkeysEnabled) => {
    if (style === TimerStyle.CoffeeBreak) {
      return false;
    }
    return hotkeysEnabled;
  }
);

export const actions = hotkeysSlice.actions;

export default hotkeysSlice.reducer;
