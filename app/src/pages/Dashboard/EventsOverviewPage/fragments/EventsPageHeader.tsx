// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { InviteIcon, FavoriteIcon, SearchIcon, AddIcon, Toggle } from '@opentalk/common';
import { DateTime } from '@opentalk/rest-api-rtk-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardEventsFilters, FilterChangeCallbackType, TimeFilter } from '../types';
import { CreateNewMeetingButton } from './CreateNewButton';
import { EventPageFilterButtons } from './EventPageFilterButtons';
import { EventPageFilters } from './EventPageFilters';

export { TimeFilter };

interface EventsPageHeaderProps {
  filters: DashboardEventsFilters;
  onFilterChange: FilterChangeCallbackType;
}

const EventsPageHeader = ({ onFilterChange, filters }: EventsPageHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));

  if (isDesktop) {
    return (
      <Grid container component="header" rowSpacing={0} columnSpacing={2} alignItems="center" columns={12}>
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
          <EventPageFilterButtons filters={filters} onFilterChange={onFilterChange} />
          <CreateNewMeetingButton />
        </Grid>
      </Grid>
    );
  }

  if (isTablet) {
    return (
      <Grid container component="header" alignItems="center" spacing={2} columns={12}>
        <Grid item container columns={12} xs={12} rowSpacing={0} columnSpacing={1}>
          <Grid item xs="auto">
            <EventPageFilters filters={filters} onFilterChange={onFilterChange} />
          </Grid>
          <Grid item display="flex" justifyContent="space-between" flex={1}>
            <EventPageFilterButtons filters={filters} onFilterChange={onFilterChange} />
            <CreateNewMeetingButton />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Typography variant={'h1'} component={'h2'}>
            {t('dashboard-events-my-meetings')}
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container component="header" alignItems="center" spacing={2} columns={12}>
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <EventPageFilterButtons filters={filters} onFilterChange={onFilterChange} />
        <CreateNewMeetingButton />
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-events-my-meetings')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <EventPageFilters filters={filters} visuallyDivide onFilterChange={onFilterChange} />
      </Grid>
    </Grid>
  );
};

export default EventsPageHeader;
