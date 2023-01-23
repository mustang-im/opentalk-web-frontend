// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { Role } from '../../api/types/incoming/control';
import { tabs } from '../../config/moderationTabs';
import { render, screen, createStore, cleanup } from '../../utils/testUtils';
import MeetingSidebar from './MeetingSidebar';

jest.mock('../Toolbar/fragments/EndCallButton', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="toolbarEndCallButton"></div>,
  };
});

describe('MeetingSidebar', () => {
  afterEach(() => cleanup());
  const { store } = createStore({
    initialState: {
      auth: { isAuthed: true },
      user: { loggedIn: true, role: Role.Moderator },
    },
  });
  const tabsNames = tabs.map((tab) => tab.tooltipTranslationKey).filter((name) => name !== undefined);

  test('render MeetingSidebar component without crashing for user with role of moderator', async () => {
    await render(<MeetingSidebar />, store);

    expect(screen.getByTestId('Toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarHandraiseButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarBlurScreenButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarAudioButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarVideoButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarEndCallButton')).toBeInTheDocument();

    expect(screen.getByRole('tablist')).toBeInTheDocument();
  });

  test('render MeetingSidebar component without crashing for user with role of guest', async () => {
    const { store } = createStore({
      initialState: {
        auth: { isAuthed: true },
        user: { loggedIn: true, role: Role.Guest },
      },
    });
    await render(<MeetingSidebar />, store);

    expect(screen.getByTestId('Toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarHandraiseButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarBlurScreenButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarAudioButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarVideoButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
    expect(screen.getByTestId('toolbarEndCallButton')).toBeInTheDocument();

    expect(screen.getByRole('tablist')).toBeInTheDocument();
    tabsNames.map((name) => expect(screen.queryByLabelText(name as string)).not.toBeInTheDocument());

    expect(screen.getByText('menutabs-chat')).toBeInTheDocument();
    expect(screen.getByText('menutabs-people')).toBeInTheDocument();
    expect(screen.getByText('menutabs-messages')).toBeInTheDocument();
  });
});
