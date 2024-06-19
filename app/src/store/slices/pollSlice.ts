// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { PollId, ChoiceResult, Choice, joinSuccess } from '@opentalk/common';
import { createEntityAdapter, createSlice, EntityId, EntityState, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { Started, LiveUpdate, Done } from '../../api/types/incoming/poll';

export interface Poll {
  id: PollId;
  topic: string;
  duration: number | null;
  choices: Array<Choice>;
  results: Array<ChoiceResult>;
  startTime: string;
  stopTime?: string;
  state: 'active' | 'finished';
  live: boolean;
  voted: boolean;
  selectedChoiceId?: Choice['id'];
}

export interface PollFormValues {
  id?: number;
  topic: string;
  duration: number | string;
  live: boolean;
  choices: Array<string>;
}

const newPollFromApiType = ({ ...poll }: Started): Poll => ({
  ...poll,
  results: [],
  startTime: new Date().toISOString(),
  state: 'active',
  voted: false,
});

const pollAdapter = createEntityAdapter<Poll>({
  sortComparer: (a, b) => {
    const aDate = Date.parse(a.startTime);
    const bDate = Date.parse(b.startTime);
    return aDate - bDate;
  },
});

interface State {
  activePoll?: PollId;
  pollIdToShow?: PollId;
  polls: EntityState<Poll>;
  savedPolls: PollFormValues[];
  showResult: boolean;
}

export const pollSlice = createSlice({
  name: 'poll',
  initialState: {
    polls: pollAdapter.getInitialState(),
    savedPolls: [],
    showResult: false,
  } as State,
  reducers: {
    started: (state, { payload }: PayloadAction<Started>) => {
      state.pollIdToShow = payload.id;
      state.activePoll = payload.id;
      state.showResult = true;

      const vote: Poll = newPollFromApiType(payload);
      pollAdapter.addOne(state.polls, vote);
    },
    done: (state, { payload }: PayloadAction<Done>) => {
      state.activePoll = undefined;
      pollAdapter.updateOne(state.polls, {
        id: payload.id,
        changes: { stopTime: new Date().toISOString(), state: 'finished', results: payload.results },
      });
    },
    liveUpdated: (state, { payload }: PayloadAction<LiveUpdate>) => {
      pollAdapter.updateOne(state.polls, {
        id: payload.id,
        changes: { results: payload.results },
      });
    },
    savePollFormValues: (state, { payload }: PayloadAction<PollFormValues>) => {
      const index = state.savedPolls.findIndex((savedPoll) => savedPoll.id === payload.id);
      if (index !== -1) {
        state.savedPolls[index] = {
          ...state.savedPolls[index],
          ...payload,
        };
        return;
      }
      state.savedPolls.push({
        id: state.savedPolls.length,
        ...payload,
      });
    },
    closedResult: (state) => {
      state.showResult = false;
    },
    voted: (state, { payload }: PayloadAction<{ id: PollId; selectedChoiceId: Choice['id'] }>) => {
      pollAdapter.updateOne(state.polls, {
        id: payload.id,
        changes: { voted: true, selectedChoiceId: payload.selectedChoiceId },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { polls } }) => {
      if (polls !== undefined) {
        const poll = {
          ...polls,
          results: polls.results || [],
          startTime: polls.started,
          state: 'active',
          voted: false,
        } as Poll;
        state.showResult = true;
        state.pollIdToShow = polls.id;
        pollAdapter.upsertOne(state.polls, poll);
      }
    });
  },
});

export const { started, liveUpdated, done, savePollFormValues, closedResult, voted } = pollSlice.actions;
export const actions = pollSlice.actions;

const pollSelectors = pollAdapter.getSelectors<RootState>((state) => state.poll.polls);

export const selectPollById = (id: EntityId) => (state: RootState) => pollSelectors.selectById(state, id);
export const selectPollIds = (state: RootState) => pollSelectors.selectIds(state);
export const selectAllPolls = (state: RootState) => pollSelectors.selectAll(state);
export const selectPollVotes = (state: RootState) => pollSelectors.selectEntities(state);

export const selectPollIdToShow = (state: RootState) => state.poll.pollIdToShow;
export const selectPollToShow = (state: RootState) =>
  state.poll.pollIdToShow ? selectPollById(state.poll.pollIdToShow)(state) : undefined;

export const selectActivePollId = (state: RootState) => state.poll.activePoll;
export const selectActivePoll = (state: RootState) =>
  state.poll.activePoll ? selectPollById(state.poll.activePoll)(state) : undefined;

export const selectAllSavedPolls = (state: RootState) => state.poll.savedPolls;
export const selectSavedPollPerId = (id: number | undefined) => (state: RootState) =>
  state.poll.savedPolls.find((savedPoll) => savedPoll.id === id);

export const selectShowResult = (state: RootState) => state.poll.showResult;
export default pollSlice.reducer;
