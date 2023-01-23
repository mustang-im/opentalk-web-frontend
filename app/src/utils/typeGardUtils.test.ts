// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { GroupId, ParticipantId } from '@opentalk/common';

import ChatScope from '../enums/ChatScope';
import { ChatMessage as ChatMessageType } from '../store/slices/chatSlice';
import { RoomEvent } from '../store/slices/eventSlice';
import { isEventMessage } from './typeGardUtils';

describe('should check if message is event type', () => {
  const chatMessage: ChatMessageType = {
    id: '',
    timestamp: '',
    source: '' as ParticipantId,
    content: '',
    scope: ChatScope.Global,
    group: '' as GroupId,
    target: '' as ParticipantId,
  };

  test('should return false', () => {
    expect(isEventMessage(chatMessage)).toBeFalsy();
  });

  const eventMessage: RoomEvent = {
    id: '',
    timestamp: '',
    target: '' as ParticipantId,
    event: 'joined',
  };

  test('should return true', () => {
    expect(isEventMessage(eventMessage)).toBeTruthy();
  });
});
