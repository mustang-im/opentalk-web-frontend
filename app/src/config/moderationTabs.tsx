// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import {
  AddUserIcon,
  BreakroomsIcon,
  HomeIcon,
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
} from '@opentalk/common';
import React, { Suspense } from 'react';
import { v4 as uuidv4 } from 'uuid';

import { TimerStyle } from '../api/types/outgoing/timer';
import SuspenseLoading from '../commonComponents/SuspenseLoading';
import { FeaturesKeys } from '../store/slices/configSlice';

const MenuTabs = React.lazy(() => import('../components/MenuTabs'));
const BreakoutRoomTab = React.lazy(() => import('../components/BreakoutRoomTab'));
const LegalVote = React.lazy(() => import('@opentalk/components'));
const PollTab = React.lazy(() => import('../components/PollTab'));
const MuteParticipantsTab = React.lazy(() => import('../components/MuteParticipants'));
const ProtocolTab = React.lazy(() => import('../components/ProtocolTab'));
const ResetHandraisesTab = React.lazy(() => import('../components/ResetHandraisesTab'));
const TimerTab = React.lazy(() => import('../components/TimerTab'));
const WhiteboardTab = React.lazy(() => import('../components/WhiteboardTab'));

export interface Tab {
  icon?: React.ReactElement;
  divider: boolean;
  component?: React.ReactNode;
  tooltipTranslationKey?: string;
  featureKey?: FeaturesKeys;
  key: string;
  disabled?: boolean;
}

export const tabs: Array<Tab> = [
  {
    icon: <HomeIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <MenuTabs />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-home-tooltip',
    featureKey: FeaturesKeys.Home,
    key: FeaturesKeys.Home,
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
    key: FeaturesKeys.MuteUsers,
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
    key: FeaturesKeys.ResetHandraises,
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
    featureKey: FeaturesKeys.BreakoutRooms,
    key: FeaturesKeys.BreakoutRooms,
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
    featureKey: FeaturesKeys.Whiteboard,
    key: FeaturesKeys.Whiteboard,
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
    featureKey: FeaturesKeys.Poll,
    key: FeaturesKeys.Poll,
  },
  {
    icon: <LegalBallotIcon />,
    divider: false,
    component: (
      <Suspense fallback={<SuspenseLoading />}>
        <LegalVote />
      </Suspense>
    ),
    tooltipTranslationKey: 'moderationbar-button-ballot-tooltip',
    featureKey: FeaturesKeys.Vote,
    key: FeaturesKeys.Vote,
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
    featureKey: FeaturesKeys.Timer,
    key: FeaturesKeys.Timer,
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
    featureKey: FeaturesKeys.CoffeeBreak,
    key: FeaturesKeys.CoffeeBreak,
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
    featureKey: FeaturesKeys.Protocol,
    key: FeaturesKeys.Protocol,
  },
  {
    icon: <AddUserIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Add User</Typography>,
    tooltipTranslationKey: 'moderationbar-button-add-user-tooltip',
    featureKey: FeaturesKeys.AddUser,
    key: FeaturesKeys.AddUser,
  },
  {
    icon: <WoolBallIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Wollknaul</Typography>,
    tooltipTranslationKey: 'moderationbar-button-wollknaul-tooltip',
    featureKey: FeaturesKeys.TalkingStick,
    key: FeaturesKeys.TalkingStick,
  },
  {
    icon: <SpeakerQueueIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Speaker Queue</Typography>,
    tooltipTranslationKey: 'moderationbar-button-speaker-queue-tooltip',
    featureKey: FeaturesKeys.AutoModeration,
    key: FeaturesKeys.AutoModeration,
  },
  {
    icon: <WheelOfNamesIcon />,
    divider: false,
    component: <Typography variant={'body2'}>Wheel Of Names</Typography>,
    tooltipTranslationKey: 'moderationbar-button-wheel-tooltip',
    featureKey: FeaturesKeys.WheelOfNames,
    key: FeaturesKeys.WheelOfNames,
  },
];
