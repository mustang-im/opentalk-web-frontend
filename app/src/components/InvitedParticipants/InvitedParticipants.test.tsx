// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { UserId, Email, InviteStatus, EventId } from '@opentalk/rest-api-rtk-query';
import { EventInvite } from '@opentalk/rest-api-rtk-query/src/types/eventInvite';
import { v4 as uuidv4 } from 'uuid';

import { cleanup, configureStore, render, screen } from '../../utils/testUtils';
import InvitedParticipants from './InvitedParticipants';

const MOCK_USER_ME_ID = 'MOCK_USER_ID' as UserId;

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
  {
    profile: {
      avatarUrl: 'url',
      displayName: 'Declined Test User 3',
      email: 'someemail3@mail.com' as Email,
      firstname: 'Declined Test',
      id: uuidv4() as UserId,
      lastname: 'User 3',
      title: '',
    },
    status: InviteStatus.Declined,
  },
];

jest.mock('../../api/rest', () => ({
  ...jest.requireActual('../../api/rest'),
  useGetMeQuery: () => ({
    meId: MOCK_USER_ME_ID,
  }),
  useGetEventInvitesQuery: () => ({
    data: mockInvitees,
  }),
}));

describe('InvitedParticipants', () => {
  const { store } = configureStore();

  beforeEach(async () => {
    await render(<InvitedParticipants eventId={'123' as EventId} showDeleteIcon={true} />, store);
  });

  afterEach(() => cleanup());

  test('will render without errors', async () => {
    expect(screen.getByTestId('InvitedParticipants')).toBeInTheDocument();
  });

  test('should render pending, accepted and declined participant list', async () => {
    expect(screen.getByText('dashboard-meeting-details-page-participant-pending')).toBeInTheDocument();
    expect(screen.getByTestId('InvitedParticipants')).toBeInTheDocument();
    expect(screen.getByText('Accepted Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Invited Test User 2')).toBeInTheDocument();
    expect(screen.getByText('Declined Test User 3')).toBeInTheDocument();
  });
});
