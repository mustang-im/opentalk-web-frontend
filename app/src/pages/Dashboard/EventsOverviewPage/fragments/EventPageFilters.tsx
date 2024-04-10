// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MenuItem, Select, Stack, styled } from '@mui/material';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { TimePerspectiveFilter } from '../../../../utils/eventUtils';
import { DashboardEventsFilters, FilterChangeCallbackType, TimeFilter } from '../types';

type EventPageFiltersProps = {
  filters: DashboardEventsFilters;
  visuallyDivide?: boolean;
  onFilterChange: FilterChangeCallbackType;
};

const timePerspectiveFilterOptions: Array<TimePerspectiveFilter> = [
  TimePerspectiveFilter.TimeIndependent,
  TimePerspectiveFilter.Future,
  TimePerspectiveFilter.Past,
];

const timeFilterOptions: Array<TimeFilter> = [TimeFilter.Month, TimeFilter.Week, TimeFilter.Day];

const CustomSelect = styled(Select)({
  '& .MuiSelect-icon': {
    padding: 0,
  },
});

export const EventPageFilters = ({ filters, onFilterChange, visuallyDivide }: EventPageFiltersProps) => {
  const { t } = useTranslation();

  const showTimePerspectiveFilter = useMemo(() => {
    return [TimePerspectiveFilter.Future, TimePerspectiveFilter.Past].includes(filters.timePerspective);
  }, [filters.timePerspective]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      justifyContent={visuallyDivide ? 'space-between' : undefined}
    >
      <CustomSelect
        value={filters.timePerspective}
        onChange={(e) => onFilterChange('timePerspective', e.target.value as TimePerspectiveFilter)}
      >
        {timePerspectiveFilterOptions.map((option) => {
          return (
            <MenuItem key={option} value={option}>
              {t(`dashboard-meeting-details-page-${option}`)}
            </MenuItem>
          );
        })}
      </CustomSelect>
      {showTimePerspectiveFilter && (
        <CustomSelect
          value={filters.timePeriod}
          onChange={(e) => onFilterChange('timePeriod', e.target.value as TimeFilter)}
        >
          {timeFilterOptions.map((option) => {
            return (
              <MenuItem key={option} value={option}>
                {t(`global-${option}`)}
              </MenuItem>
            );
          })}
        </CustomSelect>
      )}
    </Stack>
  );
};
