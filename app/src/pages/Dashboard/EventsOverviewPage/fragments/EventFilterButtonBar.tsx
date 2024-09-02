// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, Stack, Tooltip, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { FavoriteIcon, InviteIcon } from '../../../../assets/icons';
import { DashboardEventsFilters, FilterChangeCallbackType } from '../types';

const IconButtonBig = styled(IconButton, { shouldForwardProp: (prop) => prop !== 'active' })<{ active?: boolean }>(
  ({ theme, active }) => ({
    color: active ? theme.palette.text.secondary : '',
    backgroundColor: active ? theme.palette.secondary.main : '',
    borderRadius: theme.borderRadius.circle,
    width: '3rem',
    height: '3rem',
    '.MuiSvgIcon-root': {
      fontSize: '1.25rem',
    },
  })
);

type EventFilterButtonBarProps = {
  filters: DashboardEventsFilters;
  onFilterChange: FilterChangeCallbackType;
};

export const EventFilterButtonBar = ({ filters, onFilterChange }: EventFilterButtonBarProps) => {
  const { t } = useTranslation();

  return (
    <Stack direction="row" spacing={1}>
      <Tooltip placement="top" title={t('dashboard-events-filter-by-invites')}>
        <IconButtonBig
          data-testid="filter-by-invites"
          color="secondary"
          active={filters.openInvitedMeeting}
          aria-pressed={filters.openInvitedMeeting}
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
          onClick={() => onFilterChange('favoriteMeetings', !filters.favoriteMeetings)}
        >
          <FavoriteIcon />
        </IconButtonBig>
      </Tooltip>
    </Stack>
  );
};
