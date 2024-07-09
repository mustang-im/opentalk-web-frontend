// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import { HomeIcon, MeetingsIcon, SettingsIcon } from '../../assets/icons';
import DashboardNavigation from './DashboardNavigation';

const routes = [
  {
    icon: <HomeIcon />,
    path: 'dashboard',
    name: 'dashboard-home',
  },
  {
    icon: <MeetingsIcon />,
    path: 'meetings',
    name: 'dashboard-meetings',
  },
  {
    icon: <SettingsIcon />,
    path: 'settings',
    name: 'dashboard-settings',
    childRoutes: [
      {
        path: '',
        name: 'dashboard-settings-general',
      },
      {
        path: 'account',
        name: 'dashboard-settings-account',
      },
      {
        path: 'profile',
        name: 'dashboard-settings-profile',
      },
    ],
  },
];

export default {
  title: 'components/DashboardNavigation',
  component: DashboardNavigation,
} as ComponentMeta<typeof DashboardNavigation>;

export const Basic: ComponentStory<typeof DashboardNavigation> = () => (
  <MemoryRouter initialEntries={['/']}>
    <DashboardNavigation routes={routes} />
  </MemoryRouter>
);
