// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { cleanup, render } from '@testing-library/react';
import { PropsWithChildren } from 'react';

import { screen } from '../utils/testUtils';
import LobbyTemplate from './LobbyTemplate';

jest.mock('./fragments/BrowserCompatibilityInfo', () => ({
  __esModule: true,
  default: ({ children }: PropsWithChildren) => {
    return <>{children}</>;
  },
}));

describe('LobbyTemplate', () => {
  afterEach(() => cleanup());
  test('licenses are not displayed by default', () => {
    render(<LobbyTemplate />);

    expect(screen.queryByTestId('LegalContainer')).toBeNull();
  });

  test('licenses are displayed on demand', () => {
    render(<LobbyTemplate legal />);

    expect(screen.getByTestId('LegalContainer')).toBeInTheDocument();
  });

  test('template renders children', () => {
    render(
      <LobbyTemplate>
        <div data-testid="test-child" />
      </LobbyTemplate>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });
});
