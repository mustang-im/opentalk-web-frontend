// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Seconds } from '../utils/tsUtils';

export type PollId = string & { readonly __tag: unique symbol };
export type ChoiceId = number & { readonly __tag: unique symbol };

export interface ChoiceCommon {
  id: ChoiceId;
}

export interface Choice extends ChoiceCommon {
  content: string;
}

export interface ChoiceResult extends ChoiceCommon {
  count: number;
}

export interface InitialPoll {
  id: PollId;
  duration: number;
  live: boolean;
  started: string;
  topic: string;
  choices: Array<Choice>;
  results?: Array<ChoiceResult>;
}

export interface CommonPoll {
  topic: string;
  live: boolean;
  duration: Seconds;
}
