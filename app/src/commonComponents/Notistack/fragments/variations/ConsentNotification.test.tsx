// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import '@testing-library/jest-dom';
import { Fragment } from 'react';

import { fireEvent, render, screen, waitFor } from '../../../../utils/testUtils';
import { ConsentNotification, showConsentNotification } from './ConsentNotification';

const acceptButtonFn = jest.fn();
const declineButtonFn = jest.fn();
const dispatch = jest.fn();

describe('ConsentNotification', () => {
  test('component DOM structure', async () => {
    await render(<ConsentNotification style={{}} onAcceptButton={acceptButtonFn} onDeclineButton={declineButtonFn} />);
    const element = screen.getByRole('alertdialog');
    expect(element).toBeInTheDocument();
    const describedByElement = element.getAttribute('aria-describedby');
    expect(screen.getByText('consent-message')).toHaveAttribute('id', describedByElement);
  });

  test('button responsiveness', async () => {
    await render(<ConsentNotification style={{}} onAcceptButton={acceptButtonFn} onDeclineButton={declineButtonFn} />);
    fireEvent.click(screen.getByText('consent-accept'));
    fireEvent.click(screen.getByText('consent-decline'));
    expect(acceptButtonFn).toBeCalled();
    expect(declineButtonFn).toBeCalled();
  });

  test('renders notification with expected elements', async () => {
    // There is no component to render, we are testing notification and notistack provider is part of the render utility.
    await render(<Fragment />);
    await waitFor(async () => {
      showConsentNotification(dispatch);
      const notification = screen.getByRole('alertdialog');
      const heading = screen.getByRole('heading');
      const acceptButton = screen.getByRole('button', { name: 'consent-accept' });
      const declineButton = screen.getByRole('button', { name: 'consent-decline' });
      expect(notification).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('consent-message');
      expect(acceptButton).toBeInTheDocument();
      expect(declineButton).toBeInTheDocument();
    });
  });
});
