// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Email, EventId, InviteStatus, UserId } from '@opentalk/rest-api-rtk-query';
import { UserRole } from '@opentalk/rest-api-rtk-query/src/types';
import { EventInvite } from '@opentalk/rest-api-rtk-query/src/types/eventInvite';
import { v4 as uuidv4 } from 'uuid';

import { configureStore, render, screen } from '../../utils/testUtils';
import InvitedParticipants from './InvitedParticipants';

const mockInvitees: Array<EventInvite> = [
  {
    profile: {
      avatarUrl: 'url',
      displayName: 'Accepted Test User 1',
      email: 'someemail1@mail.com' as Email,
      firstname: 'Accepted Test',
      id: uuidv4() as UserId,
      lastname: 'User 1',
      title: '',
      role: UserRole.USER,
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
      role: UserRole.USER,
    },
    status: InviteStatus.Pending,
  },
  {
    profile: {
      avatarUrl: 'url',
      displayName: 'Declined Test User 3',
      email: 'someemail3@mail.com' as Email,
      firstname: 'Declined Test',
      id: uuidv4() as UserId,
      lastname: 'User 3',
      title: '',
      role: UserRole.USER,
    },
    status: InviteStatus.Declined,
  },
];

jest.mock('../../api/rest', () => ({
  ...jest.requireActual('../../api/rest'),
  useGetEventInvitesQuery: () => ({
    data: mockInvitees,
  }),
  useGetEventQuery: () => ({
    isLoading: false,
    data: {
      createdBy: {
        id: 'MOCK_USER_ID' as UserId,
      },
    },
  }),
  useGetMeQuery: () => ({
    isLoading: false,
    data: {
      id: 'MOCK_USER_ID' as UserId,
    },
  }),
}));

describe('InvitedParticipants', () => {
  const { store } = configureStore();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('will render without errors', async () => {
    await render(<InvitedParticipants eventId={'SOME_EVENT_ID' as EventId} isUpdatable={true} />, store);
    expect(screen.getByTestId('InvitedParticipants')).toBeInTheDocument();
  });

  test('render 3 ParticipantList components', async () => {
    await render(<InvitedParticipants eventId={'SOME_EVENT_ID' as EventId} isUpdatable={true} />, store);
    expect(screen.getByTestId('InvitedParticipants').children).toHaveLength(3);
  });
});
