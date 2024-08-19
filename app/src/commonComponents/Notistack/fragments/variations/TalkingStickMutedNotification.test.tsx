// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

import { TalkingStickMutedNotification } from './TalkingStickMutedNotification';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('TalkingStickMutedNotification', () => {
  test('component DOM structure', () => {
    render(<TalkingStickMutedNotification style={{}} onUnmute={jest.fn()} onNext={jest.fn()} />);
    const element = screen.getByRole('alertdialog');
    expect(element).toBeInTheDocument();
    const describedByElement = element.getAttribute('aria-describedby');
    expect(screen.getByText('talking-stick-speaker-announcement')).toHaveAttribute('id', describedByElement);
  });

  test('button responsiveness', () => {
    const unmuteButtonFn = jest.fn();
    const nextButtonFn = jest.fn();
    render(<TalkingStickMutedNotification style={{}} onUnmute={unmuteButtonFn} onNext={nextButtonFn} />);
    fireEvent.click(screen.getByText('talking-stick-notification-unmute'));
    fireEvent.click(screen.getByText('talking-stick-notification-next-speaker'));
    expect(unmuteButtonFn).toBeCalled();
    expect(nextButtonFn).toBeCalled();
  });
});
