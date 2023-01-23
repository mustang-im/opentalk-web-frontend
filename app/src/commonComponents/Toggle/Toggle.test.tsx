// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { cleanup } from '@testing-library/react';
import React from 'react';

import Toggle from '.';
import { fireEvent, render, screen, waitFor } from '../../utils/testUtils';

type Option<Value> = {
  label: string;
  value: Value;
};

const options: Array<Option<string | number>> = [
  {
    value: 'month',
    label: 'Month',
  },
  {
    value: 'week',
    label: 'Week',
  },
  {
    value: 'day',
    label: 'Day',
  },
];

describe('Toggle', () => {
  afterEach(() => cleanup());
  const mockOnChange = jest.fn(() => 'week');
  test('render all options', async () => {
    await render(<Toggle options={options} onChange={mockOnChange} />);
    await waitFor(() => {
      expect(screen.getByText('Month')).toBeInTheDocument();
    });
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Week')).toBeInTheDocument();
    expect(screen.getByText('Day')).toBeInTheDocument();
  });

  test('onChange will fire', async () => {
    await render(<Toggle options={options} onChange={mockOnChange} />);
    await waitFor(() => {
      expect(screen.getByText('Month')).toBeInTheDocument();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Week'));

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toBeCalledWith('week');
  });

  test('onChange will not fire if its already selected', async () => {
    await render(<Toggle options={options} onChange={mockOnChange} />);
    await waitFor(() => {
      expect(screen.getByText('Month')).toBeInTheDocument();
    });

    expect(mockOnChange).toHaveBeenCalledTimes(0);

    fireEvent.click(screen.getByText('Month'));

    expect(mockOnChange).toHaveBeenCalledTimes(0);
  });
});
