// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { formatDuration, intervalToDuration } from 'date-fns';

export const getIntervalToDurationString = (interval: Interval) => {
  const duration = intervalToDuration(interval);

  const zeroPad = (number: number) => String(number).padStart(2, '0');

  return formatDuration(duration, {
    format: [duration.hours ? 'hours' : '', 'minutes', 'seconds'],
    zero: true,
    delimiter: ' : ',
    locale: {
      formatDistance: (_token, count) => zeroPad(count),
    },
  });
};

export const getDuration = (interval: Interval) => ({
  format: getIntervalToDurationString(interval),
  duration: intervalToDuration(interval),
});

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
