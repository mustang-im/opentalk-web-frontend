// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule, Namespaced, ParticipantId, GroupId } from '@opentalk/common';

import ChatScope from '../../../enums/ChatScope';
import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';
import { sendMessage } from '../../index';

interface ChatActionBase {
  content: string;
}
interface SendMessage extends ChatActionBase {
  action: 'send_message';
  target?: ParticipantId | GroupId;
  scope: ChatScope;
}
interface EnableChat {
  action: 'enable_chat';
}

interface DisableChat {
  action: 'disable_chat';
}

export interface ClearGlobalMessages {
  action: 'clear_history';
}

export type Action = SendMessage | EnableChat | DisableChat;

export type Chat = Namespaced<Action, 'chat'>;

export const sendChatMessage = createSignalingApiCall<SendMessage>('chat', 'send_message');
export const enableChat = createSignalingApiCall<EnableChat>('chat', 'enable_chat');
export const disableChat = createSignalingApiCall<DisableChat>('chat', 'disable_chat');

export const clearGlobalChatMessages = createSignalingApiCall<ClearGlobalMessages>('chat', 'clear_history');

export const handler = createModule<RootState>((builder) => {
  builder
    .addCase(sendChatMessage.action, (_state, action) => {
      sendMessage(sendChatMessage(action.payload));
    })
    .addCase(enableChat.action, () => {
      sendMessage(enableChat());
    })
    .addCase(disableChat.action, () => {
      sendMessage(disableChat());
    })
    .addCase(clearGlobalChatMessages.action, () => {
      sendMessage(clearGlobalChatMessages());
    });
});

export default Chat;
