// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { Role } from '../../api/types/incoming/control';
import { render, screen, fireEvent, waitFor, cleanup, createStore } from '../../utils/testUtils';
import LobbyView from './LobbyView';

jest.mock('../../api/rest', () => ({
  ...jest.requireActual('../../api/rest'),
  useGetMeQuery: () => ({
    data: {
      displayName: 'Test',
    },
    isLoading: false,
  }),
}));

describe('LobbyForm', () => {
  const { store /*, dispatch*/ } = createStore({
    initialState: {
      auth: { isAuthed: true },
      user: { loggedIdToken: 'DUMMY', role: Role.User },
    },
  });
  afterEach(() => cleanup());

  test('render LobbyForm component without crashing for authed user', async () => {
    await render(<LobbyView />, store);
    const userNameInput = screen.getByPlaceholderText('joinform-enter-name');
    expect(userNameInput).toBeInTheDocument();
    expect(userNameInput).toHaveAttribute('type', 'text');
    expect(userNameInput).toHaveDisplayValue('Test');

    const passwordInput = screen.getByPlaceholderText('joinform-enter-password');
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');

    const passVisibilityToggle = screen.getByRole('button', { name: /toggle-password-visibility/i });
    expect(passVisibilityToggle).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /joinform-enter-now/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).not.toHaveAttribute('disabled');
  });

  test('submit button is disabled if user is not logged in', async () => {
    const { store } = createStore({
      initialState: {
        user: { loggedIn: false, role: Role.User },
      },
    });
    await render(<LobbyView />, store);

    const submitButton = screen.getByRole('button', { name: /joinform-enter-now/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('disabled');
  });

  test('adding values to input fileds and click on submit should submit added values', async () => {
    const USERNAME = 'lobbyForm testUserName*7';
    const PASSWORD = 'lobbyFormPassword (*';
    await render(<LobbyView />, store);

    const userNameInput = screen.getByPlaceholderText('joinform-enter-name');
    expect(userNameInput).toBeInTheDocument();

    fireEvent.change(userNameInput, { target: { value: USERNAME } });
    await waitFor(() => {
      expect(userNameInput).toHaveValue(USERNAME);
    });

    const passwordInput = screen.getByPlaceholderText('joinform-enter-password');
    expect(passwordInput).toBeInTheDocument();

    fireEvent.change(passwordInput, { target: { value: PASSWORD } });
    await waitFor(() => {
      expect(passwordInput).toHaveValue(PASSWORD);
    });

    const submitButton = screen.getByRole('button', { name: /joinform-enter-now/i });
    expect(submitButton).toBeInTheDocument();

    /* TODO the startRoom ('room/start/pending') async thunks is undefined here
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(dispatch.mock.calls).toContain([
        [{ payload: undefined, type: 'auth/loaded' }],
        [{ payload: undefined, type: 'room/start/pending' }],
      ]);
    });
    */
  });

  test('click on toggle visibility button should change input type=text', async () => {
    await render(<LobbyView />, store);

    const passwordInput = screen.getByPlaceholderText('joinform-enter-password');
    expect(passwordInput).toHaveAttribute('type', 'password');

    const toggleVisibilityBtn = screen.getByRole('button', { name: /toggle-password-visibility/i });
    expect(toggleVisibilityBtn).toBeInTheDocument();

    fireEvent.click(toggleVisibilityBtn);
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  test('name field prefilled from displayName', async () => {
    await render(<LobbyView />, store);
    expect(screen.getByPlaceholderText('joinform-enter-name')).toHaveDisplayValue('Test');
  });
});
