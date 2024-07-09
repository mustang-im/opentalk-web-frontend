// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { mockStore, fireEvent, render, screen, waitFor, mockedParticipant } from '../../utils/testUtils';
import ResetHandraisesTab from './ResetHandraisesTab';

const NUMBER_OF_PARTICIPANTS = 4;

describe('Reset all raised hands', () => {
  const { store, dispatch } = mockStore(NUMBER_OF_PARTICIPANTS, { video: true, screen: true, raiseHands: 2 });
  const participant1 = mockedParticipant(0);
  const participant2 = mockedParticipant(1);
  const participant3 = mockedParticipant(2);

  test('ResetRaisedHands component will render properly', async () => {
    await render(<ResetHandraisesTab />, store);

    const resetAllButton = screen.getByRole('button', { name: /global-all/i });
    const resetSelectedButton = screen.getByRole('button', { name: /global-selected/i });

    expect(resetAllButton).toBeInTheDocument();
    expect(resetSelectedButton).toBeInTheDocument();
  });

  test('ResetAllButton triggers api Call', async () => {
    await render(<ResetHandraisesTab />, store);

    const resetAllButton = screen.getByRole('button', { name: /global-all/i });

    fireEvent.click(resetAllButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([{ payload: {}, type: 'signaling/moderation/reset_raised_hands' }]);
    });
  });
  test('ResetRaisedHands Participant list only shows participants with raised hands', async () => {
    await render(<ResetHandraisesTab />, store);

    const checkbox1 = screen.queryByRole('checkbox', { name: participant1.displayName });
    const checkbox2 = screen.queryByRole('checkbox', { name: participant2.displayName });
    const checkbox3 = screen.queryByRole('checkbox', { name: participant3.displayName });

    await expect(checkbox1).toBeInTheDocument();
    await expect(checkbox2).toBeInTheDocument();
    await expect(checkbox3).not.toBeInTheDocument();
  });
  test('ResetSelectedButton triggers api Call', async () => {
    await render(<ResetHandraisesTab />, store);

    const resetSelectedButton = screen.getByRole('button', { name: /global-selected/i });

    const checkbox1 = screen.getByRole('checkbox', { name: participant1.displayName });
    const checkbox2 = screen.getByRole('checkbox', { name: participant2.displayName });

    fireEvent.click(checkbox1);
    fireEvent.click(checkbox2);

    await waitFor(() => {
      expect(checkbox1).toBeChecked();
    });

    await waitFor(() => {
      expect(checkbox2).toBeChecked();
    });

    fireEvent.click(resetSelectedButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        { payload: { target: [participant1.id, participant2.id] }, type: 'signaling/moderation/reset_raised_hands' },
      ]);
    });
  });
});
