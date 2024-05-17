// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Opaque } from 'type-fest';

export enum BackendModules {
  Automod = 'automod',
  Breakout = 'breakout',
  Chat = 'chat',
  Core = 'core',
  Echo = 'echo',
  Integration = 'integration',
  LegalVote = 'legal_vote',
  Media = 'media',
  Moderation = 'moderation',
  Polls = 'polls',
  Protocol = 'protocol',
  Recording = 'recording',
  RecordingService = 'recording_service',
  Timer = 'timer',
  Whiteboard = 'whiteboard',
}

export type Modules = {
  [value in BackendModules]?: { features: Array<string> }
}

/**
 * Union type that contains features from modules. Has to be manually extended for each feature.
 */
export type BackendFeatures = 'stream';

export type TariffId = Opaque<string, 'tariffId'>;

export interface Tariff {
  id: TariffId;
  name: string;
  quotas: Record<string, number>;
  /** @deprecated use modules instead */
  enabledModules: Array<BackendModules>;
  modules: Modules;
}