// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ConnectionState } from '../../store/slices/roomSlice';
import { cleanup, configureStore, fireEvent, render, screen } from '../../utils/testUtils';
import WaitingView from './WaitingView';

describe('Waiting view', () => {
  const { store } = configureStore({
    initialState: {
      room: { connectionState: ConnectionState.Waiting },
    },
  });
  const { store: acceptedParticipantStore } = configureStore({
    initialState: {
      room: { connectionState: ConnectionState.ReadyToEnter },
    },
  });
  afterEach(() => cleanup());

  test('Enter button is disabled if ConnectionState is Waiting', async () => {
    await render(<WaitingView />, store);

    const autoJoinCheckbox = screen.getByRole('checkbox', { name: 'waiting-room-auto-join-label' });
    fireEvent.click(autoJoinCheckbox);

    const enterRoomButton = screen.getByRole('button', { name: 'joinform-waiting-room-enter' });

    expect(enterRoomButton).toBeDisabled();
  });

  test('Enter button is not rendered when auto join is checked', async () => {
    await render(<WaitingView />, store);

    const autoJoinCheckbox = screen.getByRole('checkbox', { name: 'waiting-room-auto-join-label' });
    expect(autoJoinCheckbox).toBeChecked();

    const enterRoomButton = screen.queryByRole('button', { name: 'joinform-waiting-room-enter' });
    expect(enterRoomButton).not.toBeInTheDocument();
  });

  test('Enter button is rendered when auto join is unchecked', async () => {
    await render(<WaitingView />, store);

    const autoJoinCheckbox = screen.getByRole('checkbox', { name: 'waiting-room-auto-join-label' });
    fireEvent.click(autoJoinCheckbox);
    expect(autoJoinCheckbox).not.toBeChecked();

    const enterRoomButton = screen.getByRole('button', { name: 'joinform-waiting-room-enter' });
    expect(enterRoomButton).toBeInTheDocument();
  });

  test('Auto Join textbox is not visible if participant is accepted', async () => {
    await render(<WaitingView />, acceptedParticipantStore);

    const autoJoinCheckbox = screen.queryByRole('checkbox', { name: 'waiting-room-auto-join-label' });
    expect(autoJoinCheckbox).not.toBeInTheDocument();
  });
});
