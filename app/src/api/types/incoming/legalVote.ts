// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  VoteOption,
  VoteParameters,
  VoteCancelReasonType,
  ErrorStruct,
  LegalVoteId,
  NamespacedIncoming,
  ParticipantId,
} from '../../../types';

export interface VoteStarted extends VoteParameters {
  message: 'started';
  legalVoteId: LegalVoteId;
  initiatorId: ParticipantId;
  startTime: string;
  kind: 'roll_call' | 'live_roll_call' | 'pseudonymous';
  maxVotes: number;
}

enum VotedFailedReason {
  InvalidVoteId = 'invalid_vote_id',
  Ineligible = 'ineligible',
  InvalidOption = 'invalid_option',
}

interface BaseVoteResponse {
  message: 'voted';
  legalVoteId: LegalVoteId;
}

export interface VoteSuccessType extends BaseVoteResponse {
  response: 'success';
  voteOption: VoteOption;
  issuer: ParticipantId;
}

export interface VoteFailedType extends BaseVoteResponse {
  response: 'failed';
  reason: VotedFailedReason;
}

export type VotedType = VoteSuccessType | VoteFailedType;

export interface VoteResultsType {
  yes: number;
  no: number;
  abstain?: number;
  votingRecord: Record<ParticipantId, VoteOption>;
}

export interface VoteUpdated extends VoteResultsType {
  message: 'updated';
  legalVoteId: LegalVoteId;
}

enum StopKind {
  ByParticipant = 'by_participant',
  Expired = 'expired',
  Auto = 'auto',
}

enum VoteFinalResults {
  Valid = 'valid',
  Invalid = 'invalid',
}

interface BaseStopped {
  message: 'stopped';
  legalVoteId: LegalVoteId;
  kind: StopKind;
  results: VoteFinalResults;
}

export interface VoteStoppedAuto extends BaseStopped {
  kind: StopKind.Auto;
}

export interface VoteStoppedExpired extends BaseStopped {
  kind: StopKind.Expired;
}

export interface VoteStoppedByParticipant extends BaseStopped {
  kind: StopKind.ByParticipant;
  issuer: ParticipantId;
}

export interface VoteStoppedValid extends BaseStopped, VoteResultsType {
  results: VoteFinalResults.Valid;
}

export enum VoteInvalidReason {
  AbstainDisabled = 'abstain_disabled',
  VoteCountInconsistent = 'vote_count_inconsistent',
}
export interface VoteStoppedInvalid extends BaseStopped {
  results: VoteFinalResults.Invalid;
  reason: VoteInvalidReason;
}

type VoteStoppedKind = VoteStoppedAuto | VoteStoppedExpired | VoteStoppedByParticipant;
type VoteStoppedFinalResults = VoteStoppedInvalid | VoteStoppedValid;
export type VoteStopped = VoteStoppedKind & VoteStoppedFinalResults;

export interface VoteCanceledInitiatorLeft {
  message: 'canceled';
  legalVoteId: LegalVoteId;
  reason: VoteCancelReasonType.InitiatorLeft;
}

export interface CanceledRoomDestroyed {
  message: 'canceled';
  legalVoteId: LegalVoteId;
  reason: VoteCancelReasonType.RoomDestroyed;
}

export interface VoteCanceledCustom {
  message: 'canceled';
  legalVoteId: LegalVoteId;
  reason: VoteCancelReasonType.Custom;
  custom: string;
}

export type VoteCanceled = VoteCanceledInitiatorLeft | CanceledRoomDestroyed | VoteCanceledCustom;

export enum LegalVoteError {
  VoteAlreadyActive = 'vote_already_active',
  NoVoteActive = 'no_vote_active',
  InvalidVoteId = 'invalid_vote_id',
  Ineligible = 'ineligible',
  Internal = 'internal',
}

export interface IncomingPdfAsset {
  message: 'pdf_asset';
  legalVoteId: LegalVoteId;
  filename: string;
  assetId: string;
}

export interface VoteReportedIssue {
  message: 'reported_issue';
  participantId: ParticipantId;
  kind?: 'video' | 'audio' | 'screenshare';
  description?: string;
}

export type LegalVoteMessageType =
  | VoteStarted
  | VoteStopped
  | VotedType
  | VoteUpdated
  | VoteCanceled
  | IncomingPdfAsset
  | VoteReportedIssue
  | ErrorStruct<LegalVoteError>;
type LegalVoteMessage = NamespacedIncoming<LegalVoteMessageType, 'legal_vote'>;

export default LegalVoteMessage;
