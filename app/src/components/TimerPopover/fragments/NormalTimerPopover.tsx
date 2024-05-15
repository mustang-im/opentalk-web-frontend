// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Typography, Popover as MuiPopover } from '@mui/material';
import { TimerStyle } from '@opentalk/common';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { readyToContinue } from '../../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  selectParticipantsReady,
  selectReadyCheckEnabled,
  selectTimerId,
  selectTimerTitle,
} from '../../../store/slices/timerSlice';
import { selectOurUuid } from '../../../store/slices/userSlice';
import TimerDuration from '../../TimerTab/fragments/TimerDuration';

const Popover = styled(MuiPopover)(({ theme }) => ({
  pointerEvents: 'none',

  '& .MuiPaper-root': {
    padding: theme.spacing(2, 4),
    pointerEvents: 'all',
  },
}));

const NormalTimerPopover = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectOurUuid);
  const timerId = useAppSelector(selectTimerId);
  const timerTitle = useAppSelector(selectTimerTitle);
  const hasReadyCheckEnabled = useAppSelector(selectReadyCheckEnabled);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const isUserReady = userId && participantsAreReady.includes(userId);

  const handleDone = useCallback(() => {
    if (timerId) {
      dispatch(readyToContinue.action({ timerId, status: !isUserReady }));
    }
  }, [timerId, isUserReady]);

  return (
    <Popover
      anchorEl={anchorEl}
      open={Boolean(timerId)}
      hideBackdrop
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableEnforceFocus
    >
      {/* 
        FIXME: this should technically be an alert, but screenreader cannot match the countdown speed,
        while it is pronouncing the remaining time, the countdown is already over.
      */}
      <Stack spacing={2} role="dialog" aria-label={timerTitle || t('timer-popover-title')}>
        <Typography variant="h1">{t('timer-popover-title')}</Typography>
        {timerTitle && <Typography variant="h2">{timerTitle}</Typography>}
        <TimerDuration style={TimerStyle.Normal} />
        {hasReadyCheckEnabled && (
          // When timer popover is open we want to focus it so screen reader can tell the content.
          /* eslint-disable jsx-a11y/no-autofocus */
          <Button onClick={handleDone} color={isUserReady ? 'secondary' : 'primary'} autoFocus>
            {t(`timer-popover-button-${isUserReady ? 'not-' : ''}done`)}
          </Button>
        )}
      </Stack>
    </Popover>
  );
};

export default NormalTimerPopover;
