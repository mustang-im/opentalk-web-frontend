// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import AutomodMessage from './automod';
import BreakoutMessage from './breakout';
import ChatMessage from './chat';
import ControlMessage from './control';
import LegalVoteMessage from './legalVote';
import MediaMessage from './media';
import ModerationMessage from './moderation';
import PollMessage from './poll';
import ProtocolMessage from './protocol';
import SharedFolderMessage from './sharedFolder';
import StreamingMessage from './streaming';
import TimerMessage from './timer';
import WhiteboardMessage from './whiteboard';

export * as breakout from './breakout';
export * as control from './control';
export * as chat from './chat';
export * as moderation from './moderation';
export * as poll from './poll';
export * as protocol from './protocol';
export * as timer from './timer';
export * as whiteboard from './whiteboard';
export * as media from './media';
export * as streaming from './streaming';
export * as sharedFolder from './sharedFolder';
export * as legalVote from './legalVote';
export * as automod from './automod';

export type Message =
  | AutomodMessage
  | BreakoutMessage
  | ChatMessage
  | ControlMessage
  | LegalVoteMessage
  | MediaMessage
  | PollMessage
  | ModerationMessage
  | ProtocolMessage
  | TimerMessage
  | WhiteboardMessage
  | StreamingMessage
  | SharedFolderMessage;
