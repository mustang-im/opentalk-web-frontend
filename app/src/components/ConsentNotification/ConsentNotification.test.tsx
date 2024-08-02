// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React, { Fragment } from 'react';

import { render, screen, waitFor } from '../../utils/testUtils';
import { showConsentNotification } from './ConsentNotification';

describe('ConsentNotification', () => {
  const dispatch = jest.fn();

  it('renders notification with expected elements', async () => {
    // There is no component to render, we are testing notification and notistack provider is part of the render utility.
    await render(<Fragment />);
    await waitFor(async () => {
      showConsentNotification(dispatch);
      const heading = screen.getByText('consent-message');
      const acceptButton = screen.getByText('consent-accept');
      const declineButton = screen.getByText('consent-decline');
      expect(heading).toBeInTheDocument();
      expect(acceptButton).toBeInTheDocument();
      expect(declineButton).toBeInTheDocument();
      const container = heading.parentElement?.parentElement;
      expect(container).not.toBeNull();
      expect(container).toHaveAttribute('role', 'alertdialog');
    });
  });
});
