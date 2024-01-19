// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  BackendParticipant,
  ChatMessage,
  ParticipantId,
  Participant,
  WaitingState,
  ProtocolAccess,
  ParticipantInOtherRoom,
  joinSuccess,
  Speaker,
} from '@opentalk/common';
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityId,
  PayloadAction,
  createListenerMiddleware,
  TypedStartListening,
} from '@reduxjs/toolkit';

import { RootState, AppDispatch } from '../';
import { selectCurrentBreakoutRoomId } from './breakoutSlice';
import { received } from './chatSlice';
import { connectionClosed } from './roomSlice';
import { setFocusedSpeaker } from './uiSlice';

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
            protocolAccess,
            isPresenter,
            isSpeaking,
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
        protocolAccess,
        isPresenter,
        isSpeaking,
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
        protocolAccess: ProtocolAccess.None,
        isPresenter: false,
        isSpeaking: false,
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
        protocolAccess: ProtocolAccess.None,
        isPresenter: false,
        waitingState: WaitingState.Waiting,
        isSpeaking: false,
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
    approvedAll: (state) => {
      const participantSelectors = participantAdapter.getSelectors();
      const participants = participantSelectors.selectAll(state);
      participants.forEach((participant) => {
        if (participant.waitingState === WaitingState.Waiting) {
          participantAdapter.updateOne(state, {
            id: participant.id,
            changes: { waitingState: WaitingState.Approved },
          });
        }
      });
    },
    update: (
      state,
      {
        payload: {
          id,
          displayName,
          handIsUp,
          lastActive,
          joinedAt,
          leftAt,
          handUpdatedAt,
          role,
          isPresenter,
          protocolAccess,
        },
      }: PayloadAction<Omit<Participant, 'breakoutRoomId' | 'groups' | 'isSpeaking'>>
    ) => {
      participantAdapter.updateOne(state, {
        id,
        changes: {
          displayName,
          handIsUp,
          lastActive,
          joinedAt,
          leftAt,
          handUpdatedAt,
          isPresenter,
          role,
          protocolAccess,
        },
      });
    },
    updatedSpeaker: (state, { payload }: PayloadAction<Speaker>) => {
      const { participant, isSpeaking, updatedAt } = payload;
      participantAdapter.updateOne(state, {
        id: participant,
        changes: {
          isSpeaking,
          lastActive: updatedAt,
        },
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { participants } }) => {
      participantAdapter.setAll(state, participants);
    });
    builder.addCase(connectionClosed, () => participantAdapter.getInitialState());

    builder.addCase(received, (state, { payload }: PayloadAction<ChatMessage>) => {
      participantAdapter.updateOne(state, {
        id: payload.source,
        changes: { lastActive: payload.timestamp },
      });
    });
  },
});

export const {
  join,
  leave,
  update,
  breakoutJoined,
  breakoutLeft,
  waitingRoomJoined,
  waitingRoomLeft,
  approveToEnter,
  approvedAll,
  updatedSpeaker,
} = participantsSlice.actions;
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
  participants.filter((participant) => participant.waitingState === WaitingState.Waiting)
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

export const selectParticipants = (state: RootState) => participantSelectors.selectEntities(state);
export const selectParticipantsTotal = createSelector(
  selectAllOnlineParticipants,
  (participants) => participants.length + 1
);

export const selectParticipantAvatarUrl = (id: EntityId) => {
  const sel = selectParticipantById(id);
  return createSelector(sel, (participant) => participant?.avatarUrl);
};

export const selectParticipantName = (id: EntityId) => {
  const sel = selectParticipantById(id);
  return createSelector(sel, (participant) => participant?.displayName);
};

export const selectParticipationKind = (id: EntityId) => {
  const sel = selectParticipantById(id);
  return createSelector(sel, (participant) => participant?.participationKind);
};

export const selectIsParticipantSpeaking = (id: EntityId) => {
  return createSelector(selectParticipantById(id), (participant) => participant?.isSpeaking);
};

export const participantsMiddleware = createListenerMiddleware();
type AppStartListening = TypedStartListening<RootState, AppDispatch>;

const startAppListening = participantsMiddleware.startListening as AppStartListening;
startAppListening({
  actionCreator: updatedSpeaker,
  effect: (action, listenerApi) => {
    const ourId = listenerApi.getState().user.uuid;
    const speakerId = action.payload.participant;
    const isSpeaking = action.payload.isSpeaking;
    if (isSpeaking && speakerId !== ourId) {
      listenerApi.dispatch(setFocusedSpeaker(speakerId));
    }
  },
});

export default participantsSlice.reducer;
