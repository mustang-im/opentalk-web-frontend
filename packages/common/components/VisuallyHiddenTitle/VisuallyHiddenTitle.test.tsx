// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen } from '@testing-library/react';
import React from 'react';

import VisuallyHiddenTitle from './VisuallyHiddenTitle';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string) => str,
    };
  },
  initReactI18next: {
    type: '3rdParty',
  },
}));
describe('Visually Hidden Title', () => {
  it('should render as the given component', async () => {
    await render(<VisuallyHiddenTitle component={'h2'} label={'messages'} />);

    const renderedVisuallyHiddenTitle = screen.getByRole('heading');
    expect(renderedVisuallyHiddenTitle).toBeInTheDocument();
    expect(renderedVisuallyHiddenTitle.tagName).toBe('H2');
  });
});
