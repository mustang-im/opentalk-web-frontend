// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ChatMessage } from '@opentalk/common';

import { RoomEvent } from '../store/slices/eventSlice';

export const isEventMessage = (message: ChatMessage | RoomEvent): message is RoomEvent => {
  return (message as RoomEvent).event !== undefined;
};

export const isInvalidDate = (date: Date) => {
  return date instanceof Date && isNaN(date as unknown as number);
};
