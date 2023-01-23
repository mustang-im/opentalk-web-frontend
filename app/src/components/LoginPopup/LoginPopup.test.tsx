// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { screen, render, fireEvent, createStore, waitFor } from '../../utils/testUtils';
import LoginPopup from './LoginPopup';

describe('Login Popup', () => {
  const { store, dispatch } = createStore();

  test('component should render without crashing', async () => {
    await render(<LoginPopup />, store);
    expect(screen.getByText('login-form-title')).toBeInTheDocument();
    expect(screen.getByText('login-form-body')).toBeInTheDocument();

    const loginButton = screen.getByRole('button', { name: /login-form-button-submit/i });
    expect(loginButton).toBeInTheDocument();
  });

  test('click on login button should dispach action of type auth/loaded', async () => {
    await render(<LoginPopup />, store);

    const loginButton = screen.getByRole('button', { name: /login-form-button-submit/i });
    expect(loginButton).toBeInTheDocument();
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toMatchObject([[{ payload: undefined, type: 'auth/loaded' }]]);
    });
  });
});
