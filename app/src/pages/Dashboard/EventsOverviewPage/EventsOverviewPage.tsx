// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, Skeleton, Stack, styled, Typography } from '@mui/material';
import { ArrowDownIcon, formatDate } from '@opentalk/common';
import { DateTime, Event, EventException, InviteStatus, isTimelessEvent } from '@opentalk/rest-api-rtk-query';
import { endOfISOWeek, getWeek, isAfter, isBefore, isEqual, startOfISOWeek } from 'date-fns';
import i18n, { t } from 'i18next';
import { groupBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetEventsQuery } from '../../../api/rest';
import { Toggle } from '../../../commonComponents';
import { selectFilteredEventByFavorite } from '../../../store/selectors';
import { useHeader } from '../../../templates/DashboardTemplate';
import { getExpandedEvents } from '../../../utils/eventUtils';
import EventsOverview from './fragments/EventsOverview';
import EventsPageHeader, { TimeFilter } from './fragments/EventsPageHeader';

export interface MeetingsProp {
  title: string;
  events: Array<Event | EventException>;
}
interface MeetingsPageProps {
  header?: React.ReactNode;
}

export interface DashboardEventsFilters {
  timePeriod: TimeFilter;
  timeMin?: DateTime;
  timeMax?: DateTime;
  openInvitedMeeting?: boolean;
  favoriteMeetings?: boolean;
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

enum TimePerspectiveFilter {
  TimeIndependent = 'timeindependent',
  Future = 'future',
  Past = 'past',
}

interface ToggleOptionsProps {
  value: TimePerspectiveFilter;
  label: string;
}

const EventsOverviewPage = ({ header }: MeetingsPageProps) => {
  const [expandAccordion, setExpandAccordion] = useState<string>('');
  const [filter, setFilter] = useState<DashboardEventsFilters>({
    timePeriod: TimeFilter.Month,
    timeMin: new Date().toTimeString() as DateTime,
    openInvitedMeeting: false,
    favoriteMeetings: false,
  });

  const [timePeriodFilter, setTimePeriodFilter] = useState<TimePerspectiveFilter>(
    TimePerspectiveFilter.TimeIndependent
  );

  const { t } = useTranslation();
  const toggleOptions: Array<ToggleOptionsProps> = [
    {
      value: TimePerspectiveFilter.TimeIndependent,
      label: t('dashboard-meeting-details-page-time-independent'),
    },
    {
      value: TimePerspectiveFilter.Future,
      label: t('dashboard-meeting-details-page-future'),
    },
    {
      value: TimePerspectiveFilter.Past,
      label: t('dashboard-meeting-details-page-past'),
    },
  ];

  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader(
      <EventsPageHeader
        filter={filter}
        onFilterChange={(key, value) =>
          setFilter((prevFilters) => ({ ...prevFilters, [key]: value ? value : !prevFilters[key] }))
        }
      />
    );
    return () => {
      setHeader(undefined);
    };
  }, [header, setHeader, filter]);

  const formatItemsAsMeetingProps = (event: Array<Event>) => {
    const groupByTimeFilter = groupBy(event, (event) =>
      filterByTimePeriod(
        filter.timePeriod,
        isTimelessEvent(event) ? event.createdAt : (event.startsAt?.datetime as DateTime)
      )
    );
    const groupByTimeFilterArray = Object.entries(groupByTimeFilter).map(([title, events]) => ({ title, events }));
    return [...groupByTimeFilterArray];
  };

  const formatedEventsByHeaderChange = useMemo(() => {
    {
      return (events: Array<Event>) => {
        if (filter.favoriteMeetings) {
          return events.filter((events) => events.isFavorite);
        }
        if (filter.openInvitedMeeting) {
          return events.filter((events) => events.inviteStatus !== InviteStatus.Accepted);
        }
        return events;
      };
    }
  }, [filter.favoriteMeetings, filter.openInvitedMeeting]);

  const { filteredData, isLoading } = useGetEventsQuery(
    { favorites: filter.favoriteMeetings, perPage: 100, adhoc: false },
    {
      selectFromResult: ({ data, isLoading }) => ({
        filteredData: selectFilteredEventByFavorite({ data }),
        isLoading,
      }),
    }
  );

  const evenData = useMemo(() => {
    const expandedEvents = formatedEventsByHeaderChange(getExpandedEvents(filteredData, true));
    let currentFilteredEvents: Array<Event> = [];

    if (timePeriodFilter === TimePerspectiveFilter.TimeIndependent) {
      currentFilteredEvents = expandedEvents.filter((event) => isTimelessEvent(event));
      const constructMeetingProp = {
        title: t('dashboard-meeting-details-page-time-independent'),
        events: currentFilteredEvents,
      };
      setExpandAccordion('all');
      return [constructMeetingProp];
    } else if (timePeriodFilter === TimePerspectiveFilter.Future) {
      const currentDate = new Date();
      currentFilteredEvents = expandedEvents.filter((event) => {
        return (
          (!isTimelessEvent(event) && isEqual(new Date(event.startsAt.datetime), currentDate)) ||
          (!isTimelessEvent(event) && isAfter(new Date(event.startsAt.datetime), currentDate))
        );
      });
      const events = formatItemsAsMeetingProps(currentFilteredEvents);
      if (events.length > 0) {
        setExpandAccordion(events[0].title);
      }
      return events;
    } else {
      const currentDate = new Date();
      currentFilteredEvents = expandedEvents.filter(
        (event) => !isTimelessEvent(event) && isBefore(new Date(event.startsAt.datetime), currentDate)
      );
      setExpandAccordion('');
      return formatItemsAsMeetingProps(currentFilteredEvents);
    }
  }, [t, filter, timePeriodFilter, filteredData]);

  if (isLoading) {
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
    <Stack spacing={3} height={'100%'}>
      <Stack direction={'row'} flex={'0 1 auto'} spacing={3} justifyContent={'space-between'} alignItems="flex-end">
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-events-my-meetings')}
        </Typography>
        <Toggle
          options={toggleOptions}
          onChange={(timePeriod: TimePerspectiveFilter) => {
            setTimePeriodFilter(timePeriod);
          }}
        ></Toggle>
        <ArrowDownButton
          active={expandAccordion === 'all'}
          onClick={() => setExpandAccordion((prev) => (prev === 'all' ? '' : 'all'))}
        >
          <ArrowDownIcon color="secondary" />
        </ArrowDownButton>
      </Stack>
      <EventsOverview data-testid="EventsOverview" entries={evenData || []} expandAccordion={expandAccordion} />
    </Stack>
  );
};

export default EventsOverviewPage;
