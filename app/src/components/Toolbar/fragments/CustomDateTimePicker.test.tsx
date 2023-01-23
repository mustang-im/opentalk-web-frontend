// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import DateFnsAdapter from '@date-io/date-fns';

import { render, screen, createStore } from '../../../utils/testUtils';
import CustomDateTimePicker from './CustomDateTimePicker';

const date = new Date();

const dateFns = new DateFnsAdapter();
const formattedDate = dateFns.formatByString(date, 'dd.MM.yyyy HH:mm');

const dateTimePickerProps = {
  ampm: false,
  clearable: true,
  disablePast: true,
  clearText: 'dialog-invite-guest-no-expiration',
  inputFormat: 'dd.MM.yyyy HH:mm',
  mask: '__.__.____ __:__',
  value: date,
  onChange: jest.fn(),
  allowSameDateSelection: true,
  dateRangeIcon: null,
  placeholder: 'dialog-invite-guest-no-expiration',
  minDateTime: date,
};

describe('render <CustomDateTimePicker />', () => {
  const { store } = createStore();

  test('render CustomDateTimePicker component', async () => {
    await render(<CustomDateTimePicker {...dateTimePickerProps} />, store);
    const input: HTMLInputElement = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input.value).toBe(formattedDate);
  });
});
