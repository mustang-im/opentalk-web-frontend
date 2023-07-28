// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { UserId, Email, InviteStatus } from '@opentalk/rest-api-rtk-query';
import { fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { v4 as uuidv4 } from 'uuid';

import { EventInvite } from '../../../../packages/rtk-rest-api/src/types/eventInvite';
import { cleanup, configureStore, render, screen } from '../../utils/testUtils';
import SelectParticipants from './SelectParticipants';

const mockOnChange = jest.fn();

const MOCK_USER_ME_ID = 'MOCK_USER_ID' as UserId;

const mockOtherUser = {
  id: 'SOME_OTHER_ID',
  firstname: 'Boba',
  lastname: 'Fett',
  avatarUrl: 'some avatarUrl',
};

const mockFindLazyUsersQuery = jest.fn();

jest.mock('../../api/rest', () => ({
  ...jest.requireActual('../../api/rest'),
  useGetMeQuery: () => ({
    meId: MOCK_USER_ME_ID,
  }),
  useLazyFindUsersQuery: () => [
    mockFindLazyUsersQuery,
    {
      foundUsers: [mockOtherUser],
      isLoading: false,
    },
  ],
}));

const invitees: Array<EventInvite> = [
  {
    profile: {
      avatarUrl: 'url',
      displayName: 'Invited Test User',
      email: 'someemail1@mail.com' as Email,
      firstname: 'Invited Test',
      id: uuidv4() as UserId,
      lastname: 'User 1',
      title: '',
    },
    status: InviteStatus.Accepted,
  },
  {
    profile: {
      avatarUrl: 'url',
      displayName: 'Invited Test User 2',
      email: 'someemail2@mail.com' as Email,
      firstname: 'Invited Test',
      id: uuidv4() as UserId,
      lastname: 'User 2',
      title: '',
    },
    status: InviteStatus.Pending,
  },
];

describe('SelectParticipants', () => {
  const { store } = configureStore();

  afterEach(() => cleanup());

  test('will render', async () => {
    await render(<SelectParticipants onChange={mockOnChange} />, store);

    expect(screen.getByTestId('SelectParticipants')).toBeInTheDocument();
    expect(screen.queryByTestId('InvitedParticipants')).not.toBeInTheDocument();
    expect(screen.queryByText('dashboard-select-participants-label-invited')).not.toBeInTheDocument();
  });

  test('renders all filteredUsers', async () => {
    await render(<SelectParticipants onChange={mockOnChange} />, store);

    const input = screen.getByTestId('InputSearchUsers');
    await fireEvent.change(input, { target: { value: 'test' } });

    expect(screen.getAllByTestId('SuggestedParticipant').length).toEqual(1);
    expect(screen.getByText('dashboard-select-participants-label-suggestions')).toBeInTheDocument();
  });

  test('with prop invitees available, should render invited participant list', async () => {
    await render(<SelectParticipants onChange={mockOnChange} invitees={invitees} />, store);

    expect(screen.getByText('dashboard-select-participants-label-invited')).toBeInTheDocument();
    expect(screen.getByTestId('InvitedParticipants')).toBeInTheDocument();
    expect(screen.getByText('Invited Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Invited Test User 2')).toBeInTheDocument();
  });

  test('click on suggested participant will move him to added list', async () => {
    await render(<SelectParticipants onChange={mockOnChange} />, store);

    const input = screen.getByTestId('InputSearchUsers');
    await fireEvent.change(input, { target: { value: 'test' } });

    const suggestedParticipant = screen.getByTestId('SuggestedParticipant');

    expect(screen.queryByTestId('SelectedParticipant')).not.toBeInTheDocument();
    expect(screen.queryByText('dashboard-select-participants-label-added')).not.toBeInTheDocument();

    fireEvent.click(suggestedParticipant);

    await waitFor(() => {
      expect(screen.getAllByTestId('SelectedParticipant').length).toEqual(1);
    });
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(screen.getByText('dashboard-select-participants-label-added')).toBeInTheDocument();
  });

  test('click on delete will move the user back to the suggested list', async () => {
    await render(<SelectParticipants onChange={mockOnChange} invitees={invitees} />, store);

    const input = screen.getByTestId('InputSearchUsers');
    await fireEvent.change(input, { target: { value: 'test' } });

    const suggestedParticipant = screen.getByTestId('SuggestedParticipant');
    await fireEvent.click(suggestedParticipant);

    expect(screen.queryByTestId('SuggestedParticipant')).not.toBeInTheDocument();

    const deleteButton = screen.getByTestId('SelectedParticipants-deleteButton');
    await fireEvent.click(deleteButton);

    expect(screen.queryByText('dashboard-select-participants-label-added')).not.toBeInTheDocument();

    expect(screen.queryAllByTestId('SelectedParticipant').length).toEqual(0);
    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });
});
