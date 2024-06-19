// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SortOption } from '@opentalk/common';
import { fireEvent, screen, waitFor } from '@testing-library/react';

import { render } from '../../utils/testUtils';
import TalkingStickSortButton from './TalkingStickSortButton';

describe('TalkingStickSortButton', () => {
  const DEFAULT_PROPS = {
    selectedSortType: SortOption.NameASC,
    onChange: jest.fn(),
  };

  afterEach(() => {
    DEFAULT_PROPS.onChange.mockClear();
  });

  it('should reveal sort popover when button is clicked.', async () => {
    await render(<TalkingStickSortButton {...DEFAULT_PROPS} />);
    const button = screen.getByText('sort-name-asc');
    fireEvent.click(button);
    await waitFor(() => {
      expect(screen.getByRole('menu')).toBeInTheDocument();
    });
  });
});
