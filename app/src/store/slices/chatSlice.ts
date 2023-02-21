// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { GroupId, ParticipantId, TargetId, Timestamp } from '@opentalk/common';
import {
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  EntityId,
  PayloadAction,
} from '@reduxjs/toolkit';
import { last } from 'lodash';

import { RootState } from '../';
import ChatScope from '../../enums/ChatScope';
import { joinSuccess } from '../commonActions';
import { selectOurUuid } from './userSlice';

const getTargetId = (chatMessage: ChatMessage) => chatMessage.group || chatMessage.target || chatMessage.source;

const reduceMessagesToChats = (chatMessages: ChatMessage[]) =>
  chatMessages.reduce<ChatProps[]>((acc, currentValue) => {
    const index = acc.findIndex((value) => value.id === getTargetId(currentValue));
    if (index !== -1) {
      acc[index].messages.push(currentValue);
      acc[index].lastMessage = currentValue;
    } else {
      acc.push({
        id: getTargetId(currentValue),
        lastMessage: currentValue,
        scope: currentValue.scope,
        messages: [currentValue],
      });
    }
    return acc;
  }, []);

export type ChatMessage = {
  id: string;
  timestamp: string;
  source: ParticipantId;
  content: string;
  scope: ChatScope;
  group?: GroupId;
  target?: ParticipantId | GroupId;
};

export type ChatProps = {
  id: string;
  messages: ChatMessage[];
  scope: ChatScope;
  lastMessage: ChatMessage;
};

const messagesAdapter = createEntityAdapter<ChatMessage>({
  selectId: (message) => `${message.source}@${message.timestamp}`,
  sortComparer: (a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp),
});

interface TimestampState {
  target: string,
  timestamp: string
}

export interface ChatState {
  enabled: boolean;
  settingsChangedAt?: string;
  settingsChangedBy?: ParticipantId;
  messages: EntityState<ChatMessage>;
  lastSeenTimestampGlobal?: string,
  lastSeenTimestampsGroup?: [TimestampState],
  lastSeenTimestampsPrivate?: [TimestampState]
}

const initialState: ChatState = {
  enabled: true,
  messages: messagesAdapter.getInitialState(),
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    received: (state, { payload }: PayloadAction<ChatMessage>) => {
      messagesAdapter.addOne(state.messages, payload);
    },
    addLastSeenTimestamp: (state, { payload: { scope, target, timestamp } }: PayloadAction<{ scope: string, target?: ParticipantId | GroupId, timestamp: string }>) => {
      if (scope === ChatScope.Global) {
        state.lastSeenTimestampGlobal = timestamp;
      }
      if (scope === ChatScope.Private && target) {
        if (!state.lastSeenTimestampsPrivate) {

          state.lastSeenTimestampsPrivate = [{ target: target, timestamp: timestamp }]
        }
      }
    },
    setChatSettings: (
      state,
      {
        payload: { id, timestamp, enabled },
      }: PayloadAction<{ id: ParticipantId; timestamp: Timestamp; enabled: boolean }>
    ) => {
      state.enabled = enabled;
      state.settingsChangedAt = new Date(timestamp).toISOString();
      state.settingsChangedBy = id;
    },
    clearGlobalChat: (state) => {
      const keys = Object.keys(state.messages.entities);
      for (const key of keys) {
        const entity = state.messages.entities[key];
        if (entity?.scope === ChatScope.Global) {
          delete state.messages.entities[key];
        }
      }
      state.messages.ids = Object.keys(state.messages.entities);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(joinSuccess, (state, { payload: { chat } }) => {
      //console.log('### chat slice %s', JSON.stringify(chat, null, "\t"))
      messagesAdapter.setAll(state.messages, chat.roomHistory);
      state.enabled = chat.enabled;
      state.lastSeenTimestampGlobal = chat.lastSeenTimestampGlobal;
      //state.lastSeenTimestampsPrivate = chat.lastSeenTimestampsPrivate ? chat.lastSeenTimestampsPrivate : state.lastSeenTimestampsPrivate;
    });
  },
});


export const { addLastSeenTimestamp, received, setChatSettings, clearGlobalChat } = chatSlice.actions;
export const actions = chatSlice.actions;

export const selectLastSeenTimestampGlobal = (state: RootState) => state.chat.lastSeenTimestampGlobal;
export const selectLastSeenTimestampGroup = (state: RootState) => state.chat.lastSeenTimestampsGroup;
export const selectLastSeenTimestampPrivate = (state: RootState) => state.chat.lastSeenTimestampsPrivate;

export const selectChatEnabledState = (state: RootState) => state.chat.enabled;
const chatMessagesSelectors = messagesAdapter.getSelectors<RootState>((state) => state.chat.messages);

export const selectAllChatMessages = (state: RootState) => chatMessagesSelectors.selectAll(state);
export const selectChatMessagesById = (id: EntityId) => (state: RootState) =>
  chatMessagesSelectors.selectById(state, id);
export const selectChatMessages = (scope: ChatScope, targetId?: TargetId) => (state: RootState) =>
  selectAllChatMessages(state).filter((chatMessage) =>
    scope === ChatScope.Global
      ? chatMessage.scope === scope
      : chatMessage.scope === scope &&
      (chatMessage.group === targetId || chatMessage.target === targetId || chatMessage.source === targetId)
  );
export const selectLastMessageOfGroup = (scope: ChatScope, targetId: TargetId) => (state: RootState) =>
  last(selectChatMessages(scope, targetId)(state));

export const selectAllGlobalChatMessages = createSelector(selectAllChatMessages, (chatMessages) =>
  chatMessages.filter((chatMessage) => chatMessage.scope === ChatScope.Global)
);
export const selectAllGroupChatMessages = createSelector(selectAllChatMessages, (chatMessages) =>
  chatMessages.filter((chatMessage) => chatMessage.scope === ChatScope.Group)
);
export const selectAllPrivateChatMessages = createSelector(selectAllChatMessages, (chatMessages) =>
  chatMessages.filter((chatMessage) => chatMessage.scope === ChatScope.Private)
);
export const selectAllGroupChats = createSelector(selectAllGroupChatMessages, (chatMessages) =>
  reduceMessagesToChats(chatMessages)
);
export const selectAllPrivateChats = createSelector(
  [selectAllPrivateChatMessages, selectOurUuid],
  (chatMessages, userId) => reduceMessagesToChats(chatMessages).filter((value) => value.id !== userId)
);
export const selectAllGroupAndPrivateChats = createSelector(
  [selectAllGroupChats, selectAllPrivateChats],
  (groupChats, privateChats) =>
    groupChats
      .concat(privateChats)
      .sort((a, b) => Date.parse(b.lastMessage.timestamp) - Date.parse(a.lastMessage.timestamp))
);

export default chatSlice.reducer;
