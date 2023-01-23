// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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

export const selectHotkeysEnabled = (state: { hotkeys: HotkeysState }) => state.hotkeys.hotkeysEnabled;

export const actions = hotkeysSlice.actions;

export default hotkeysSlice.reducer;
