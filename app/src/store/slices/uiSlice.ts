// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { LegalVoteId, ParticipantId, PollId, TargetId } from '@opentalk/common';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import ChatScope from '../../enums/ChatScope';
import LayoutOptions from '../../enums/LayoutOptions';
import SortOption from '../../enums/SortOption';
import { leave, breakoutLeft } from './participantsSlice';
import { connectionClosed } from './roomSlice';

export interface IChatConversationState {
  scope?: ChatScope;
  targetId?: TargetId;
}

interface UIState {
  participantsSortOption: SortOption;
  showParticipantGroups: boolean;
  participantsSearchValue: string;
  chatConversationState: IChatConversationState;
  participantsLayout: LayoutOptions;
  paginationPage: number;
  pinnedParticipantId?: ParticipantId;
  localVideoMirroringEnabled: boolean;
  showPollVoteResultWindow: boolean;
  votesPollIdToShow?: LegalVoteId | PollId;
  debugMode: boolean;
  chatSearchValue: string;
}

const initialState: UIState = {
  participantsSortOption: SortOption.NameASC,
  showParticipantGroups: false,
  participantsSearchValue: '',
  chatConversationState: {
    scope: undefined,
    targetId: undefined,
  },
  participantsLayout: LayoutOptions.Grid,
  paginationPage: 1,
  pinnedParticipantId: undefined,
  localVideoMirroringEnabled: true,
  showPollVoteResultWindow: false,
  votesPollIdToShow: undefined,
  debugMode: false,
  chatSearchValue: '',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setParticipantsSortOption: (state, action: PayloadAction<SortOption>) => {
      state.participantsSortOption = action.payload;
    },
    setSortByGroups: (state, { payload }: PayloadAction<boolean>) => {
      state.showParticipantGroups = payload;
    },
    setParticipantsSearchValue: (state, action: PayloadAction<string>) => {
      state.participantsSearchValue = action.payload;
    },
    chatConversationStateSet: (state, action: PayloadAction<IChatConversationState>) => {
      state.chatConversationState = action.payload;
    },
    participantsLayoutSet: (state, action: PayloadAction<LayoutOptions>) => {
      state.participantsLayout = action.payload;
    },
    paginationPageSet: (state, action: PayloadAction<number>) => {
      state.paginationPage = action.payload;
    },
    pinnedParticipantIdSet: (state, { payload }: PayloadAction<ParticipantId | undefined>) => {
      state.pinnedParticipantId = payload;
    },
    mirroredVideoSet: (state, { payload: enabled }: PayloadAction<boolean>) => {
      state.localVideoMirroringEnabled = enabled;
    },
    setShowPollVoteResultWindow(state, { payload: showPollVoteResultWindow }: PayloadAction<boolean>) {
      state.showPollVoteResultWindow = showPollVoteResultWindow;
    },
    setVotePollIdToShow(state, { payload: votesPollIdToShow }: PayloadAction<PollId | LegalVoteId | undefined>) {
      state.votesPollIdToShow = votesPollIdToShow;
    },
    toggleDebugMode(state) {
      state.debugMode = !state.debugMode;
    },
    setChatSearchValue(state, { payload: nextSearchValue }: PayloadAction<string>) {
      state.chatSearchValue = nextSearchValue;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(leave, (state, { payload: { id } }: PayloadAction<{ id: ParticipantId }>) => {
      if (state.pinnedParticipantId === id) {
        state.pinnedParticipantId = undefined;
      }
    });
    builder.addCase(breakoutLeft, (state, { payload: { id } }: PayloadAction<{ id: ParticipantId }>) => {
      if (state.pinnedParticipantId === id) {
        state.pinnedParticipantId = undefined;
      }
    });
    builder.addCase(connectionClosed, (state) => {
      state.chatConversationState = initialState.chatConversationState;
      state.participantsLayout = initialState.participantsLayout;
      state.participantsSortOption = initialState.participantsSortOption;
      state.pinnedParticipantId = initialState.pinnedParticipantId;
      state.paginationPage = initialState.paginationPage;
      state.participantsSearchValue = initialState.participantsSearchValue;
    });
  },
});

export const {
  setParticipantsSortOption,
  setSortByGroups,
  setParticipantsSearchValue,
  chatConversationStateSet,
  participantsLayoutSet,
  paginationPageSet,
  pinnedParticipantIdSet,
  mirroredVideoSet,
  setShowPollVoteResultWindow,
  setVotePollIdToShow,
  toggleDebugMode,
  setChatSearchValue,
} = uiSlice.actions;

export const actions = uiSlice.actions;

export const selectParticipantsSortOption = (state: RootState) => state.ui.participantsSortOption;
export const selectShowParticipantGroups = (state: RootState) => state.ui.showParticipantGroups;
export const selectParticipantsSearchValue = (state: RootState) => state.ui.participantsSearchValue;
export const selectParticipantsLayout = (state: RootState) => state.ui.participantsLayout;
export const selectChatConversationState = (state: RootState) => state.ui.chatConversationState;
export const selectPaginationPageState = (state: RootState) => state.ui.paginationPage;
export const selectPinnedParticipantId = (state: RootState) => state.ui.pinnedParticipantId;
export const selectMirroredVideoEnabled = (state: RootState) => state.ui.localVideoMirroringEnabled;
export const selectShowPollVoteResultWindow = (state: RootState) => state.ui.showPollVoteResultWindow;
export const selectVotePollIdToShow = (state: RootState) => state.ui.votesPollIdToShow;
export const selectDebugMode = (state: RootState) => state.ui.debugMode;
export const selectChatSearchValue = (state: RootState) => state.ui.chatSearchValue;

export default uiSlice.reducer;
