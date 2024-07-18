// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { configureStore, fireEvent, render, screen } from '../../../utils/testUtils';
import MyMeetingMenu from './MyMeetingMenu';

describe('My Meeting Menu', () => {
  test('Report error button is not visible if glitchtip is not configured', async () => {
    const { store } = configureStore({
      initialState: {
        config: {
          glitchtip: {},
        },
      },
    });

    await render(<MyMeetingMenu />, store);

    const menuButton = screen.getByRole('button', { name: 'my-meeting-menu' });
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const reportBugMenuItem = screen.queryByRole('menuitem', { name: 'my-meeting-menu-glitchtip-trigger' });
    expect(reportBugMenuItem).not.toBeInTheDocument();
  });

  test('Report error button is visible when glitchtip dsn is configured', async () => {
    const { store } = configureStore({
      initialState: {
        config: {
          glitchtip: {
            dsn: 'glitchtip.com',
          },
        },
      },
    });
    await render(<MyMeetingMenu />, store);

    const menuButton = screen.getByRole('button', { name: 'my-meeting-menu' });
    expect(menuButton).toBeInTheDocument();

    fireEvent.click(menuButton);

    const menu = screen.getByRole('menu');
    expect(menu).toBeInTheDocument();

    const reportBugMenuItem = screen.getByRole('menuitem', { name: 'my-meeting-menu-glitchtip-trigger' });
    expect(reportBugMenuItem).toBeInTheDocument();
  });
});
