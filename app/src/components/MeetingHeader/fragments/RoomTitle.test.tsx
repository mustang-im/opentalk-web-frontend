// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import userEvent from '@testing-library/user-event';
import { truncate } from 'lodash';

import { screen, render, createStore } from '../../../utils/testUtils';
import RoomTitle, { ROOM_TITLE_MAX_LENGTH } from './RoomTitle';

describe('Room title', () => {
  test('should display the whole name in the title and in the tooltip', async () => {
    const allowedLengthName = 'a'.repeat(ROOM_TITLE_MAX_LENGTH);
    const createdStore = createStore({
      initialState: {
        room: {
          eventInfo: {
            title: allowedLengthName,
          },
        },
      },
    });

    await render(<RoomTitle />, createdStore.store);

    expect(screen.getByText(allowedLengthName)).toBeInTheDocument();

    const title = screen.getByTitle(allowedLengthName);
    await userEvent.hover(title);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(allowedLengthName);
  });

  test('should display dots after exceeding max length in the title and whole name in the tooltip', async () => {
    const exceedingMaxLengthName = 'a'.repeat(ROOM_TITLE_MAX_LENGTH + 1);
    const createdStore = createStore({
      initialState: {
        room: {
          eventInfo: {
            title: exceedingMaxLengthName,
          },
        },
      },
    });

    await render(<RoomTitle />, createdStore.store);

    expect(screen.queryByText(exceedingMaxLengthName)).not.toBeInTheDocument();
    expect(screen.getByText(/.../i)).toBeInTheDocument();

    const title = screen.getByTitle(exceedingMaxLengthName);
    await userEvent.hover(title);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(exceedingMaxLengthName);
  });
  test('should render the info button if the eventInfo contains meeting details and if the room has roomInfo', async () => {
    const createdStore = createStore({
      initialState: {
        room: {
          eventInfo: {
            title: 'some title',
            meetingDetails: {
              inviteCode: 'invite this',
              streamingLinks: [
                {
                  name: 'twitch',
                  url: 'http://twitch.tv/some-streamer',
                },
              ],
              callIn: {
                id: '1138',
                tel: '4815162342',
                password: 'password',
              },
            },
          },
          roomInfo: {
            id: '2320891fsd',
            password: '1234',
            createdBy: {
              firstname: 'Jan',
              lastname: 'Janssen',
              displayName: 'Awesome Jan',
              title: 'Doctor',
              avatarUrl: '',
            },
          },
        },
      },
    });
    await render(<RoomTitle />, createdStore.store);
    const InfoButton = screen.getByRole('button', { name: 'room-title-info-button-aria-label' });
    expect(InfoButton).toBeVisible();
  });

  test('should display fallback title in case room title is undefined', async () => {
    const truncatedFallbackTitle = truncate('fallback-room-title', { length: ROOM_TITLE_MAX_LENGTH });
    const createdStore = createStore({
      initialState: {
        room: {
          eventInfo: undefined,
        },
      },
    });
    await render(<RoomTitle />, createdStore.store);

    expect(screen.getByText(truncatedFallbackTitle)).toBeInTheDocument();

    const title = screen.getByTitle('fallback-room-title');
    await userEvent.hover(title);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('fallback-room-title');
  });
  test('should be rendered inside an h1 tag', async () => {
    const truncatedFallbackTitle = truncate('fallback-room-title', { length: ROOM_TITLE_MAX_LENGTH });
    const createdStore = createStore({
      initialState: {
        room: {
          eventInfo: undefined,
        },
      },
    });
    await render(<RoomTitle />, createdStore.store);

    const roomTitleElement = screen.getByText(truncatedFallbackTitle);
    expect(roomTitleElement.tagName).toBe('H1');
  });
});
