// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { render, act } from '../../../utils/testUtils';
import SecureConnectionField from './SecureConnectionField';

describe('<SecureConnectionField />', () => {
  it('should show secure connection popover on hover', async () => {
    await render(<SecureConnectionField />);

    const secureIcon = screen.getByLabelText('secure-connection-icon');
    expect(secureIcon).toBeInTheDocument();
    expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();

    await act(async () => {
      await userEvent.hover(secureIcon);
      expect(screen.getByText('secure-connection-message')).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.unhover(secureIcon);
      expect(screen.queryByText('secure-connection-message')).not.toBeInTheDocument();
    });
  });
});
