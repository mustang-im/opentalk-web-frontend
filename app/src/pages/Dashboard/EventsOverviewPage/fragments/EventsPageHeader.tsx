// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { EventType, isTimelessEvent } from '@opentalk/rest-api-rtk-query';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardEventsFilters, FilterChangeCallbackType, MeetingsProp, TimeFilter } from '../types';
import { CreateNewMeetingButton } from './CreateNewMeetingButton';
import { EventFilterButtonBar } from './EventFilterButtonBar';
import { EventPageFilters } from './EventPageFilters';

// In order to avoid circular dependency I moved file to common parent folder "../types",
// many files are actually importing this interface from here, which is why I re-exported it
// for compatibility reasons. And to avoid touching many files, increasing the end size of the PR.
export { TimeFilter };

interface EventsPageHeaderProps {
  filters: DashboardEventsFilters;
  onFilterChange: FilterChangeCallbackType;
  entries: MeetingsProp[];
}

const EventsPageHeader = ({ onFilterChange, filters, entries }: EventsPageHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));
  // https://mui.com/material-ui/react-stack/#margin-on-the-children
  // Our main component uses Stack which has a problem with margin overwriting.
  const resetMarginTop = theme.spacing(2);
  const resetMarginLeft = theme.spacing(-2);

  const isContainingRecurringEvents = useMemo(() => {
    return entries.find((meetings) =>
      meetings?.events?.find((event) => !isTimelessEvent(event) && event.type === EventType.Recurring)
    );
  }, [entries]);

  if (isDesktop) {
    return (
      <Grid
        container
        component="header"
        rowSpacing={0}
        columnSpacing={2}
        alignItems="center"
        columns={12}
        style={{ marginTop: resetMarginTop, marginLeft: resetMarginLeft }}
      >
        <Grid
          item
          container
          xs="auto"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          zeroMinWidth
        >
          <Typography variant={'h1'} component={'h2'}>
            {t('dashboard-events-my-meetings')}
          </Typography>
          <EventPageFilters filters={filters} onFilterChange={onFilterChange} />
        </Grid>
        <Grid item display="flex" justifyContent="space-between" flex={1} zeroMinWidth>
          <EventFilterButtonBar filters={filters} onFilterChange={onFilterChange} />
          <CreateNewMeetingButton />
        </Grid>
        {isContainingRecurringEvents && (
          <Grid item xs={12}>
            <Typography variant="h2" component={'h2'} mt={2}>
              {t('dashboard-events-note-limited-view')}
            </Typography>
          </Grid>
        )}
      </Grid>
    );
  }

  if (isTablet) {
    return (
      <Grid
        container
        component="header"
        alignItems="center"
        spacing={2}
        columns={12}
        style={{ marginTop: resetMarginTop, marginLeft: resetMarginLeft }}
      >
        <Grid item container columns={12} xs={12} rowSpacing={0} columnSpacing={1}>
          <Grid item xs="auto">
            <EventPageFilters filters={filters} onFilterChange={onFilterChange} />
          </Grid>
          <Grid item display="flex" justifyContent="space-between" flex={1}>
            <EventFilterButtonBar filters={filters} onFilterChange={onFilterChange} />
            <CreateNewMeetingButton />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h1'} component={'h2'}>
            {t('dashboard-events-my-meetings')}
          </Typography>
          {isContainingRecurringEvents && (
            <Typography variant="h2" component={'h2'} mt={2}>
              {t('dashboard-events-note-limited-view')}
            </Typography>
          )}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid
      container
      component="header"
      alignItems="center"
      spacing={2}
      columns={12}
      style={{ marginTop: resetMarginTop, marginLeft: resetMarginLeft }}
    >
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <EventFilterButtonBar filters={filters} onFilterChange={onFilterChange} />
        <CreateNewMeetingButton />
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-events-my-meetings')}
        </Typography>
        {isContainingRecurringEvents && (
          <Typography variant="h2" component={'h2'} mt={2}>
            {t('dashboard-events-note-limited-view')}
          </Typography>
        )}
      </Grid>
      <Grid item xs={12}>
        <EventPageFilters filters={filters} visuallyDivide onFilterChange={onFilterChange} />
      </Grid>
    </Grid>
  );
};

export default EventsPageHeader;
