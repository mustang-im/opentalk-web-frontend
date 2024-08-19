// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Namespaces } from '@opentalk/rest-api-rtk-query';

import { ProtocolState } from './protocol';
import { TimerState } from './timer';

export type ParticipantId = string & { readonly __tag: unique symbol };
export type GroupId = string & { readonly __tag: unique symbol };
export type TargetId = GroupId | ParticipantId;

export type Timestamp = string & { readonly __tag: unique symbol };

export type FetchRequestError = {
  status: number;
  statusText: string;
};

export type FetchRequestState = {
  error?: FetchRequestError;
  loading: boolean;
};

export enum MediaSessionType {
  Screen = 'screen',
  Video = 'video',
}

export enum VideoSetting {
  Off = -1,
  Low = 0,
  Medium = 1,
  High = 2,
}

export enum ParticipationKind {
  User = 'user',
  Guest = 'guest',
  Sip = 'sip',
}

export interface MediaSessionState {
  audio: boolean;
  video: boolean;
  videoSettings: VideoSetting;
}

export interface PresenterRoleState {
  isPresenter: boolean;
}

export interface SpeakingState {
  isSpeaking: boolean;
  updatedAt: string;
}

export interface Speaker extends SpeakingState {
  participant: ParticipantId;
}

export interface TrickleCandidate {
  sdpMid: string;
  sdpMLineIndex: number;
  candidate: string;
}

export interface Namespaced<P = void, T extends string = Namespaces> {
  namespace: T;
  payload: P;
}
export interface NamespacedIncoming<P = void, T extends string = Namespaces> extends Namespaced<P, T> {
  timestamp: Timestamp;
}

export interface IParticipantControl {
  displayName: string;
  avatarUrl?: string;
  handIsUp: boolean;
  joinedAt: string;
  leftAt: string | null;
  handUpdatedAt: string;
  participationKind: ParticipationKind;
  role?: Role;
  isRoomOwner: boolean;
}
export enum ForceMuteType {
  Enabled = 'enabled',
  Disabled = 'disabled',
}
export interface ForceMute {
  type: ForceMuteType;
  allowList: Array<ParticipantId>;
}

export type ParticipantMediaState = PresenterRoleState & {
  screen?: MediaSessionState;
  video?: MediaSessionState;
  speakers?: Speaker[];
  forceMute: ForceMute;
};

type TimerIsReady = Pick<TimerState, 'readyStatus'>;

export interface BackendParticipant {
  id: ParticipantId;
  // Core fields are present in any case
  control: IParticipantControl;
  protocol?: ProtocolState;
  media: ParticipantMediaState;
  timer?: TimerIsReady;
}

export interface ErrorStruct<E extends string> {
  message: 'error';
  error: E;
}

export interface Command {
  action: string;
}

export enum Role {
  Guest = 'guest',
  User = 'user',
  Moderator = 'moderator',
}

export enum WaitingState {
  Joined = 'joined',
  Waiting = 'waiting',
  Approved = 'approved',
}

export type LibravatarDefaultImage = '404' | 'mm' | 'monsterid' | 'wavatar' | 'retro' | 'robohash' | 'pagan';

export enum RoomMode {
  CoffeeBreak = 'coffee-break',
  TalkingStick = 'talking-stick',
}

export enum KickScope {
  All = 'all',
  Guests = 'guests',
  UsersAndGuests = 'users_and_guests',
}
