// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';

import { render, screen } from '../../utils/testUtils';
import FormWrapper from './FormWrapper';

describe('FormWrapper Component', () => {
  const formWrapperTestProps = {
    label: 'test-label',
    helperText: 'test-helper-text',
    valid: true,
    error: false,
  };

  test('render component without crashing', async () => {
    await render(
      <FormWrapper {...formWrapperTestProps}>
        <></>
      </FormWrapper>
    );
    expect(screen.getByText('test-label')).toBeInTheDocument();
    expect(screen.queryByText('test-helper-text')).not.toBeInTheDocument();
  });

  test('render component with error and helper text', async () => {
    await render(
      <FormWrapper {...formWrapperTestProps} error>
        <></>
      </FormWrapper>
    );
    expect(screen.getByText('test-label')).toBeInTheDocument();
    expect(screen.getByText('test-helper-text')).toBeInTheDocument();
  });
});
