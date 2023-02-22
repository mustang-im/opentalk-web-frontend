// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
//
// Util functions for centralised time and date formatting.
// Use them only in rare cases!!!!!
// Please, use instead useDateFormat hook instead to have a single source of truth
//
import { Locale } from 'date-fns';
import { format } from 'date-fns-tz';

export const formatDate = (date: Date, locale?: Locale, timeZone?: string) => {
  return {
    getTimeString() {
      return format(date, 'p', { locale, timeZone });
    },
    get24hTimeOfDayString() {
      return format(date, 'HH:mm');
    },
    getDateString() {
      return format(date, 'P', { locale, timeZone });
    },
    toString() {
      return `${this.getDateString()} ${this.getTimeString()}`;
    },
  };
};

export { isValid as isValidDate } from 'date-fns';
