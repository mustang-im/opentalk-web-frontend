// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';

interface ProtocolState {
  protocolUrl: URL | null;
}

const initialState: ProtocolState = {
  protocolUrl: null,
};

export const protocolSlice = createSlice({
  name: 'protocol',
  initialState,
  reducers: {
    setProtocolUrl: (state, action: PayloadAction<URL | null>) => {
      state.protocolUrl = action.payload;
    },
  },
});

export const { setProtocolUrl } = protocolSlice.actions;

const protocolState = (state: RootState) => state.protocol;

export const selectProtocolUrl = createSelector(protocolState, (state) => state.protocolUrl);

export default protocolSlice.reducer;
