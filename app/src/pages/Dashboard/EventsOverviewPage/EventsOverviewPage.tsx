// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, Skeleton, Stack, styled } from '@mui/material';
import { ArrowDownIcon, formatDate } from '@opentalk/common';
import {
  CursorPaginated,
  DateTime,
  Event,
  EventException,
  InviteStatus,
  isTimelessEvent,
} from '@opentalk/rest-api-rtk-query';
import { endOfISOWeek, formatRFC3339, getWeek, startOfISOWeek } from 'date-fns';
import i18n, { t } from 'i18next';
import { groupBy } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetEventsQuery } from '../../../api/rest';
import { useHeader } from '../../../templates/DashboardTemplate';
import {
  appendRecurringEventInstances,
  SortDirection,
  orderEventsByDate,
  TimePerspectiveFilter,
} from '../../../utils/eventUtils';
import EventsOverview from './fragments/EventsOverview';
import EventsPageHeader, { DashboardEventsFilters, TimeFilter } from './fragments/EventsPageHeader';

interface MeetingsPageProps {
  header?: React.ReactNode;
}

export interface DashboardEventsFilters {
  timePeriod: TimeFilter;
  timeMin?: DateTime;
  timeMax?: DateTime;
  openInvitedMeeting?: boolean;
  favoriteMeetings?: boolean;
  timePerspective: TimePerspectiveFilter;
}

const ArrowDownButton = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'active' })<{
  active?: boolean;
}>(({ active }) => ({
  background: 'transparent',
  svg: {
    width: 40,
    height: 24,
    transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    transform: active ? 'rotate(180deg)' : 'none',
  },
  '&:hover': {
    background: 'transparent',
  },
}));

export const filterByTimePeriod = (timePeriod: DashboardEventsFilters['timePeriod'], date: DateTime) => {
  const createDate = new Date(date);

  switch (timePeriod) {
    case TimeFilter.Month:
      return new Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' }).format(createDate);
    case TimeFilter.Day:
      return new Intl.DateTimeFormat(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' }).format(
        createDate
      );
    case TimeFilter.Week:
    default: {
      //Gets the week number with weeks starting on a Monday (1) as ISO standard, since every first week contains a Thursday (4)
      const weekNumber = getWeek(createDate, { weekStartsOn: 1, firstWeekContainsDate: 4 });

      const startDate = formatDate(startOfISOWeek(createDate)).getDateString();
      const endDate = formatDate(endOfISOWeek(createDate)).getDateString();

      return `${t('global-calendar-week')}: ${weekNumber} (${startDate} - ${endDate})`;
    }
  }
};

const EVENTS_PER_REQUEST = 100;

const EventsOverviewPage = ({ header }: MeetingsPageProps) => {
  const [expandAccordion, setExpandAccordion] = useState<string>('');
  const [filter, setFilter] = useState<DashboardEventsFilters>({
    timePeriod: TimeFilter.Month,
    timeMin: new Date().toTimeString() as DateTime,
    openInvitedMeeting: false,
    favoriteMeetings: false,
    timePerspective: TimePerspectiveFilter.TimeIndependent,
  });

  const { t } = useTranslation();

  const formatEventsByHeaderChange = useCallback(
    (events: Array<Event>) => {
      if (filter.favoriteMeetings) {
        return events.filter((event) => event.isFavorite);
      }
      if (filter.openInvitedMeeting) {
        return events.filter((event) => event.inviteStatus !== InviteStatus.Accepted);
      }
      return events;
    },
    [filter.favoriteMeetings, filter.openInvitedMeeting]
  );

  const timeMinFilter = useMemo(() => {
    if (filter.timePerspective === TimePerspectiveFilter.Future) {
      // setSecond to 0 to optimize the request and not ask data on every second when switching timePeriodFilter
      return formatRFC3339(new Date().setSeconds(0, 0)) as DateTime;
    }
  }, [filter.timePerspective]);

  const timeMaxFilter = useMemo(() => {
    if (filter.timePerspective === TimePerspectiveFilter.Past) {
      // setSecond to 0 to optimize the request and not ask data on every second when switching timePeriodFilter
      return formatRFC3339(new Date().setSeconds(0, 0)) as DateTime;
    }
  }, [filter.timePerspective]);

  /**
   * Returns memoized function to optimize the performance (acts like a memoized selector)
   **/
  const selectAndTransformToMeetingProps = (
    data: CursorPaginated<Event | EventException> | undefined,
    timePerspectiveFilter: TimePerspectiveFilter
  ) =>
    useMemo(() => {
      if (!data) {
        return [];
      }

      const eventsWithEventInstances = appendRecurringEventInstances(data.data, true, undefined, timePerspectiveFilter);

      const orderedEventsWithRecurringInstances = orderEventsByDate(
        formatEventsByHeaderChange(eventsWithEventInstances),
        timePerspectiveFilter === TimePerspectiveFilter.Future ? SortDirection.ASC : SortDirection.DESC
      );

      if (timePerspectiveFilter === TimePerspectiveFilter.TimeIndependent) {
        const constructMeetingProp = {
          title: t('dashboard-meeting-details-page-timeindependent'),
          events: orderedEventsWithRecurringInstances,
        };
        setExpandAccordion('all');
        return [constructMeetingProp];
      }
      const eventsGroupedByTimeFilter = groupBy(orderedEventsWithRecurringInstances, (event) =>
        filterByTimePeriod(
          filter.timePeriod,
          isTimelessEvent(event) ? event.createdAt : (event.startsAt?.datetime as DateTime)
        )
      );
      const eventsTransformedAsMeetingProp = Object.entries(eventsGroupedByTimeFilter).map(([title, events]) => ({
        title,
        events,
      }));
      if (eventsTransformedAsMeetingProp.length > 0) {
        setExpandAccordion(eventsTransformedAsMeetingProp[0].title);
      }
      return [...eventsTransformedAsMeetingProp];
    }, [timePerspectiveFilter, filter, data]);

  const { events, isLoading, isFetching } = useGetEventsQuery(
    {
      favorites: filter.favoriteMeetings,
      perPage: EVENTS_PER_REQUEST,
      adhoc: false,
      timeIndependent: filter.timePerspective === TimePerspectiveFilter.TimeIndependent,
      timeMin: timeMinFilter,
      timeMax: timeMaxFilter,
    },
    {
      selectFromResult: ({ data, isLoading, isFetching }) => ({
        events: selectAndTransformToMeetingProps(data, filter.timePerspective),
        isLoading,
        isFetching,
      }),
    }
  );

  if (isLoading || isFetching) {
    return (
      <Stack spacing={3}>
        <Skeleton variant="text" width={'20%'} height={40} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
        <Skeleton variant="rectangular" height={50} />
      </Stack>
    );
  }
  return (
    <>
      {/* Parent stack is messing up with the MUI Grid styles, therefore this wrapper is a workaround for it. */}
      <div>
        <EventsPageHeader
          filter={filter}
          onFilterChange={(key, value) =>
            setFilter((prevFilters) => ({ ...prevFilters, [key]: value ? value : !prevFilters[key] }))
          }
        />
      </div>
      <Stack spacing={3} height={'100%'}>
        {/* <ArrowDownButton
            active={expandAccordion === 'all'}
            onClick={() => setExpandAccordion((prev) => (prev === 'all' ? '' : 'all'))}
          >
            <ArrowDownIcon color="secondary" />
          </ArrowDownButton> */}
        <EventsOverview entries={events || []} expandAccordion={expandAccordion} />
      </Stack>
    </>
  );
};

export default EventsOverviewPage;
