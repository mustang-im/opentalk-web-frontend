// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, useMediaQuery, useTheme } from '@mui/material';
import { AddIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import getReferrerRouterState from '../../../../utils/getReferrerRouterState';

export const CreateNewMeetingButton = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const isSmall = useMediaQuery(theme.breakpoints.down('md'));
  const isReallySmall = useMediaQuery('(max-width: 430px)');
  const showFullSizeButton = (isLarge || isSmall) && !isReallySmall;

  const commonProps = {
    color: 'secondary',
    to: '/dashboard/meetings/create',
    state: getReferrerRouterState(window.location),
    component: Link,
  } as const;

  if (!showFullSizeButton) {
    return (
      <Button {...commonProps} aria-label={t('dashboard-plan-new-meeting')}>
        <AddIcon />
      </Button>
    );
  }

  return (
    <Button {...commonProps} size="large" startIcon={<AddIcon />}>
      {t('dashboard-plan-new-meeting')}
    </Button>
  );
};
