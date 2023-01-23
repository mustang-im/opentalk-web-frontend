// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { mockStore, render, screen, fireEvent, waitFor, mockedParticipant } from '../../../utils/testUtils';
import MuteParticipantsItem from './MuteParticipantsItem';

describe('MuteParticipantsItem', () => {
  const handleCheck = jest.fn();
  const { store } = mockStore(1, { video: true, screen: true });
  const participant = mockedParticipant(0);

  test('MuteParticipantsItem should render properly without crashing', async () => {
    await render(
      <MuteParticipantsItem participant={{ ...participant, selected: false }} onCheck={handleCheck} />,
      store
    );

    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: participant.displayName })).toBeInTheDocument();
    expect(screen.getByLabelText(participant.displayName)).toBeInTheDocument();
  });

  test('click on checkoBox should trigger onCheck()', async () => {
    await render(
      <MuteParticipantsItem participant={{ ...participant, selected: false }} onCheck={handleCheck} />,
      store
    );

    const checkbox = screen.getByRole('checkbox', { name: participant.displayName });
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(handleCheck).toBeCalledTimes(1);
    });
  });
});
