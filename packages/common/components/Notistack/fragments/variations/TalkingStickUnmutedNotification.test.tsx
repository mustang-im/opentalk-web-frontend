// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import { TalkingStickUnmutedNotification } from './TalkingStickUnmutedNotification';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TalkingStickUnmutedNotification', () => {
  test('component DOM structure', () => {
    render(<TalkingStickUnmutedNotification style={{}} isLastSpeaker={false} onNext={jest.fn()} />);
    const element = screen.getByRole('alertdialog');
    expect(element).toBeInTheDocument();
    const describedByElement = element.getAttribute('aria-describedby');
    expect(screen.getByText('talking-stick-unmuted-notification')).toHaveAttribute('id', describedByElement);
  });

  it('shows different text on last speaker', () => {
    render(<TalkingStickUnmutedNotification style={{}} isLastSpeaker={true} onNext={jest.fn()} />);
    expect(screen.getByText('talking-stick-unmuted-notification-last-participant')).toBeInTheDocument();
  });

  test('button responsiveness', () => {
    const nextButtonFn = jest.fn();
    render(<TalkingStickUnmutedNotification style={{}} isLastSpeaker={false} onNext={nextButtonFn} />);
    fireEvent.click(screen.getByText('talking-stick-notification-next-speaker'));
    expect(nextButtonFn).toBeCalled();
  });
});
