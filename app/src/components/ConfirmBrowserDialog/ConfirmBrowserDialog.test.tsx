// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';

import ConfirmBrowserDialog from './ConfirmBrowserDialog';

jest.mock('../../modules/BrowserSupport');
jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => null),
      },
    };
  },
  initReactI18next: {
    type: '3rdParty',
    init: () => null,
  },
}));

const mockHandleClick = jest.fn();

describe('ConfirmBrowserDialog', () => {
  test('rendered without crash', () => {
    render(<ConfirmBrowserDialog handleClick={mockHandleClick} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  test('handle click is fired', () => {
    render(<ConfirmBrowserDialog handleClick={mockHandleClick} />);

    const submitButton = screen.getByRole('button', { name: /wrong-browser-dialog-ok/i });
    submitButton.click();

    expect(mockHandleClick).toHaveBeenCalledTimes(1);
  });
});
