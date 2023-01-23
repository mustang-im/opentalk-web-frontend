// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Locale } from 'date-fns';
import { format } from 'date-fns-tz';

export const formatDate = (date: Date, locale?: Locale, timeZone?: string) => {
  return {
    getTimeString() {
      return format(date, 'p', { locale, timeZone });
    },
    getDateString() {
      return format(date, 'P', { locale, timeZone });
    },
    toString() {
      return `${this.getDateString()} ${this.getTimeString()}`;
    },
  };
};
