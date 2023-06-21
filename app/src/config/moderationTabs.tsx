// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import {
  AddUserIcon,
  BreakroomsIcon,
  LegalBallotIcon,
  MuteAllIcon,
  PollIcon,
  SpeakerQueueIcon,
  TimerIcon,
  WheelOfNamesIcon,
  WoolBallIcon,
  WhiteboardIcon,
  RaiseHandOffIcon,
  ProtocolIcon,
  CoffeeBreakIcon,
  DebriefingIcon,
  TalkingStickIcon,
  BackendModules,
  RoomMode,
  TimerStyle,
} from '@opentalk/common';
import React, { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

import SuspenseLoading from '../commonComponents/SuspenseLoading';
import DebriefingTab from '../components/DebriefingTab';
import HomeIconComponent from '../components/HomeIconComponent';
import { useAppSelector } from '../hooks';
import { FeaturesKeys } from '../store/slices/configSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';

const MenuTabs = React.lazy(() => import('../components/MenuTabs'));
const BreakoutRoomTab = React.lazy(() => import('../components/BreakoutRoomTab'));
const LegalVote = React.lazy(() =>
  import('@opentalk/components').then((module) => ({ default: module.LegalVoteComponent }))
);
const TalkingStickTabPanel = React.lazy(() =>
  import('@opentalk/components').then((module) => ({ default: module.TalkingStickTabPanel }))
);
const PollTab = React.lazy(() => import('../components/PollTab'));
const MuteParticipantsTab = React.lazy(() => import('../components/MuteParticipants'));
const ProtocolTab = React.lazy(() => import('../components/ProtocolTab'));
const ResetHandraisesTab = React.lazy(() => import('../components/ResetHandraisesTab'));
const TimerTab = React.lazy(() => import('../components/TimerTab'));
const WhiteboardTab = React.lazy(() => import('../components/WhiteboardTab'));

export enum ModerationTabKeys {
  Home = 'tab-home',
  MuteUsers = 'tab-mute-users',
  ResetHandraises = 'tab-reset-handraises',
  Breakout = 'tab-breakout-rooms',
  Whiteboard = 'tab-whiteboard',
  Polls = 'tab-polls',
  LegalVote = 'tab-voting',
  Timer = 'tab-timer',
  CoffeeBreak = 'tab-coffee-break',
  Protocol = 'tab-protocol',
  AddUser = 'tab-add-user',
  TalkingStick = 'tab-talking-stick',
}

export interface Tab {
  icon?: React.ReactElement;
  divider: boolean;
  component?: React.ReactNode;
  tooltipTranslationKey?: string;
  featureKey?: FeaturesKeys;
  moduleKey?: BackendModules;
  static?: boolean;
  key: string;
  disabled?: boolean;
  titleKey?: string;
}

export const currentRoomMode = (): RoomMode | undefined => {
  return useAppSelector(selectCurrentRoomMode);
};

export const tabs: Array<Tab> = [
  {
    icon: <HomeIconComponent />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <MenuTabs />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-home-tooltip',
    featureKey: FeaturesKeys.Home,
    key: ModerationTabKeys.Home,
  },
  {
    icon: <MuteAllIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <MuteParticipantsTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-mute-tooltip',
    featureKey: FeaturesKeys.MuteUsers,
    key: ModerationTabKeys.MuteUsers,
    titleKey: 'mute-participants-tab-title',
  },
  {
    icon: <RaiseHandOffIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <ResetHandraisesTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-reset-handraises-tooltip',
    featureKey: FeaturesKeys.ResetHandraises,
    key: ModerationTabKeys.ResetHandraises,
    titleKey: 'reset-handraises-tab-title',
  },
  {
    icon: <DebriefingIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <DebriefingTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-debriefing',
    featureKey: FeaturesKeys.Debriefing,
    key: FeaturesKeys.Debriefing,
    titleKey: 'debriefing-tab-title',
  },
  {
    divider: true,
    key: uuidv4(),
  },
  {
    icon: <BreakroomsIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <BreakoutRoomTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-breakout-tooltip',
    moduleKey: BackendModules.Breakout,
    key: ModerationTabKeys.Breakout,
    titleKey: 'breakout-room-tab-title',
  },
  {
    icon: <WhiteboardIcon />,
    divider: false,
    tooltipTranslationKey: 'moderationbar-button-whiteboard-tooltip',
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <WhiteboardTab />
      </Suspense>
    ),
    moduleKey: BackendModules.Whiteboard,
    key: ModerationTabKeys.Whiteboard,
    titleKey: 'whiteboard-tab-title',
  },
  {
    icon: <PollIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <PollTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-poll-tooltip',
    moduleKey: BackendModules.Polls,
    key: ModerationTabKeys.Polls,
    titleKey: 'poll-tab-title',
  },
  {
    icon: <LegalBallotIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <LegalVote currentRoomMode={currentRoomMode} />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-ballot-tooltip',
    moduleKey: BackendModules.LegalVote,
    key: ModerationTabKeys.LegalVote,
    titleKey: 'legal-vote-tab-title',
  },
  {
    icon: <TalkingStickIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <TalkingStickTabPanel />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-talking-stick-tooltip',
    moduleKey: BackendModules.Automod,
    key: ModerationTabKeys.TalkingStick,
    titleKey: 'talking-stick-tab-title',
  },
  {
    icon: <TimerIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <TimerTab timerStyle={TimerStyle.Normal} />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-timer-tooltip',
    moduleKey: BackendModules.Timer,
    key: ModerationTabKeys.Timer,
    titleKey: 'timer-tab-title',
  },
  {
    icon: <CoffeeBreakIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <TimerTab timerStyle={TimerStyle.CoffeeBreak} />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-coffee-break-tooltip',
    moduleKey: BackendModules.Timer,
    key: ModerationTabKeys.CoffeeBreak,
    titleKey: 'coffee-break-tab-title',
  },
  {
    icon: <ProtocolIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <ProtocolTab />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-protocol-tooltip',
    moduleKey: BackendModules.Protocol,
    key: ModerationTabKeys.Protocol,
    titleKey: 'protocol-tab-title',
  },
  {
    icon: <AddUserIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Add User</Typography>,
    tooltipTranslationKey: 'moderationbar-button-add-user-tooltip',
    featureKey: FeaturesKeys.AddUser,
    key: ModerationTabKeys.AddUser,
  },
  {
    icon: <WoolBallIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Wollknaul</Typography>,
    tooltipTranslationKey: 'moderationbar-button-wollknaul-tooltip',
    key: 'Wollknaul',
  },
  {
    icon: <SpeakerQueueIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Speaker Queue</Typography>,
    tooltipTranslationKey: 'moderationbar-button-speaker-queue-tooltip',
    key: 'Speaker Queue',
  },
  {
    icon: <WheelOfNamesIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Wheel Of Names</Typography>,
    tooltipTranslationKey: 'moderationbar-button-wheel-tooltip',
    key: 'Wheel Of Names',
  },
];
