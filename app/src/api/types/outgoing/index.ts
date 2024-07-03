// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import * as automod from './automod';
import AutomodMessage from './automod';
import * as breakout from './breakout';
import BreakoutMessage from './breakout';
import * as chat from './chat';
import ChatMessage from './chat';
import * as control from './control';
import ControlMessage from './control';
import * as legalVote from './legalVote';
import LegalVoteMessage from './legalVote';
import * as media from './media';
import MediaMessage from './media';
import * as moderation from './moderation';
import ModerationMessage from './moderation';
import * as poll from './poll';
import PollMessage from './poll';
import * as protocol from './protocol';
import ProtocolMessage from './protocol';
import * as recording from './streaming';
import RecordingMessage from './streaming';
import * as timer from './timer';
import TimerMessage from './timer';
import * as whiteboard from './whiteboard';
import WhiteboardMessage from './whiteboard';

export * as automod from './automod';
export * as legalVote from './legalVote';
export * as breakout from './breakout';
export * as control from './control';
export * as moderation from './moderation';
export * as chat from './chat';
export * as poll from './poll';
export * as media from './media';
export * as protocol from './protocol';
export * as timer from './timer';
export * as whiteboard from './whiteboard';
export * as recording from './streaming';

export type Action =
  | automod.Action
  | breakout.Action
  | chat.Action
  | control.Action
  | moderation.Action
  | legalVote.Action
  | media.Action
  | poll.Action
  | protocol.Action
  | timer.Action
  | whiteboard.Action
  | recording.Action;

export type Message =
  | AutomodMessage
  | BreakoutMessage
  | ChatMessage
  | ControlMessage
  | ModerationMessage
  | LegalVoteMessage
  | MediaMessage
  | PollMessage
  | ProtocolMessage
  | TimerMessage
  | WhiteboardMessage
  | RecordingMessage;
