// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { cleanup, waitFor } from '@testing-library/react';

import { render, screen, configureStore, fireEvent } from '../../utils/testUtils';
import FullscreenView from './FullscreenView';

const mockExitCall = jest.fn();

jest.mock('react-full-screen', () => ({
  ...jest.requireActual('react-full-screen'),
  useFullScreenHandle: () => ({
    exit: mockExitCall,
  }),
}));

describe('FullscreenView', () => {
  afterEach(() => cleanup());
  const { store } = configureStore();

  test('render without crashing', async () => {
    await render(<FullscreenView />, store);

    expect(screen.getByTestId('fullscreen')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /indicator-fullscreen-close/i })).toBeInTheDocument();
    expect(screen.queryByTestId('fullscreenLocalVideo')).not.toBeInTheDocument();
    expect(screen.queryByTestId('Toolbar')).not.toBeInTheDocument();
  });

  test('mouse over, expected to render LocalVideo & toolbar', async () => {
    await render(<FullscreenView />, store);
    const fullscreen = screen.getByTestId('fullscreen');
    expect(fullscreen).toBeInTheDocument();

    await fireEvent.mouseMove(fullscreen);

    expect(screen.getByRole('button', { name: /indicator-fullscreen-close/i })).toBeInTheDocument();
    expect(screen.getByTestId('Toolbar')).toBeInTheDocument();
    expect(screen.getByTestId('fullscreenLocalVideo')).toBeInTheDocument();
  });

  test('click on close button should trigger react-full-screen exit function', async () => {
    await render(<FullscreenView />, store);

    const closeBtn = screen.getByRole('button', { name: /indicator-fullscreen-close/i });
    expect(screen.getByTestId('fullscreen')).toBeInTheDocument();
    expect(closeBtn).toBeInTheDocument();

    await fireEvent.click(closeBtn);

    await waitFor(() => {
      expect(mockExitCall).toBeCalledTimes(1);
    });
  });
});
