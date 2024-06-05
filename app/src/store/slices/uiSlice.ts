// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  LegalVoteId,
  ParticipantId,
  PollId,
  TargetId,
  SortOption,
  ChatScope,
  TimerStyle,
  joinSuccess,
  MediaSessionType,
  timerStarted,
  timerStopped,
} from '@opentalk/common';
import { legalVoteStore, VoteStarted } from '@opentalk/components';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Event } from '@sentry/react';

import { RootState } from '../';
import { Started as PollStartedInterface } from '../../api/types/incoming/poll';
import { ModerationTabKey } from '../../config/moderationTabs';
import LayoutOptions from '../../enums/LayoutOptions';
import { MediaDescriptor } from '../../modules/WebRTC';
import { hangUp } from '../commonActions';
import { removed } from './mediaSubscriberSlice';
import { leave, breakoutLeft } from './participantsSlice';
import { started as PollStarted } from './pollSlice';
import { setProtocolReadUrl, setProtocolWriteUrl } from './protocolSlice';
import { connectionClosed } from './roomSlice';
import { setWhiteboardAvailable } from './whiteboardSlice';

export interface IChatConversationState {
  scope?: ChatScope;
  targetId?: TargetId;
}

interface ErrorDialog {
  event: Event | undefined;
  showErrorDialog: boolean;
}

interface UIState {
  participantsSortOption: SortOption;
  showParticipantGroups: boolean;
  participantsSearchValue: string;
  chatConversationState: IChatConversationState;
  cinemaLayout: LayoutOptions;
  paginationPage: number;
  pinnedParticipantId?: ParticipantId;
  localVideoMirroringEnabled: boolean;
  showPollVoteResultWindow: boolean;
  votesPollIdToShow?: LegalVoteId | PollId;
  debugMode: boolean;
  chatSearchValue: string;
  isCurrentWhiteboardHighlighted?: boolean;
  isCurrentProtocolHighlighted?: boolean;
  showCoffeeBreakCurtain: boolean;
  activeTab: ModerationTabKey;
  isFullscreenMode: boolean;
  chatAutosavedInputs: {
    [ChatScope.Global]: string;
    [ChatScope.Group]: Record<TargetId, string>;
    [ChatScope.Private]: Record<TargetId, string>;
  };
  focusedSpeaker: ParticipantId | undefined;
  hotkeysEnabled: boolean;
  errorDialog: ErrorDialog;
  haveSeenMobilePollsAndVotes: boolean;
  isDrawerOpen: boolean;
}

const initialState: UIState = {
  participantsSortOption: SortOption.NameASC,
  showParticipantGroups: false,
  participantsSearchValue: '',
  chatConversationState: {
    scope: undefined,
    targetId: undefined,
  },
  cinemaLayout: LayoutOptions.Grid,
  paginationPage: 1,
  pinnedParticipantId: undefined,
  localVideoMirroringEnabled: true,
  showPollVoteResultWindow: false,
  votesPollIdToShow: undefined,
  debugMode: false,
  chatSearchValue: '',
  isCurrentWhiteboardHighlighted: undefined,
  isCurrentProtocolHighlighted: undefined,
  showCoffeeBreakCurtain: false,
  activeTab: ModerationTabKey.Home,
  isFullscreenMode: false,
  chatAutosavedInputs: {
    [ChatScope.Global]: '',
    [ChatScope.Group]: {},
    [ChatScope.Private]: {},
  },
  focusedSpeaker: undefined,
  hotkeysEnabled: true,
  errorDialog: {
    event: undefined,
    showErrorDialog: false,
  },
  haveSeenMobilePollsAndVotes: false,
  isDrawerOpen: false,
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
    updatedCinemaLayout: (state, action: PayloadAction<LayoutOptions>) => {
      state.cinemaLayout = action.payload;
      if (action.payload === LayoutOptions.Whiteboard && state.isCurrentWhiteboardHighlighted) {
        state.isCurrentWhiteboardHighlighted = false;
      }
      if (action.payload === LayoutOptions.Protocol && state.isCurrentProtocolHighlighted) {
        state.isCurrentProtocolHighlighted = false;
      }
    },
    setPaginationPage: (state, action: PayloadAction<number>) => {
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
    setProtocolHighlight(state, { payload: highlight }: PayloadAction<boolean>) {
      state.isCurrentProtocolHighlighted = highlight;
    },
    setCoffeeBreakCurtainOpenFlag(state, { payload: isOpenFlag }: PayloadAction<boolean>) {
      state.showCoffeeBreakCurtain = isOpenFlag;
    },
    setActiveTab(state, { payload: tabKey }: PayloadAction<ModerationTabKey>) {
      state.activeTab = tabKey;
      if (tabKey === ModerationTabKey.PollsAndLegalVote) {
        state.haveSeenMobilePollsAndVotes = true;
      }
    },
    toggledFullScreenMode(state) {
      state.isFullscreenMode = !state.isFullscreenMode;
    },
    pinnedRemoteScreenshare(state, { payload: id }: PayloadAction<ParticipantId>) {
      state.pinnedParticipantId = id;
      state.cinemaLayout = LayoutOptions.Speaker;
    },
    setFocusedSpeaker(state, { payload: id }: PayloadAction<ParticipantId>) {
      state.focusedSpeaker = id;
    },
    saveDefaultChatMessage(
      state,
      { payload }: PayloadAction<{ scope: ChatScope; targetId?: TargetId; input: string }>
    ) {
      if (payload.scope === ChatScope.Global) {
        state.chatAutosavedInputs[ChatScope.Global] = payload.input;
        return;
      }

      if (payload.targetId) {
        state.chatAutosavedInputs[payload.scope][payload.targetId] = payload.input;
      }
    },
    setHotkeysEnabled: (state, { payload }) => {
      state.hotkeysEnabled = payload;
    },
    setShowErrorDialog(state, { payload: { showErrorDialog, event } }: PayloadAction<ErrorDialog>) {
      state.errorDialog.event = event;
      state.errorDialog.showErrorDialog = showErrorDialog;
    },
    setIsDrawerOpen: (state, { payload }) => {
      state.isDrawerOpen = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(leave, (state, { payload: { id } }: PayloadAction<{ id: ParticipantId }>) => {
      if (state.pinnedParticipantId === id) {
        state.pinnedParticipantId = undefined;
      }
      if (state.focusedSpeaker === id) {
        state.focusedSpeaker = undefined;
      }
    });
    builder.addCase(breakoutLeft, (state, { payload: { id } }: PayloadAction<{ id: ParticipantId }>) => {
      if (state.pinnedParticipantId === id) {
        state.pinnedParticipantId = undefined;
      }
    });
    builder.addCase(hangUp.pending, (state) => {
      state.votesPollIdToShow = undefined;
    });
    builder.addCase(connectionClosed, (state) => {
      state.chatConversationState = initialState.chatConversationState;
      state.cinemaLayout = initialState.cinemaLayout;
      state.participantsSortOption = initialState.participantsSortOption;
      state.pinnedParticipantId = initialState.pinnedParticipantId;
      state.paginationPage = initialState.paginationPage;
      state.participantsSearchValue = initialState.participantsSearchValue;
    });
    builder.addCase(setWhiteboardAvailable, (state) => {
      state.isCurrentWhiteboardHighlighted = true;
      state.cinemaLayout = LayoutOptions.Whiteboard;
    });
    builder.addCase(setProtocolReadUrl, (state) => {
      state.isCurrentProtocolHighlighted = true;
    });
    builder.addCase(setProtocolWriteUrl, (state) => {
      state.isCurrentProtocolHighlighted = true;
    });
    builder.addCase(legalVoteStore.started, (state, { payload: vote }: PayloadAction<VoteStarted>) => {
      state.votesPollIdToShow = vote.legalVoteId;
      state.haveSeenMobilePollsAndVotes = state.isDrawerOpen && state.activeTab === ModerationTabKey.PollsAndLegalVote;
    });
    builder.addCase(PollStarted, (state, { payload: vote }: PayloadAction<PollStartedInterface>) => {
      state.votesPollIdToShow = vote.id;
      state.haveSeenMobilePollsAndVotes = state.isDrawerOpen && state.activeTab === ModerationTabKey.PollsAndLegalVote;
    });
    builder.addCase(timerStarted, (state, { payload }) => {
      if (payload.style === TimerStyle.CoffeeBreak) {
        state.showCoffeeBreakCurtain = true;
      }
    });
    builder.addCase(timerStopped, (state) => {
      if (state.showCoffeeBreakCurtain) {
        state.showCoffeeBreakCurtain = false;
      }
    });
    builder.addCase(joinSuccess, (state, { payload: { timer } }) => {
      if (timer?.style === TimerStyle.CoffeeBreak) {
        state.showCoffeeBreakCurtain = true;
      }
    });
    builder.addCase(removed, (state, { payload }: PayloadAction<MediaDescriptor>) => {
      // unpin, if screensharing was stopped by the pinned participant
      if (payload.mediaType === MediaSessionType.Screen && payload.participantId === state.pinnedParticipantId) {
        state.pinnedParticipantId = undefined;
      }
    });
  },
});

export const {
  setParticipantsSortOption,
  setSortByGroups,
  setParticipantsSearchValue,
  chatConversationStateSet,
  updatedCinemaLayout,
  setPaginationPage,
  pinnedParticipantIdSet,
  mirroredVideoSet,
  setShowPollVoteResultWindow,
  setVotePollIdToShow,
  toggleDebugMode,
  setChatSearchValue,
  setProtocolHighlight,
  setCoffeeBreakCurtainOpenFlag,
  setActiveTab,
  toggledFullScreenMode,
  pinnedRemoteScreenshare,
  saveDefaultChatMessage,
  setFocusedSpeaker,
  setHotkeysEnabled,
  setShowErrorDialog,
  setIsDrawerOpen,
} = uiSlice.actions;

export const actions = uiSlice.actions;

export const selectParticipantsSortOption = (state: RootState) => state.ui.participantsSortOption;
export const selectShowParticipantGroups = (state: RootState) => state.ui.showParticipantGroups;
export const selectParticipantsSearchValue = (state: RootState) => state.ui.participantsSearchValue;
export const selectCinemaLayout = (state: RootState) => state.ui.cinemaLayout;
export const selectChatConversationState = (state: RootState) => state.ui.chatConversationState;
export const selectPaginationPageState = (state: RootState) => state.ui.paginationPage;
export const selectPinnedParticipantId = (state: RootState) => state.ui.pinnedParticipantId;
export const selectMirroredVideoEnabled = (state: RootState) => state.ui.localVideoMirroringEnabled;
export const selectShowPollVoteResultWindow = (state: RootState) => state.ui.showPollVoteResultWindow;
export const selectVotePollIdToShow = (state: RootState) => state.ui.votesPollIdToShow;
export const selectDebugMode = (state: RootState) => state.ui.debugMode;
export const selectChatSearchValue = (state: RootState) => state.ui.chatSearchValue;
export const selectIsCurrentWhiteboardHighlighted = (state: RootState) => state.ui.isCurrentWhiteboardHighlighted;
export const selectIsCurrentProtocolHighlighted = (state: RootState) => state.ui.isCurrentProtocolHighlighted;
export const selectShowCoffeeBreakCurtain = (state: RootState) => state.ui.showCoffeeBreakCurtain;
export const selectActiveTab = (state: RootState) => state.ui.activeTab;
export const selectIsFullscreenMode = (state: RootState) => state.ui.isFullscreenMode;
export const selectFocusedSpeaker = (state: RootState) => state.ui.focusedSpeaker;
export function selectDefaultChatMessage(scope: ChatScope, target?: TargetId) {
  return (state: RootState): string => {
    if (scope === ChatScope.Global) {
      return state.ui.chatAutosavedInputs[ChatScope.Global];
    }

    if (target && state.ui.chatAutosavedInputs[scope][target]) {
      return state.ui.chatAutosavedInputs[scope][target];
    }

    return '';
  };
}
export const selectHotkeysEnabled = (state: RootState) => state.ui.hotkeysEnabled;
export const selectShowErrorDialog = (state: RootState) => state.ui.errorDialog.showErrorDialog;
export const selectErrorDialogEvent = (state: RootState) => state.ui.errorDialog.event;
export const selectHaveSeenMobilePollsAndVotes = (state: RootState) => state.ui.haveSeenMobilePollsAndVotes;
export const selectIsDrawerOpen = (state: RootState) => state.ui.isDrawerOpen;

export default uiSlice.reducer;
