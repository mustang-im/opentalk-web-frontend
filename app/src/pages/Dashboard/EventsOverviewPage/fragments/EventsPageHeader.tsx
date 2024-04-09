// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Grid, Typography, useMediaQuery, useTheme } from '@mui/material';
import { InviteIcon, FavoriteIcon, SearchIcon, AddIcon, Toggle } from '@opentalk/common';
import { DateTime } from '@opentalk/rest-api-rtk-query';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardEventsFilters } from '../EventsOverviewPage';
import { EventPageFilters, TimeFilter } from './EventPageFilters';
import { EventPageFilterButtons } from './EventPageFilterButtons';
import { CreateNewMeetingButton } from './CreateNewButton';

export { TimeFilter };

export interface DashboardEventsFilters {
  timePeriod: TimeFilter;
  timeMin?: DateTime;
  timeMax?: DateTime;
  openInvitedMeeting?: boolean;
  favoriteMeetings?: boolean;
}

export enum TimeFilter {
  Month = 'month',
  Week = 'week',
  Day = 'day',
}

interface ToggleOptionsProps {
  value: DashboardEventsFilters['timePeriod'];
  label: string;
}

interface EventsPageHeaderProps {
  filter: DashboardEventsFilters;
  onFilterChange: <K extends keyof DashboardEventsFilters>(key: K, value?: DashboardEventsFilters[K]) => void;
}

const EventsPageHeader = ({ onFilterChange, filter }: EventsPageHeaderProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));
  const isTablet = useMediaQuery(theme.breakpoints.between('md', 'xl'));

  if (isDesktop) {
    return (
      <Grid
        container
        component="header"
        rowSpacing={0}
        columnSpacing={2}
        alignItems="center"
        columns={12}
      >
        <Grid item container xs="auto" display="flex" justifyContent="space-between" alignItems="center" gap={2} zeroMinWidth>
          <Typography variant={'h1'} component={'h2'}>
            {t('dashboard-events-my-meetings')}
          </Typography>
          <EventPageFilters
            timePerspectiveFilterValue={filter.timePerspective}
            timeFilterValue={filter.timePeriod}
          />
        </Grid>
        <Grid item display="flex" justifyContent="space-between" flex={1} zeroMinWidth>
          <EventPageFilterButtons />
          <CreateNewMeetingButton />
        </Grid>
      </Grid>
    )
  }

  if (isTablet) {
    return (
      <Grid
        container
        component="header"
        alignItems="center"
        spacing={2}
        columns={12}
      >
        <Grid item container columns={12} xs={12} rowSpacing={0} columnSpacing={1}>
          <Grid item xs="auto">
            <EventPageFilters
              timePerspectiveFilterValue={filter.timePerspective}
              timeFilterValue={filter.timePeriod}
            />
          </Grid>
          <Grid item display="flex" justifyContent="space-between" flex={1}>
            <EventPageFilterButtons />
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
    <Grid
      container
      component="header"
      alignItems="center"
      spacing={2}
      columns={12}
    >
      <Grid item xs={12} display="flex" justifyContent="space-between">
        <EventPageFilterButtons />
        <CreateNewMeetingButton />
      </Grid>
      <Grid item xs={12}>
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-events-my-meetings')}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <EventPageFilters
          timePerspectiveFilterValue={filter.timePerspective}
          timeFilterValue={filter.timePeriod}
          visuallyDivide
        />
      </Grid>
    </Grid>
  );

  // return (
  //   // <Grid container direction={'row'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
  //     {/* <Grid
  //       item
  //       container
  //       lg={8}
  //       md={10}
  //       direction={{ xs: 'column-reverse', sm: 'row' }}
  //       spacing={2}
  //       justifyContent={'flex-end'}
  //     >
  //       <Grid item>
  //         <Stack spacing={2} direction={'row'}>
  //           <Tooltip placement="top" title={inviteButtonTooltip}>
  //             <IconButtonBig
  //               color={'secondary'}
  //               active={filter.openInvitedMeeting}
  //               size={'large'}
  //               onClick={() => onFilterChange('openInvitedMeeting')}
  //             >
  //               <InviteIcon />
  //             </IconButtonBig>
  //           </Tooltip>
  //           <Tooltip placement="top" title={favoriteButtonTooltip}>
  //             <IconButtonBig
  //               data-testid="favoriteMeeting"
  //               active={filter.favoriteMeetings}
  //               color={'secondary'}
  //               size={'large'}
  //               onClick={() => onFilterChange('favoriteMeetings')}
  //             >
  //               <FavoriteIcon />
  //             </IconButtonBig>
  //           </Tooltip>
  //           {!isDesktop && (
  //             <>
  //               <IconButtonBig color={'secondary'} size={'large'} disabled>
  //                 <SearchIcon />
  //               </IconButtonBig>

  //               <Button
  //                 color={'secondary'}
  //                 component={Link}
  //                 to={'/dashboard/meetings/create'}
  //                 state={{ ...getReferrerRouterState(window.location) }}
  //               >
  //                 <AddIcon />
  //               </Button>
  //             </>
  //           )}
  //         </Stack>
  //       </Grid>
  //       <Grid item>
  //         <Toggle
  //           options={toggleOptions}
  //           onChange={(timePeriod: DashboardEventsFilters['timePeriod']) => {
  //             onFilterChange('timePeriod', timePeriod);
  //           }}
  //         />
  //       </Grid>
  //     </Grid>

  //     {isDesktop && (
  //       <Grid item lg={4} md={2} textAlign={'end'}>
  //         <Button
  //           color={'secondary'}
  //           component={Link}
  //           to={'/dashboard/meetings/create'}
  //           size={'large'}
  //           startIcon={<AddIcon />}
  //           state={{
  //             ...getReferrerRouterState(window.location),
  //           }}
  //         >
  //           {t('dashboard-plan-new-meeting')}
  //         </Button>
  //       </Grid>
  //     )} */}
  //   // </Grid>
  // );
};

export default EventsPageHeader;
