// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { joinSuccess, SharedFolderData } from '@opentalk/common';
import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '..';

interface SharedFolderState {
  opened: boolean;
  sharedFolderData?: SharedFolderData;
}

const initialState: SharedFolderState = {
  opened: false,
};

export const sharedFolderSlice = createSlice({
  name: 'shared-folder',
  initialState,
  reducers: {
    sharedFolderOpened: (state) => {
      state.opened = true;
    },
    sharedFolderUpdated: (state, { payload }) => {
      state.sharedFolderData = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { sharedFolder } }) => {
      state.sharedFolderData = sharedFolder;
    });
  },
});

export const { sharedFolderOpened, sharedFolderUpdated } = sharedFolderSlice.actions;

export const actions = sharedFolderSlice.actions;

export const selectIsSharedFolderOpened = (state: RootState) => state.sharedFolder.opened;
export const selectIsSharedFolderAvailable = (state: RootState) => {
  if (state.sharedFolder.sharedFolderData && state.sharedFolder.sharedFolderData.read) {
    return true;
  }
  return false;
};
export const selectSharedFolderUrl = (state: RootState) => {
  if (state.sharedFolder.sharedFolderData && state.sharedFolder.sharedFolderData.readWrite) {
    return state.sharedFolder.sharedFolderData.readWrite.url;
  }
  if (state.sharedFolder.sharedFolderData && state.sharedFolder.sharedFolderData.read) {
    return state.sharedFolder.sharedFolderData.read.url;
  }
};

export const selectSharedFolderPassword = (state: RootState) => {
  if (state.sharedFolder.sharedFolderData && state.sharedFolder.sharedFolderData.readWrite) {
    return state.sharedFolder.sharedFolderData.readWrite.password;
  }
  if (state.sharedFolder.sharedFolderData && state.sharedFolder.sharedFolderData.read) {
    return state.sharedFolder.sharedFolderData.read.password;
  }
};

export default sharedFolderSlice.reducer;
