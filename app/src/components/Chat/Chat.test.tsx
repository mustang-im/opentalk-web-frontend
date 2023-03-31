// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId, ParticipationKind, ProtocolAccess, WaitingState } from '@opentalk/common';
import { Store } from 'redux';

import { join, leave } from '../../store/slices/participantsSlice';
import { screen, render, createStore, waitFor, fireEvent } from '../../utils/testUtils';
import Chat from './Chat';

describe('Chat component', () => {
  let store: Store, dispatch: jest.Mock;
  beforeEach(() => {
    const createdStore = createStore({
      initialState: {
        chat: {
          enabled: true,
          messages: {
            ids: [],
            entities: {},
          },
        },
        events: {
          ids: [],
          entities: {},
        },
        participants: {
          ids: [],
          entities: {},
        },
      },
    });
    store = createdStore.store;
    dispatch = createdStore.dispatch;
  });

  test('chat component should be displayed with encrypted message on initial load', async () => {
    await render(<Chat />, store);

    await waitFor(() => {
      expect(screen.getByTestId('chat')).toBeInTheDocument();
    });
    expect(screen.getByTestId('no-messages')).toBeInTheDocument();
  });

  test('should display event message when user join conversation', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    await render(<Chat />, store);

    dispatch(
      join({
        participant: {
          id: '123' as ParticipantId,
          displayName: 'Test',
          groups: [],
          handIsUp: false,
          joinedAt: '',
          leftAt: null,
          handUpdatedAt: '',
          breakoutRoomId: null,
          participationKind: ParticipationKind.User,
          lastActive: '',
          waitingState: WaitingState.Joined,
          protocolAccess: ProtocolAccess.None,
          isPresenter: false,
        },
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat')).toBeInTheDocument();
    });

    expect(screen.getByTestId('combined-messages')).toBeInTheDocument();
    expect(screen.getByTestId('user-event-message')).toBeInTheDocument();
  });

  test('should display event message when user leave conversation', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    await render(<Chat />, store);

    dispatch(
      leave({
        id: '123' as ParticipantId,
        timestamp: '',
      })
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat')).toBeInTheDocument();
    });

    expect(screen.getByTestId('combined-messages')).toBeInTheDocument();
    expect(screen.getByTestId('user-event-message')).toBeInTheDocument();
  });

  test('should dispatch action when user send messsage', async () => {
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    await render(<Chat />, store);

    const message = screen.getByPlaceholderText('chatinput-placeholder');

    fireEvent.change(message, { target: { value: 'Test' } });

    const button = screen.getByTestId('send-message-button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        {
          type: 'signaling/chat/send_message',
          payload: { content: 'Test', scope: 'global' },
        },
      ]);
    });
  });

  test('should display error if input is empty on sumbit', async () => {
    await render(<Chat />, store);

    const message = screen.getByPlaceholderText('chatinput-placeholder');

    fireEvent.change(message, { target: { value: '' } });

    const button = screen.getByTestId('send-message-button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('chat-input-error-required')).toBeInTheDocument();
    });
  });
});
