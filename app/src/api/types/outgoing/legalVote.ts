// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AnyAction } from '@reduxjs/toolkit';
import { RootStateOrAny } from 'react-redux';

import {
  VoteOption,
  LegalVoteId,
  Namespaced,
  MiddlewareMapBuilder,
  ParticipantId,
  createModule,
  createSignalingApiCall,
} from '../../../types';
import { sendMessage } from '../../index';

export enum LegalVoteKind {
  /**
   * It's visible afterwards who voted what
   */
  RollCall = 'roll_call',
  /**
   * You can see in real time who voted what
   */
  LiveRollCall = 'live_roll_call',
  /**
   * You can't see who voted what
   */
  Pseudonymous = 'pseudonymous',
}

export interface VoteStartOutgoing {
  name: string;
  /**
   * The topic that will be voted on
   */
  topic: string;
  /**
   * List of participants that are allowed to cast a vote
   */
  allowedParticipants: Array<ParticipantId>;
  /**
   * Indicates that the `Abstain` vote option is enabled
   */
  enableAbstain: boolean;
  /**
   * The vote will automatically stop when every participant voted
   */
  autoClose: boolean;
  /**
   * The vote will stop when the duration (in second) has passed
   */
  duration: number | null;
  subtitle: string;
  action: 'start';
  timezone: string;
  createPdf: boolean;
  kind: LegalVoteKind;
}

export interface VoteStopOutgoing {
  action: 'stop';
  legalVoteId: LegalVoteId;
  timezone: string;
}

export interface VoteCancelOutgoing {
  action: 'cancel';
  legalVoteId: LegalVoteId;
  reason: string;
  timezone: string;
}

export interface VoteOutgoing {
  action: 'vote';
  legalVoteId: LegalVoteId;
  option: VoteOption;
  token: string;
  timezone: string;
}

export enum ReportIssueKind {
  Screenshare = 'screenshare',
  Audio = 'audio',
  Video = 'video',
  Other = 'other',
}

export interface VoteReportIssueOutgoing {
  action: 'report_issue';
  legal_vote_id: LegalVoteId;
  kind?: ReportIssueKind;
  description?: string;
}

export type Action = VoteStartOutgoing | VoteStopOutgoing | VoteCancelOutgoing | VoteOutgoing | VoteReportIssueOutgoing;
export type LegalVote = Namespaced<Action, 'legal_vote'>;

export const start = createSignalingApiCall<VoteStartOutgoing>('legal_vote', 'start');
export const stop = createSignalingApiCall<VoteStopOutgoing>('legal_vote', 'stop');
export const cancel = createSignalingApiCall<VoteCancelOutgoing>('legal_vote', 'cancel');
export const vote = createSignalingApiCall<VoteOutgoing>('legal_vote', 'vote');
export const reportIssue = createSignalingApiCall<VoteReportIssueOutgoing>('legal_vote', 'report_issue');

export const handler = createModule((builder: MiddlewareMapBuilder<RootStateOrAny>) => {
  builder.addCase(start.action, (_state, action: AnyAction) => {
    sendMessage(start(action.payload));
  });
  builder.addCase(stop.action, (_state, action: AnyAction) => {
    sendMessage(stop(action.payload));
  });
  builder.addCase(cancel.action, (_state, action: AnyAction) => {
    sendMessage(cancel(action.payload));
  });
  builder.addCase(vote.action, (_state, action: AnyAction) => {
    sendMessage(vote(action.payload));
  });
  builder.addCase(reportIssue.action, (_state, action: AnyAction) => {
    sendMessage(reportIssue(action.payload));
  });
});

export default LegalVote;
