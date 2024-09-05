// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, waitFor } from '@testing-library/react';
import { useFormikContext } from 'formik';

import AnswersFormElement from './AnswersFormElement';

jest.mock('formik', () => {
  return {
    ...jest.requireActual('formik'),
    useFormikContext: jest.fn(),
    FieldArray: (props: { render: () => React.ReactElement }) => props.render(),
    Field: () => <div />,
  };
});

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (str: string) => str,
  }),
}));

jest.mock('../../../commonComponents', () => ({
  CommonTextField: () => <div />,
}));

describe('AnswersFormElement', () => {
  const mockUseFormikContext = useFormikContext as jest.Mock;

  beforeEach(() => {
    mockUseFormikContext.mockReturnValue({
      errors: [],
      values: {},
    });
  });

  describe('add answer button', () => {
    it('unconditionally renders', () => {
      render(<AnswersFormElement name="test-name" />);
      expect(screen.getByText('poll-input-choices')).toHaveProperty('tagName', 'BUTTON');
    });

    it('is disabled in edit mode', () => {
      mockUseFormikContext.mockReturnValue({
        errors: [],
        values: {
          'test-name': [''],
        },
      });

      render(<AnswersFormElement name="test-name" />);
      waitFor(() => {
        expect(screen.getByText('poll-input-choices')).toBeDisabled();
      });
    });
  });
});
