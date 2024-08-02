// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { ConsentNotification } from './ConsentNotification';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('ConsentNotification', () => {
  test('component DOM structure', () => {
    render(<ConsentNotification style={{}} onAcceptButton={jest.fn()} onDeclineButton={jest.fn()} />);
    const element = screen.getByRole('alertdialog');
    expect(element).toBeInTheDocument();
    const describedByElement = element.getAttribute('aria-describedby');
    expect(screen.getByText('consent-message')).toHaveAttribute('id', describedByElement);
  });

  test('button responsiveness', () => {
    const acceptButtonFn = jest.fn();
    const declineButtonFn = jest.fn();
    render(<ConsentNotification style={{}} onAcceptButton={acceptButtonFn} onDeclineButton={declineButtonFn} />);
    fireEvent.click(screen.getByText('consent-accept'));
    fireEvent.click(screen.getByText('consent-decline'));
    expect(acceptButtonFn).toBeCalled();
    expect(declineButtonFn).toBeCalled();
  });
});
