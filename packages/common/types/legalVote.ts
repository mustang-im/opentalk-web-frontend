// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { EntityState } from '@reduxjs/toolkit';
import { LegalVoteId, ParticipantId } from './common';


export interface VoteParameters {
  /// The name of the vote
  name: string;
  /// The topic that will be voted on
  topic: string;
  /// List of participants that are allowed to cast a vote
  allowedParticipants: Array<ParticipantId>;
  /// Indicates that the `Abstain` vote option is enabled
  enableAbstain: boolean;
  /// The vote will automatically stop when every participant voted
  autoClose: boolean;
  /// The vote will stop when the duration (in second) has passed
  duration: number | null;
  /// The subtitle of the vote
  subtitle: string;
  /// Annonymous voting mode
  hidden: boolean;
  ///
  createPdf: boolean;
  ///
  token?: string;
  ///
  timezone: string;
}

export enum VoteCancelReasonType {
  InitiatorLeft = 'initiator_left',
  RoomDestroyed = 'room_destroyed',
  Custom = 'custom',
}

export type VoteOption = 'yes' | 'no' | 'abstain';

export interface LegalVoteFormValues {
  id?: number;
  duration: number | string;
  enableAbstain: boolean;
  autoClose: boolean;
  name: string;
  topic: string;
  subtitle?: string;
  createPdf: boolean;
  kind: 'roll_call' | 'live_roll_call' | 'pseudonymous';
}

export interface LegalVoteType {
  id: LegalVoteId;
  startTime: string;
  localStartTime: string;
  localStopTime?: string;
  state: 'active' | 'finished' | 'canceled';

  name: string;
  /// The topic that will be voted on
  topic: string;
  /// List of participants that are allowed to cast a vote
  allowedParticipants: Array<ParticipantId>;
  /// Indicates that the `Abstain` vote option is enabled
  enableAbstain: boolean;
  /// The vote will automatically stop when every participant voted
  autoClose: boolean;
  /// The vote will stop when the duration (in minutes) has passed
  duration: number | null;
  /// The subtitle of the vote
  subtitle?: string;

  votes: Record<VoteOption, number>;
  votingRecord?: Record<ParticipantId, VoteOption>;

  cancelReason?: VoteCancelReasonType;
  customCancelReason?: string;

  votedAt: string | null;
  createPdf: boolean;
  kind: 'roll_call' | 'live_roll_call' | 'pseudonymous';
  token?: string;
  selectedOption?: VoteOption;
}

export interface LegalState {
  activeVote?: LegalVoteId;
  currentShownVote?: LegalVoteId;
  votes: EntityState<LegalVoteType>;
  // tmp value until we get ux designs
  showResultWindow: boolean;
  savedLegalVotes: LegalVoteFormValues[];
}
