// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { GroupId, ParticipantId, ParticipationKind, Timestamp } from '@opentalk/common';
import { logged_out } from '@opentalk/react-redux-appauth';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '../';
import { Role } from '../../api/types/incoming/control';
import { joinSuccess, login, startRoom } from '../commonActions';
import { setFocusedSpeaker } from './mediaSlice';
import { Participant, ProtocolAccess, WaitingState } from './participantsSlice';
import { setProtocolReadUrl, setProtocolWriteUrl } from './protocolSlice';
import { connectionClosed, fetchRoomByInviteId } from './roomSlice';

interface UserState {
  uuid: ParticipantId | null;
  groups: GroupId[];
  role: Role;
  displayName: string;
  avatarUrl?: string;
  loggedIdToken?: string;
  lastActive?: string;
  joinedAt?: string;
  isPresenter: boolean;
  protocolAccess: ProtocolAccess;
}

const initialState: UserState = {
  uuid: null,
  groups: [],
  displayName: '',
  role: Role.User,
  isPresenter: false,
  protocolAccess: 'none' as ProtocolAccess.None, // this will be fixed with the next version of the ts-jest
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    displayNameSet: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    updateRole: (state, { payload: role }: PayloadAction<Role>) => {
      state.role = role;
    },
    setPresenterRole: (state) => {
      state.isPresenter = true;
    },
    revokePresenterRole: (state) => {
      state.isPresenter = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchRoomByInviteId.fulfilled, (state) => {
      state.role = Role.Guest;
    });
    builder.addCase(
      startRoom.pending,
      (
        state,
        {
          meta: {
            arg: { displayName },
          },
        }
      ) => {
        state.displayName = displayName;
      }
    );
    builder.addCase(joinSuccess, (state, { payload: { isPresenter, avatarUrl, role, participantId, groups } }) => {
      state.role = role;
      state.avatarUrl = avatarUrl;
      state.uuid = participantId;
      state.groups = groups;
      state.joinedAt = new Date().toISOString();
      state.lastActive = state.joinedAt;
      state.isPresenter = isPresenter || false;
    });
    builder.addCase(connectionClosed, (state) => {
      state.uuid = null;
      state.joinedAt = undefined;
    });
    builder.addCase(login.fulfilled, (state, { meta }) => {
      state.loggedIdToken = meta.arg;
    });
    builder.addCase(login.rejected, (state) => {
      state.loggedIdToken = undefined;
    });
    builder.addCase(logged_out, () => initialState);

    builder.addCase(
      setFocusedSpeaker,
      (state, { payload: { id, timestamp } }: PayloadAction<{ id: ParticipantId; timestamp?: Timestamp }>) => {
        if (id === state.uuid) {
          state.lastActive = timestamp;
        }
      }
    );
    builder.addCase(setProtocolReadUrl, (state) => {
      state.protocolAccess = ProtocolAccess.Read;
    });
    builder.addCase(setProtocolWriteUrl, (state) => {
      state.protocolAccess = ProtocolAccess.Write;
    });
  },
});

export const actions = userSlice.actions;
export const { updateRole, setPresenterRole, revokePresenterRole } = actions;

const userState = (state: RootState) => state.user;

export const selectOurUuid = createSelector(userState, (state) => state.uuid);
export const selectGroups = createSelector(userState, (state) => state.groups);
export const selectDisplayName = createSelector(userState, (state) => state.displayName);
export const selectAvatarUrl = createSelector(userState, (state) => state.avatarUrl);
export const selectIsPresenter = createSelector(userState, (state) => state.isPresenter);
export const selectUserProtocolAccess = createSelector(userState, (state) => state.protocolAccess);
export const selectIsLoggedIn = createSelector(userState, (state) => state.loggedIdToken !== undefined);
export const selectIsAuthenticated = createSelector(
  userState,
  (state) => state.loggedIdToken !== undefined || state.role === Role.Guest
);
export const selectIsModerator = createSelector(userState, (state) => state.role === Role.Moderator);

export const selectUserAsPartialParticipant = createSelector(
  userState,
  (state): Omit<Participant, 'breakoutRoomId' | 'handIsUp' | 'handUpdatedAt'> | undefined => {
    const { displayName, avatarUrl, groups, joinedAt, lastActive } = state;

    if (state.uuid === null || joinedAt === undefined || lastActive === undefined) {
      return undefined;
    }

    const participationKind =
      state.role === Role.User || state.role === Role.Moderator ? ParticipationKind.User : ParticipationKind.Guest;

    return {
      id: state.uuid,
      displayName,
      avatarUrl,
      groups,
      joinedAt,
      lastActive,
      leftAt: null,
      participationKind,
      waitingState: WaitingState.Joined,
      protocolAccess: state.protocolAccess,
      isPresenter: state.isPresenter,
    };
  }
);

export default userSlice.reducer;
