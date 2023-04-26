// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MilliSeconds } from '../utils';
import { ParticipantId } from './common';

export enum AutomodSelectionStrategy {
  None = 'none',
  Playlist = 'playlist',
  Random = 'random',
  Nomination = 'nomination',
}
export interface AutomodStartConfig {
  // Depending on the `selection_strategy` this will prevent participants to become
  // speaker twice in a single automod session
  allowDoubleSelection: boolean;
  /// The frontend will play an animation when a random selection
  /// is being made
  animationOnRandom: boolean;
  /// If a raised hand should add a participant into `list`
  considerHandRaise: boolean;
  ///
  history: Array<ParticipantId>;
  ///
  remaining?: Array<ParticipantId>;
  /// The strategy used to determine the next speaker
  selectionStrategy: AutomodSelectionStrategy;
  /// Is `list` visible to the frontend
  showList: boolean;
  /// Time limit in milliseconds each speaker has before its speaking status gets revoked
  timeLimit?: MilliSeconds;
  // Id of the moderator that started the automod
  issuedBy: ParticipantId;
}
export interface InitialAutomod {
  config: AutomodStartConfig;
  speaker: ParticipantId | null;
}

export interface AutomodParameter {
  // The strategy used to determine the next speaker
  selectionStrategy: AutomodSelectionStrategy;
  // Is `list` visible to the frontend
  showList: boolean;
  // If a raised hand should add a participant into `list`
  considerHandRaise: boolean;
  // Time limit in milliseconds each speaker has before its speaking status gets revoked
  timeLimit?: MilliSeconds;
  // Depending on the `selection_strategy` this will prevent participants to become
  // speaker twice in a single automod session
  allowDoubleSelection: boolean;
  /// The frontend will play an animation when a random selection
  /// is being made
  animationOnRandom: boolean;
}