// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, Skeleton, Stack, styled, Typography } from '@mui/material';
import { ArrowDownIcon, formatDate } from '@opentalk/common';
import {
  CursorPaginated,
  DateTime,
  Event,
  EventException,
  InviteStatus,
  isEvent,
  isTimelessEvent,
} from '@opentalk/rest-api-rtk-query';
import { createSelector } from '@reduxjs/toolkit';
import { endOfISOWeek, getWeek, startOfISOWeek } from 'date-fns';
import i18n, { t } from 'i18next';
import { partition, groupBy } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useGetEventsQuery } from '../../../api/rest';
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

const EventsOverviewPage = ({ header }: MeetingsPageProps) => {
  const [expandAll, setExpandAll] = useState<boolean>(true);
  const [filter, setFilter] = useState<DashboardEventsFilters>({
    timePeriod: TimeFilter.Month,
    timeMin: new Date().toTimeString() as DateTime,
    openInvitedMeeting: false,
    favoriteMeetings: false,
  });
  const { t } = useTranslation();

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

  const selectFilteredEvents = useMemo(() => {
    return createSelector(
      [(state: { data: CursorPaginated<EventException | Event> | undefined }) => state.data],
      (data): MeetingsProp[] | undefined => {
        if (data === undefined) {
          return data;
        }
        const { data: selectedEvents } = data;
        const expandedEvents = getExpandedEvents(selectedEvents, true);

        const invitedMeetings = expandedEvents?.filter((event) =>
          isEvent(event) ? event.inviteStatus !== InviteStatus.Accepted : false
        );
        const inviteStatusFilteredData = filter.openInvitedMeeting ? invitedMeetings : expandedEvents;
        const partitionList = partition(inviteStatusFilteredData, (event) => event.isTimeIndependent);

        const timeIndependent =
          partitionList[0].length > 0
            ? [{ title: t('dashboard-event-time-independent-meetings'), events: [...partitionList[0]] }]
            : [];

        const timeDependent = groupBy(partitionList[1], (event) =>
          filterByTimePeriod(
            filter.timePeriod,
            isTimelessEvent(event) ? event.createdAt : (event.startsAt?.datetime as DateTime)
          )
        );

        const timeDependentArray = Object.entries(timeDependent).map(([title, events]) => ({ title, events }));

        return [...timeIndependent, ...timeDependentArray];
      }
    );
  }, [t, filter.timePeriod, filter.openInvitedMeeting]);

  const { filteredData, isLoading } = useGetEventsQuery(
    { favorites: filter.favoriteMeetings, perPage: 100, adhoc: false },
    {
      selectFromResult: ({ data, isLoading }) => ({
        filteredData: selectFilteredEvents({ data }),
        isLoading,
      }),
    }
  );

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
        <ArrowDownButton active={expandAll} onClick={() => setExpandAll((prev) => !prev)}>
          <ArrowDownIcon color="secondary" />
        </ArrowDownButton>
      </Stack>
      <EventsOverview data-testid="EventsOverview" entries={filteredData || []} expandAll={expandAll} />
    </Stack>
  );
};

export default EventsOverviewPage;
