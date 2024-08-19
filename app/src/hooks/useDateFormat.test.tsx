// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
// import { render, screen } from '@testing-library/react';
import mockDe from 'date-fns/locale/de/index.js';
import mockEn from 'date-fns/locale/en-US/index.js';

import { useLocale, useDateFormat } from '.';

jest.mock('./useLocale');

describe('useDateFormat - date and time formatting hook', () => {
  beforeEach(() => jest.resetAllMocks());

  it('format time for invalid date (returns current time in 24h format)', () => {
    const date = new Date('undefined');
    expect(useDateFormat(date, 'time')).toMatch(/(:)/);
  });

  it('format morning time (before 12 pm)', () => {
    const dateAM = new Date(2022, 4, 10, 9, 8, 7);
    const formattedTime = useDateFormat(dateAM, 'time');
    expect(formattedTime).toEqual('09:08');
    expect(formattedTime).not.toMatch(/(am)/i);
  });

  it('format afternoon time (after 12 pm)', () => {
    const datePM = new Date(2022, 4, 10, 19, 48, 7);
    const formattedTime = useDateFormat(datePM, 'time');
    expect(formattedTime).toEqual('19:48');
    expect(formattedTime).not.toMatch(/(pm)/i);
  });

  it('format date for invalid date (returns current date in en-US format)', () => {
    (useLocale as jest.Mock).mockReturnValue(mockEn);
    const formattedDate = useDateFormat(new Date('undefined'), 'date');
    expect(formattedDate).toMatch(/(\/)/);
  });

  it('format date for en-US locale MM/DD/YYYY', () => {
    (useLocale as jest.Mock).mockReturnValue(mockEn);
    const date = new Date(2022, 4, 10, 9, 8, 7);
    const formattedDate = useDateFormat(date, 'date');
    expect(formattedDate).toEqual('05/10/2022');
  });

  it('format date for de locale DD.MM.YYYY', () => {
    (useLocale as jest.Mock).mockReturnValue(mockDe);
    const date = new Date(2022, 4, 10, 9, 8, 7);
    const formattedDate = useDateFormat(date, 'date');
    expect(formattedDate).toEqual('10.05.2022');
  });
});
