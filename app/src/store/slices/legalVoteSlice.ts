// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createEntityAdapter, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';

import { VoteCanceled, VoteStarted, VoteStopped, VoteUpdated, VotedType } from '../../api/types/incoming/legalVote';
import {
  LegalState,
  LegalVoteFormValues,
  LegalVoteId,
  LegalVoteType,
  VoteCancelReasonType,
  VoteOption,
} from '../../types';

const cancelReasonFromApiType = (cancel: VoteCanceled): readonly [VoteCancelReasonType, string?] | undefined => {
  if (cancel.reason === VoteCancelReasonType.Custom) {
    return [VoteCancelReasonType.Custom, cancel.custom];
  } else {
    if (cancel.reason === VoteCancelReasonType.InitiatorLeft) {
      return [VoteCancelReasonType.InitiatorLeft, undefined];
    } else if (cancel.reason === VoteCancelReasonType.RoomDestroyed) {
      return [VoteCancelReasonType.RoomDestroyed, undefined];
    } else {
      console.error(new Error('Invalid Cancel Reason from legal-vote Cancel'));
      return;
    }
  }
};

enum LegalVoteStates {
  Active = 'active',
  Finished = 'finished',
  Canceled = 'canceled',
}

const newLegalVoteFromApiType = ({ legalVoteId, ...other }: VoteStarted): LegalVoteType => ({
  id: legalVoteId,
  ...other,
  localStartTime: new Date().toISOString(),
  votes: { yes: 0, no: 0, abstain: 0 },
  state: LegalVoteStates.Active,
  votedAt: null,
  autoClose: false,
});

const legalVoteAdapter = createEntityAdapter<LegalVoteType>({
  sortComparer: (a, b) => {
    const aDate = Date.parse(a.startTime);
    const bDate = Date.parse(b.startTime);
    return aDate - bDate;
  },
});

const initialState: LegalState = {
  votes: legalVoteAdapter.getInitialState(),
  savedLegalVotes: [],
  showResultWindow: false,
};
// We currently only allow a single active shown vote.
// It can be changed to Array<VoteId> once we decided to support multiple active votes.

export const legalVoteSlice = createSlice({
  name: 'legalVote',
  initialState: initialState,
  reducers: {
    initialized: (state) => {
      state.votes = legalVoteAdapter.getInitialState();
      state.savedLegalVotes = [];
      state.showResultWindow = false;
    },
    started: (state, { payload }: PayloadAction<VoteStarted>) => {
      state.currentShownVote = payload.legalVoteId;
      state.activeVote = payload.legalVoteId;
      state.showResultWindow = true;
      const vote = newLegalVoteFromApiType(payload);
      legalVoteAdapter.addOne(state.votes, vote);
    },
    stopped: (state, { payload }: PayloadAction<VoteStopped>) => {
      state.activeVote = undefined;
      legalVoteAdapter.updateOne(state.votes, {
        id: payload.legalVoteId,
        changes: {
          localStopTime: new Date().toISOString(),
          state: LegalVoteStates.Finished,
          votes: {
            yes: payload.results === 'valid' ? payload.yes : 0,
            no: payload.results === 'valid' ? payload.no : 0,
            abstain: payload.results === 'valid' ? payload.abstain || 0 : 0,
          },
          votingRecord: payload.results === 'valid' ? payload.votingRecord : {},
        },
      });
    },
    updated: (state, { payload }: PayloadAction<VoteUpdated>) => {
      // Add 0 default for abstain
      const votes = {
        yes: payload.yes,
        no: payload.no,
        abstain: payload.abstain || 0,
      };

      legalVoteAdapter.updateOne(state.votes, {
        id: payload.legalVoteId,
        changes: { votes, votingRecord: payload.votingRecord || undefined },
      });
    },
    canceled: (state, { payload }: PayloadAction<VoteCanceled>) => {
      const convertedType = cancelReasonFromApiType(payload);
      if (convertedType !== undefined) {
        state.activeVote = undefined;
        const [cancelReason, customCancelReason] = convertedType;
        legalVoteAdapter.updateOne(state.votes, {
          id: payload.legalVoteId,
          changes: {
            state: LegalVoteStates.Canceled,
            cancelReason,
            customCancelReason,
          },
        });
      }
    },
    voted: (state, { payload }: PayloadAction<VotedType>) => {
      legalVoteAdapter.updateOne(state.votes, {
        id: payload.legalVoteId,
        changes: { votedAt: new Date(Date.now()).toISOString() },
      });
    },
    closed: (state, { payload }: PayloadAction<LegalVoteId>) => {
      if (state.activeVote !== undefined) {
        // We only allow closing already finished votes for now
        return;
      }
      if (state.currentShownVote === payload) {
        state.currentShownVote = undefined;
      }
    },
    // tmp action until UX design is done
    closedResultWindow: (state) => {
      state.showResultWindow = false;
      state.currentShownVote = undefined;
    },
    saveLegalVoteFormValues: (state, { payload }: PayloadAction<LegalVoteFormValues>) => {
      const index = state.savedLegalVotes.findIndex((savedLegalVote) => savedLegalVote.id === payload.id);
      if (index !== -1) {
        state.savedLegalVotes[index] = {
          ...state.savedLegalVotes[index],
          ...payload,
        };
        return;
      }
      state.savedLegalVotes.push({
        id: state.savedLegalVotes.length,
        ...payload,
      });
    },
    saveSelectedOption: (
      state,
      { payload }: PayloadAction<{ legalVoteId: LegalVoteId; selectedOption: VoteOption }>
    ) => {
      legalVoteAdapter.updateOne(state.votes, {
        id: payload.legalVoteId,
        changes: { selectedOption: payload.selectedOption },
      });
    },
  },
});

export const actions = legalVoteSlice.actions;
export const {
  initialized,
  started,
  stopped,
  updated,
  voted,
  canceled,
  closed,
  closedResultWindow,
  saveLegalVoteFormValues,
  saveSelectedOption,
} = actions;

const voteSelectors = legalVoteAdapter.getSelectors((state: { legalVote: LegalState }) => state.legalVote.votes);

export const selectVoteById = (id: EntityId) => (state: { legalVote: LegalState }) =>
  voteSelectors.selectById(state, id);
export const selectVoteIds = (state: { legalVote: LegalState }) => voteSelectors.selectIds(state);
export const selectAllVotes = (state: { legalVote: LegalState }) => voteSelectors.selectAll(state);
export const selectVotes = (state: { legalVote: LegalState }) => voteSelectors.selectEntities(state);

export const selectShowLegalVoteWindow = (state: { legalVote: LegalState }) => state.legalVote.showResultWindow;

export const selectCurrentShownVoteId = (state: { legalVote: LegalState }) => state.legalVote.currentShownVote;
export const selectCurrentShownVote = (state: { legalVote: LegalState }) =>
  state.legalVote.currentShownVote ? selectVoteById(state.legalVote.currentShownVote)(state) : undefined;

export const selectActiveVoteId = (state: { legalVote: LegalState }) => state.legalVote.activeVote;

export const selectAllSavedLegalVotes = (state: { legalVote: LegalState }) => state.legalVote.savedLegalVotes;
export const selectSavedLegalVotePerId = (id: number | undefined) => (state: { legalVote: LegalState }) =>
  state.legalVote.savedLegalVotes.find((legalVote) => legalVote.id === id);
export const selectLegalVoteId = (state: { legalVote: LegalState }) => state.legalVote.savedLegalVotes.length;

const legalVoteReducer = legalVoteSlice.reducer;
export default legalVoteReducer;
