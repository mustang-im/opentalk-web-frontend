// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';

interface ProtocolState {
  readonly: boolean;
  protocolUrl: URL | null;
}

const initialState: ProtocolState = {
  readonly: true,
  protocolUrl: null,
};

export const protocolSlice = createSlice({
  name: 'protocol',
  initialState,
  reducers: {
    setProtocolReadUrl: (state, action: PayloadAction<URL | null>) => {
      state.protocolUrl = action.payload;
      state.readonly = true;
    },
    setProtocolWriteUrl: (state, action: PayloadAction<URL | null>) => {
      state.protocolUrl = action.payload;
      state.readonly = false;
    },
  },
});

export const { setProtocolReadUrl, setProtocolWriteUrl } = protocolSlice.actions;

const protocolState = (state: RootState) => state.protocol;

export const selectProtocolUrl = createSelector(protocolState, (state) => state.protocolUrl);
export const selectProtocolState = createSelector(protocolState, (state) => state);

export default protocolSlice.reducer;
