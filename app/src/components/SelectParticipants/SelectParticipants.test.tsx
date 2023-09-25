// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { UserId, Email, InviteStatus } from '@opentalk/rest-api-rtk-query';
import { fireEvent, waitFor, within } from '@testing-library/react';
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

  beforeEach(async () => {
    await render(
      <SelectParticipants label="Test" onChange={mockOnChange} onRevokeUserInvite={jest.fn()} invitees={invitees} />,
      store
    );
  });

  afterEach(() => cleanup());

  test('will render without errors', async () => {
    expect(screen.getByTestId('SelectParticipants')).toBeInTheDocument();
  });

  test('sends API request after delay when typed more than 3 characters.', async () => {
    const autocomplete = screen.getByTestId('SelectParticipants');
    const input = await within(autocomplete).findByLabelText('Test');

    await fireEvent.change(input, { target: { value: 'test' } });
    waitFor(
      () => {
        expect(mockFindLazyUsersQuery).toBeCalled();
      },
      { timeout: 500 }
    );
  });

  test('with prop invitees available, should render invited participant list', async () => {
    expect(screen.getByText('dashboard-select-participants-label-invited')).toBeInTheDocument();
    expect(screen.getByTestId('InvitedParticipants')).toBeInTheDocument();
    expect(screen.getByText('Invited Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Invited Test User 2')).toBeInTheDocument();
  });

  test('click on suggested participant will move him to added list', async () => {
    const autocomplete = screen.getByTestId('SelectParticipants');
    const input = await within(autocomplete).findByLabelText('Test');
    expect(screen.queryByTestId('SelectedParticipant')).not.toBeInTheDocument();
    await fireEvent.change(input, { target: { value: 'test' } });
    waitFor(
      async () => {
        const listbox = screen.getByRole('listbox');
        const firstOption = await within(listbox).findByRole('option');
        await fireEvent.click(firstOption);
        expect(screen.findByTestId('SelectedParticipant')).not.toBeEmptyDOMElement();
      },
      { timeout: 500 }
    );
  });

  test('click on delete will move the user back to the suggested list', async () => {
    const autocomplete = screen.getByTestId('SelectParticipants');
    const input = await within(autocomplete).findByLabelText('Test');
    await fireEvent.change(input, { target: { value: 'test' } });
    waitFor(
      async () => {
        const listbox = screen.getByRole('listbox');
        const firstOption = await within(listbox).findByRole('option');
        await fireEvent.click(firstOption);
        const selectedContainer = await screen.findByTestId('SelectedParticipant');
        const firstChipDeleteButton = await within(selectedContainer).findByTestId('SelectedParticipants-deleteButton');
        await fireEvent.click(firstChipDeleteButton);
        expect(screen.queryByTestId('SelectedParticipant')).not.toBeInTheDocument();
      },
      { timeout: 500 }
    );
  });
});
