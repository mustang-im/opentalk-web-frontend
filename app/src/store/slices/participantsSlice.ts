// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  BackendParticipant,
  BreakoutRoomId,
  GroupId,
  ParticipantId,
  ParticipationKind,
  PresenterRoleState,
  Timestamp,
} from '@opentalk/common';
import { createEntityAdapter, createSelector, createSlice, EntityId, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { ParticipantInOtherRoom } from '../../api/types/incoming/breakout';
import { Role } from '../../api/types/incoming/control';
import { joinSuccess } from '../commonActions';
import { selectCurrentBreakoutRoomId } from './breakoutSlice';
import { setFocusedSpeaker } from './mediaSlice';
import { connectionClosed } from './roomSlice';

export enum WaitingState {
  Joined = 'joined',
  Waiting = 'waiting',
  Approved = 'approved',
}
export interface Participant {
  id: ParticipantId;
  breakoutRoomId: BreakoutRoomId | null;
  displayName: string;
  avatarUrl?: string;
  handIsUp: boolean;
  joinedAt: string;
  leftAt: string | null;
  handUpdatedAt?: string;
  groups: GroupId[];
  participationKind: ParticipationKind;
  lastActive: string;
  role?: Role;
  waitingState: WaitingState;
  presenterRole?: PresenterRoleState;
}

export const participantAdapter = createEntityAdapter<Participant>({
  sortComparer: (a, b) => a.displayName.localeCompare(b.displayName),
});

export const participantsSlice = createSlice({
  name: 'participants',
  initialState: participantAdapter.getInitialState(),
  reducers: {
    join: (
      state,
      {
        payload: {
          participant: {
            id,
            displayName,
            avatarUrl,
            handIsUp,
            joinedAt,
            leftAt,
            handUpdatedAt,
            groups,
            breakoutRoomId,
            participationKind,
            role,
            presenterRole,
          },
        },
      }: PayloadAction<{ participant: Participant }>
    ) => {
      participantAdapter.upsertOne(state, {
        id,
        groups,
        displayName,
        avatarUrl,
        handIsUp,
        joinedAt,
        leftAt,
        handUpdatedAt,
        breakoutRoomId,
        participationKind,
        lastActive: joinedAt,
        role,
        waitingState: WaitingState.Joined,
        presenterRole,
      });
    },
    leave: (state, { payload: { id, timestamp } }: PayloadAction<{ id: ParticipantId; timestamp: string }>) => {
      participantAdapter.updateOne(state, {
        id,
        changes: {
          leftAt: timestamp,
        },
      });
    },
    breakoutJoined: (
      state,
      {
        payload: { data, timestamp },
      }: PayloadAction<{
        data: ParticipantInOtherRoom;
        timestamp: string;
      }>
    ) => {
      const participant: Participant = {
        id: data.id,
        displayName: data.displayName,
        avatarUrl: data.avatarUrl,
        groups: [],
        handIsUp: false,
        joinedAt: timestamp,
        leftAt: null,
        handUpdatedAt: timestamp,
        breakoutRoomId: data.breakoutRoom,
        participationKind: data.participationKind,
        lastActive: timestamp,
        waitingState: WaitingState.Joined,
      };
      participantAdapter.upsertOne(state, participant);
    },
    breakoutLeft: (state, { payload: { id, timestamp } }: PayloadAction<{ id: ParticipantId; timestamp: string }>) => {
      participantAdapter.updateOne(state, {
        id,
        changes: { breakoutRoomId: null, leftAt: timestamp },
      });
    },
    waitingRoomJoined: (state, { payload }: PayloadAction<BackendParticipant>) => {
      const participant: Participant = {
        id: payload.id,
        displayName: payload.control.displayName,
        avatarUrl: payload.control.avatarUrl,
        groups: [],
        handIsUp: false,
        joinedAt: payload.control.joinedAt,
        leftAt: null,
        handUpdatedAt: payload.control.handUpdatedAt,
        breakoutRoomId: null,
        participationKind: payload.control.participationKind,
        lastActive: payload.control.joinedAt,
        waitingState: WaitingState.Waiting,
      };
      participantAdapter.upsertOne(state, participant);
    },
    waitingRoomLeft: (state, { payload }: PayloadAction<ParticipantId>) => {
      participantAdapter.removeOne(state, payload);
    },
    approveToEnter: (state, { payload }: PayloadAction<ParticipantId>) => {
      participantAdapter.updateOne(state, {
        id: payload,
        changes: { waitingState: WaitingState.Approved },
      });
    },
    update: (
      state,
      {
        payload: { id, displayName, handIsUp, joinedAt, leftAt, handUpdatedAt, role, presenterRole },
      }: PayloadAction<Omit<Participant, 'breakoutRoomId' | 'groups'>>
    ) => {
      participantAdapter.updateOne(state, {
        id,
        changes: { displayName, handIsUp, joinedAt, leftAt, handUpdatedAt, role, presenterRole },
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { participants } }) => {
      participantAdapter.setAll(state, participants);
    });
    builder.addCase(connectionClosed, () => participantAdapter.getInitialState());
    builder.addCase(
      setFocusedSpeaker,
      (state, { payload: { id, timestamp } }: PayloadAction<{ id: ParticipantId; timestamp?: Timestamp }>) => {
        participantAdapter.updateOne(state, {
          id,
          changes: { lastActive: timestamp },
        });
      }
    );
  },
});

export const { join, leave, update, breakoutJoined, breakoutLeft, waitingRoomJoined, waitingRoomLeft, approveToEnter } =
  participantsSlice.actions;
export const actions = participantsSlice.actions;

export const participantSelectors = participantAdapter.getSelectors<RootState>((state) => state.participants);

export const selectAllParticipants = (state: RootState) => participantSelectors.selectAll(state);

export const selectAllParticipantsInWaitingRoom = createSelector(selectAllParticipants, (participants) =>
  participants.filter((participant) => participant.waitingState !== WaitingState.Joined)
);

export const selectParticipantsWaitingCount = createSelector(
  selectAllParticipantsInWaitingRoom,
  (participants) => participants.length
);

export const selectNotApprovedParticipants = createSelector(selectAllParticipantsInWaitingRoom, (participants) =>
  participants.find((participant) => participant.waitingState === WaitingState.Waiting)
);

export const selectAllOnlineParticipantsInConference = createSelector(selectAllParticipants, (participants) =>
  participants.filter((participant) => participant.leftAt === null && participant.waitingState === WaitingState.Joined)
);

export const selectAllOnlineParticipants = createSelector(
  [selectAllOnlineParticipantsInConference, selectCurrentBreakoutRoomId],
  (participants, currentBreakoutRoomId) =>
    participants.filter((participant) => participant.breakoutRoomId === currentBreakoutRoomId)
);

export const selectAllOnlineParticipantsByJoinedTime = createSelector(
  [selectAllOnlineParticipantsInConference, selectCurrentBreakoutRoomId],
  (participants, currentBreakoutRoomId) =>
    participants
      .filter((participant) => participant.breakoutRoomId === currentBreakoutRoomId)
      .sort((a, b) => a.joinedAt.localeCompare(b.joinedAt))
);

export const selectSlicedParticipants = (page: number, maxParticipants: number) =>
  createSelector(selectAllOnlineParticipantsByJoinedTime, (participants) => {
    const maxPage = Math.ceil(participants.length / maxParticipants);
    if (maxPage === page) {
      return participants.slice(-maxParticipants);
    }
    return participants.slice((page - 1) * maxParticipants, maxParticipants * page);
  });

export const selectParticipantById = (id: EntityId) => (state: RootState) => participantSelectors.selectById(state, id);
export const selectParticipantsIds = (state: RootState) => participantSelectors.selectIds(state);
export const selectParticipants = (state: RootState) => participantSelectors.selectEntities(state);
export const selectParticipantsTotal = createSelector(
  selectAllOnlineParticipants,
  (participants) => participants.length + 1
);

export const selectParticipantAvatarUrl = (id: EntityId) => (state: RootState) =>
  participantSelectors.selectById(state, id)?.avatarUrl;

export const selectParticipantName = (id: EntityId) => (state: RootState) =>
  participantSelectors.selectById(state, id)?.displayName;

export const selectParticipationKind = (id: EntityId) => (state: RootState) =>
  participantSelectors.selectById(state, id)?.participationKind;

export default participantsSlice.reducer;
