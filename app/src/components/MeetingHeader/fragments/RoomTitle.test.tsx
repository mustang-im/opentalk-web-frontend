// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import userEvent from '@testing-library/user-event';

import { screen, render } from '../../../utils/testUtils';
import RoomTitle, { ROOM_TITLE_MAX_LENGTH } from './RoomTitle';

describe('Room title', () => {
  test('shall display the whole name in the title and in the tooltip', async () => {
    const allowedLengthName = 'a'.repeat(ROOM_TITLE_MAX_LENGTH);
    await render(<RoomTitle title={allowedLengthName} />);

    expect(screen.getByText(allowedLengthName)).toBeInTheDocument();

    const title = screen.getByTitle(allowedLengthName);
    await userEvent.hover(title);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(allowedLengthName);
  });

  test('shall dispaly dots after exceeding max length in the title and whole name in the tooltip', async () => {
    const exceedingMaxLengthName = 'a'.repeat(ROOM_TITLE_MAX_LENGTH + 1);
    await render(<RoomTitle title={exceedingMaxLengthName} />);

    expect(screen.queryByText(exceedingMaxLengthName)).not.toBeInTheDocument();
    expect(screen.getByText(/.../i)).toBeInTheDocument();

    const title = screen.getByTitle(exceedingMaxLengthName);
    await userEvent.hover(title);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent(exceedingMaxLengthName);
  });

  test('shall display fallback title in case room title is undefined', async () => {
    await render(<RoomTitle title={undefined} />);

    expect(screen.getByText('fallback-room-title')).toBeInTheDocument();

    const title = screen.getByTitle('fallback-room-title');
    await userEvent.hover(title);
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveTextContent('fallback-room-title');
  });
});
