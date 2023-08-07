// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RRule } from '@heinlein-video/rrule';
import {
  Event,
  EventException,
  EventType,
  InviteStatus,
  isEvent,
  isTimelessEvent,
  RecurringEvent,
} from '@opentalk/rest-api-rtk-query';
import { addMonths, isAfter, subMonths } from 'date-fns';
import _ from 'lodash';

import { TimePerspectiveFilter } from '../pages/Dashboard/EventsOverviewPage/EventsOverviewPage';

export const getExpandedEvents = (
  eventList: (EventException | Event)[],
  filterDeclined?: boolean,
  maxEntries?: number,
  firstDateIsoString?: string,
  maxMonths?: number,
  filter?: TimePerspectiveFilter
): Event[] => {
  const events = Array<Event>();
  const DEFAULT_MONTHS_CONSIDERED = 3;
  eventList.forEach((event) => {
    if (isEvent(event) && (filterDeclined ? event.inviteStatus !== InviteStatus.Declined : true)) {
      if (!isTimelessEvent(event) && event.type === EventType.Recurring) {
        const startDate = new Date(event.startsAt.datetime);
        const endDate = new Date(event.endsAt.datetime);
        const startHour = startDate.getHours();
        const startMin = startDate.getMinutes();
        const duration = endDate.getTime() - startDate.getTime();
        const recurrencePattern = event.recurrencePattern[0];

        const rule = RRule.fromString(
          `DTSTART:${event.startsAt.datetime.replaceAll(':', '').replaceAll('-', '')};
              ${recurrencePattern}`
        );

        const maxConsideredMonths = maxMonths ? maxMonths : DEFAULT_MONTHS_CONSIDERED;

        // If timePerspective is in the future, start date is today and end date is ${maxConsideredMonths} from today
        // if timePerspective is in the past, start date is calculated by substracting ${maxConsideredMonths} from today and adding today as end date
        const recurrenceInterval =
          filter === TimePerspectiveFilter.Future
            ? { start: new Date(), end: addMonths(new Date(), maxConsideredMonths) }
            : { start: subMonths(new Date(), maxConsideredMonths), end: startDate };

        const timeline = rule.between(recurrenceInterval.start, recurrenceInterval.end, true);

        const firstIsoDate = firstDateIsoString ? new Date(firstDateIsoString) : undefined;
        const firstDateTime = filter === TimePerspectiveFilter.Future ? new Date() : firstIsoDate;

        timeline
          .slice(0, maxEntries)
          .filter((value) => firstDateTime === undefined || isAfter(new Date(value.toISOString()), firstDateTime))
          .forEach((startDate) => {
            const startDateAdjusted = startDate;
            startDateAdjusted.setHours(startHour);
            startDateAdjusted.setMinutes(startMin);
            const recurringEvent = { ...event } as RecurringEvent;
            const endDate = new Date(startDateAdjusted.getTime() + duration);
            recurringEvent.startsAt = { datetime: startDateAdjusted.toISOString(), timezone: event.startsAt.timezone };
            recurringEvent.endsAt = { datetime: endDate.toISOString(), timezone: event.endsAt.timezone };
            events.push(recurringEvent);
          });
      } else {
        events.push(event);
      }
    }
  });

  const sortedEvents = _.sortBy(events, function (event: Event) {
    if (isTimelessEvent(event)) {
      return new Date(event.createdAt).getTime();
    }
    return new Date(event.startsAt.datetime).getTime();
  });

  if (maxEntries) {
    return sortedEvents.slice(0, maxEntries);
  }

  return sortedEvents;
};
