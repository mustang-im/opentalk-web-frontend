// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { mockStore, render, screen, fireEvent, waitFor, mockedParticipant } from '../../utils/testUtils';
import MuteParticipantsTab from './MuteParticipantsTab';

const NUMBER_OF_PARTICIPANTS = 4;
const UNMUTED_PARTICIPANTS = 2;

describe('MuteParticipantsTab', () => {
  const { store, dispatch } = mockStore(NUMBER_OF_PARTICIPANTS, {
    video: true,
    screen: true,
    audio: UNMUTED_PARTICIPANTS,
  });
  const participant1 = mockedParticipant(0);
  const participant2 = mockedParticipant(1);

  test(`component will render only unmuted participants`, async () => {
    await render(<MuteParticipantsTab />, store);

    const muteAllButton = screen.getByRole('button', { name: /global-all/i });
    const muteSelectedButton = screen.getByRole('button', { name: /global-selected/i });

    expect(muteAllButton).toBeInTheDocument();
    expect(muteSelectedButton).toBeInTheDocument();
    expect(screen.getByPlaceholderText('input-search-placehoder')).toBeInTheDocument();

    const participantsList = screen.getAllByRole('listitem');
    expect(participantsList).toHaveLength(UNMUTED_PARTICIPANTS);
  });

  test('click on muteAll button should dispatch moderator_mute action', async () => {
    await render(<MuteParticipantsTab />, store);
    const allParticipantIds = [participant1.id, participant2.id];

    const muteAllButton = screen.getByRole('button', { name: /global-all/i });
    expect(muteAllButton).toBeInTheDocument();

    fireEvent.click(muteAllButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        {
          payload: { targets: [...allParticipantIds], force: true },
          type: 'signaling/media/moderator_mute',
        },
      ]);
    });
  });

  test('click on muteSelected button should dispatch moderator_mute action only for selected participant', async () => {
    await render(<MuteParticipantsTab />, store);

    const muteSelectedButton = screen.getByRole('button', { name: /global-selected/i });
    expect(muteSelectedButton).toBeInTheDocument();

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

    fireEvent.click(muteSelectedButton);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        {
          payload: { force: true, targets: [participant1.id, participant2.id] },
          type: 'signaling/media/moderator_mute',
        },
      ]);
    });
  });
});
