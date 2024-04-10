import { IconButton, Stack, Tooltip, styled } from '@mui/material';
import { SearchIcon } from '@opentalk/common';
import { FavoriteIcon } from '@opentalk/common';
import { InviteIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { DashboardEventsFilters, FilterChangeCallbackType } from '../types';

const IconButtonBig = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'active' })<{ active?: boolean }>(
  ({ theme, active }) => ({
    color: active ? theme.palette.text.secondary : '',
    backgroundColor: active ? theme.palette.secondary.main : '',
    '.MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(23),
    },
  })
);

type EventPageFilterButtonsProps = {
  filters: DashboardEventsFilters;
  onFilterChange: FilterChangeCallbackType;
};

export const EventPageFilterButtons = ({ filters, onFilterChange }: EventPageFilterButtonsProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <Tooltip placement="top" title={t('dashboard-events-filter-by-invites')}>
        <IconButtonBig
          data-testid="filter-by-invites"
          color="secondary"
          active={filters.openInvitedMeeting}
          aria-pressed={filters.openInvitedMeeting}
          size="large"
          onClick={() => onFilterChange('openInvitedMeeting', !filters.openInvitedMeeting)}
        >
          <InviteIcon />
        </IconButtonBig>
      </Tooltip>
      <Tooltip placement="top" title={t('dashboard-events-filter-by-favorites')}>
        <IconButtonBig
          data-testid="favoriteMeeting"
          active={filters.favoriteMeetings}
          aria-pressed={filters.favoriteMeetings}
          color="secondary"
          size="large"
          onClick={() => onFilterChange('favoriteMeetings', !filters.favoriteMeetings)}
        >
          <FavoriteIcon />
        </IconButtonBig>
      </Tooltip>
      <IconButtonBig color="secondary" size="large" disabled>
        <SearchIcon />
      </IconButtonBig>
    </Stack>
  );
};
