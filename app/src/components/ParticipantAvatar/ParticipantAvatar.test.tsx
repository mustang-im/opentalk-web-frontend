// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { getInitials } from '../../utils/stringUtils';
import { createStore, render, screen } from '../../utils/testUtils';
import ParticipantAvatar from './ParticipantAvatar';

describe('render <ParticipantAvatar />', () => {
  const displayName = 'Randy Mock Tester';
  const initials = getInitials(displayName, 3);
  const { store } = createStore();

  test('should render ParticipantAvatar with initials', async () => {
    await render(<ParticipantAvatar>{displayName}</ParticipantAvatar>, store);
    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.getByText(initials)).toBeInTheDocument();
  });

  test('should render ParticipantAvatar with phoneIcon', async () => {
    await render(<ParticipantAvatar isSipParticipant>{displayName}</ParticipantAvatar>, store);
    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.getByTestId('phoneIcon')).toBeInTheDocument();
  });
});
