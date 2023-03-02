// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { GroupId, ParticipationKind, TargetId } from '@opentalk/common';
import { createSelector } from '@reduxjs/toolkit';
import i18next, { t } from 'i18next';
import _, { intersection } from 'lodash';

import ChatScope from '../enums/ChatScope';
import SortOption from '../enums/SortOption';
import { selectCurrentBreakoutRoomId } from './slices/breakoutSlice';
import {
  selectChatMessages,
  ChatMessage as ChatMessageType,
  selectAllChatMessages,
  selectLastSeenTimestamps,
  selectLastSeenTimestampGlobal,
  TimestampState,
  ChatMessage,
} from './slices/chatSlice';
import { selectGlobalEvents, RoomEvent } from './slices/eventSlice';
import { selectFocusedSpeaker } from './slices/mediaSlice';
import { selectUnmutedSubscribers } from './slices/mediaSubscriberSlice';
import { selectHandUp, selectHandUpdatedAt } from './slices/moderationSlice';
import {
  Participant,
  selectAllOnlineParticipants,
  selectAllOnlineParticipantsInConference,
  selectAllParticipants,
} from './slices/participantsSlice';
import { selectParticipantsReady } from './slices/timerSlice';
import {
  selectParticipantsSearchValue,
  selectParticipantsSortOption,
  selectPinnedParticipantId,
} from './slices/uiSlice';
import { selectGroups, selectUserAsPartialParticipant } from './slices/userSlice';

export const selectUserAsParticipant = createSelector(
  selectUserAsPartialParticipant,
  selectCurrentBreakoutRoomId,
  selectHandUp,
  selectHandUpdatedAt,
  (partialParticipant, breakoutRoomId, handIsUp, handUpdatedAt): Participant | undefined => {
    if (partialParticipant === undefined) {
      return undefined;
    }

    return {
      ...partialParticipant,
      handIsUp,
      handUpdatedAt,
      breakoutRoomId,
    };
  }
);

export const selectCombinedParticipantsAndUserInCoference = createSelector(
  selectAllOnlineParticipantsInConference,
  selectUserAsParticipant,
  (participants, user) => (user ? [...participants, user] : participants)
);

export const selectCombinedParticipantsAndUser = createSelector(
  selectAllOnlineParticipants,
  selectUserAsParticipant,
  (participants, user) => (user ? [...participants, user] : participants)
);

export const selectParticipantsWithourGuestAndSip = createSelector(selectCombinedParticipantsAndUser, (participants) =>
  participants.filter(
    (participant) =>
      !(
        participant.participationKind.match(ParticipationKind.Guest) ||
        participant.participationKind.match(ParticipationKind.Sip)
      )
  )
);

export const selectJoinedFirstTimestamp = createSelector(
  selectAllParticipants,
  selectUserAsParticipant,
  (participants, user) =>
    (user ? [...participants, user] : participants)
      .map((participant) => participant.joinedAt)
      .sort((a, b) => a.localeCompare(b))[0]
);

export const selectCombinedParticipantsAndUserCount = createSelector(
  selectCombinedParticipantsAndUser,
  (users) => users.length
);

export const selectCombinedSpeakerId = createSelector(
  selectPinnedParticipantId,
  selectFocusedSpeaker,
  (pinnedParticipantId, focusedSpeakerId) => pinnedParticipantId ?? focusedSpeakerId
);

export const selectAllGroupParticipants = createSelector(
  [selectCombinedParticipantsAndUser, selectGroups],
  (participants, groups) => {
    const NO_GROUP_ID = t('no-group-participants-label') as GroupId;
    const groupDictionary = new Map<GroupId, Array<Participant>>();

    groupDictionary.set(NO_GROUP_ID, []);
    groups.forEach((group) => {
      groupDictionary.set(group, []);
    });

    participants.forEach((participant) => {
      const groups = participant.groups;
      if (intersection(groups, [...groupDictionary.keys()]).length === 0) {
        groupDictionary.get(NO_GROUP_ID)?.push(participant);
        return;
      }

      groups.forEach((group) => {
        groupDictionary.get(group)?.push(participant);
      });
    });

    return groupDictionary;
  }
);

const sortAndFilterParticipants = (participants: Participant[], sortOption: SortOption, searchValue: string) => {
  switch (sortOption) {
    case SortOption.NameASC:
      participants.sort((a, b) =>
        a.displayName.localeCompare(b.displayName, i18next.language, { ignorePunctuation: true })
      );
      break;
    case SortOption.NameDESC:
      participants.sort((a, b) =>
        b.displayName.localeCompare(a.displayName, i18next.language, { ignorePunctuation: true })
      );
      break;
    case SortOption.FirstJoin:
      participants.sort((a, b) => Date.parse(a.joinedAt) - Date.parse(b.joinedAt));
      break;
    case SortOption.LastJoin:
      participants.sort((a, b) => Date.parse(b.joinedAt) - Date.parse(a.joinedAt));
      break;
    case SortOption.RaisedHandFirst:
      participants
        .sort((a, b) => {
          const dateA = a.handUpdatedAt !== undefined ? Date.parse(a.handUpdatedAt) : 0;
          const dateB = b.handUpdatedAt !== undefined ? Date.parse(b.handUpdatedAt) : 0;
          return dateA - dateB;
        })
        .sort((p) => (p.handIsUp ? -1 : 1));
      break;
    case SortOption.LastActive:
      participants.sort((a, b) => Date.parse(b.lastActive) - Date.parse(a.lastActive));
      break;
    default:
      break;
  }

  return participants.filter((participant) =>
    participant.displayName.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase())
  );
};

export const selectAllGroupParticipantsSortedAndFiltered = createSelector(
  [selectAllGroupParticipants, selectParticipantsSortOption, selectParticipantsSearchValue],
  (groups, sortOption, searchValue) => {
    const groupDictionary = new Map<GroupId, Array<Participant>>();
    groups.forEach((participants, groupId) => {
      const sortedAndFilteredParticipants = sortAndFilterParticipants(participants, sortOption, searchValue);
      groupDictionary.set(groupId, sortedAndFilteredParticipants);
    });
    return groupDictionary;
  }
);

export const selectAllParticipantsSortedAndFiltered = createSelector(
  [selectCombinedParticipantsAndUser, selectParticipantsSortOption, selectParticipantsSearchValue],
  (participants, sortOption, searchValue) => sortAndFilterParticipants(participants, sortOption, searchValue)
);

export const selectCombinedMessageAndEvents = (scope: ChatScope, targetId: TargetId | undefined) =>
  createSelector(selectGlobalEvents(scope), selectChatMessages(scope, targetId), (events, messages) => {
    const merged: Array<ChatMessageType | RoomEvent> = (messages as Array<ChatMessageType | RoomEvent>).concat(events);
    return _.sortBy(merged, ['timestamp']);
  });

export const selectAllChatMessagesForScope = (scope: ChatScope) =>
  createSelector(selectAllChatMessages, (allChatMessages) => {
    return;
  });

const filterMessagesByTimestampStates = (messages: ChatMessage[], lastSeenTimestamps: TimestampState[]) => {
  const targetIds = [...new Set(lastSeenTimestamps.map((seenState) => seenState.target as TargetId))];
  const filteredMessages = messages.filter((message) => {
    if (targetIds.includes(message.target as TargetId)) {
      const lastSeen = lastSeenTimestamps
        .filter((seen) => seen.target === message.target)
        .map((entry) => entry.timestamp);
      if (lastSeen.length === 1) {
        if (new Date(message.timestamp).getTime() > new Date(lastSeen[0]).getTime()) {
          return message;
        }
      }
      return;
    }
    return message;
  });
  return filteredMessages.length;
};

export const selectUnreadMessageCount = createSelector(
  selectAllChatMessages,
  selectLastSeenTimestamps,
  selectLastSeenTimestampGlobal,
  (allChatMessages, lastSeenTimestamps, lastSeenTimestampGlobal) => {
    if (allChatMessages.length === 0) {
      return { global: 0, private: 0, group: 0 };
    }

    let unreadGlobalMessages = 0;
    if (lastSeenTimestampGlobal) {
      unreadGlobalMessages = allChatMessages.filter(
        (message) =>
          message.scope === ChatScope.Global &&
          new Date(message.timestamp).getTime() > new Date(lastSeenTimestampGlobal).getTime()
      ).length;
    } else {
      unreadGlobalMessages = allChatMessages.filter((message) => message.scope === ChatScope.Global).length;
    }

    const privateMessages = allChatMessages.filter((message) => message.scope === ChatScope.Private);
    const groupMessages = allChatMessages.filter((message) => message.scope === ChatScope.Group);
    if (lastSeenTimestamps.length > 0) {
      const unreadPrivateMessages = filterMessagesByTimestampStates(privateMessages, lastSeenTimestamps);
      const unreadGroupMessages = filterMessagesByTimestampStates(groupMessages, lastSeenTimestamps);
      return { global: unreadGlobalMessages, private: unreadPrivateMessages, group: unreadGroupMessages };
    }
    return { global: unreadGlobalMessages, private: privateMessages.length, group: groupMessages.length };
  }
);

export const xselectUnreadMessageCount = createSelector(
  selectAllChatMessages,
  selectLastSeenTimestamps,
  selectLastSeenTimestampGlobal,
  (allChatMessages, lastSeenTimestamps, lastSeenTimestampGlobal) => {
    console.log('### %s, %s, %s', allChatMessages.length, lastSeenTimestamps.length, lastSeenTimestampGlobal);
    return 0;
  }
);

export const selectParticipantsReadyList = createSelector(
  selectAllParticipants,
  selectParticipantsReady,
  (selectCombinedParticipantsAndUser, participantsReady) =>
    selectCombinedParticipantsAndUser.map((participant) => ({
      isReady: participantsReady.includes(participant.id),
      ...participant,
    }))
);

export const selectUnmutedParticipants = createSelector(
  selectAllOnlineParticipants,
  selectUnmutedSubscribers,
  (participants, unmutedSubscribers): Participant[] => {
    return participants.filter(({ id }) => unmutedSubscribers.find(({ participantId }) => id === participantId));
  }
);

export const selectVotingUsers = createSelector(selectCombinedParticipantsAndUser, (records) => {
  return records.filter((record) => {
    return record.role === 'user' || record.participationKind === 'user';
  });
});
