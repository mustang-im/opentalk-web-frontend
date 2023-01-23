// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { GroupId, NamespacedIncoming, ParticipantId, Timestamp } from '@opentalk/common';

import ChatScope from '../../../enums/ChatScope';

interface ChatMessageBase {
  id: string;
  source: ParticipantId;
  content: string;
}

interface BaseMessageWithTimestamp extends ChatMessageBase {
  timestamp: Timestamp;
}

interface ChatBase extends ChatMessageBase {
  scope: ChatScope.Private | ChatScope.Global | ChatScope.Group;
  target?: ParticipantId | GroupId;
}

type ChatMessageWithTimestamp = ChatBase & BaseMessageWithTimestamp;

interface MessageSent extends ChatBase {
  message: 'message_sent';
}

interface ChatEnabled {
  message: 'chat_enabled';
  id: ParticipantId;
}

interface ChatDisabled {
  message: 'chat_disabled';
  id: ParticipantId;
}

export interface InitialChat {
  enabled: boolean;
  roomHistory: Array<ChatMessageWithTimestamp>;
  groups: Array<GroupId>;
  groupsHistory: InitialChatHistory;
}

export type InitialChatHistory = [{ history: Array<BaseMessageWithTimestamp>; name: GroupId }];

export interface ClearGlobalChat {
  message: 'history_cleared';
}

export type ChatMessage = MessageSent | ChatEnabled | ChatDisabled | ClearGlobalChat;

export type Chat = NamespacedIncoming<ChatMessage, 'chat'>;

export default Chat;
