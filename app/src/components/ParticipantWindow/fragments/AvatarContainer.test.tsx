// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { getInitials } from '../../../utils/stringUtils';
import { configureStore, render, screen } from '../../../utils/testUtils';
import { AvatarContainer } from './AvatarContainer';

describe('render <AvatarContainer />', () => {
  const displayName = 'Test User Name';
  const initials = getInitials(displayName, 3);
  const { store } = configureStore();

  test('should render AvatarContainer component with initial', async () => {
    await render(<AvatarContainer>{displayName}</AvatarContainer>, store);
    expect(screen.getByTestId('avatarContainer')).toBeInTheDocument();
    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.getByText(initials)).toBeInTheDocument();
  });

  test('render with isSipParticipant flag should not render initials', async () => {
    await render(<AvatarContainer isSipParticipant>{displayName}</AvatarContainer>, store);
    expect(screen.getByTestId('avatarContainer')).toBeInTheDocument();
    expect(screen.getByTestId('participantAvatar')).toBeInTheDocument();
    expect(screen.queryByTestId('avatarIcon')).not.toBeInTheDocument();
    expect(screen.queryByText(initials)).not.toBeInTheDocument();
  });
});
