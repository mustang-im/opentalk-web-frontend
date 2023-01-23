// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Typography, Popover as MuiPopover } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { readyToContinue } from '../../api/types/outgoing/timer';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  selectParticipantsReady,
  selectReadyCheckEnabled,
  selectTimerStartedAt,
  selectTimerId,
  selectTimerTitle,
  selectTimerRunning,
} from '../../store/slices/timerSlice';
import { selectOurUuid } from '../../store/slices/userSlice';
import TimerCounter from '../TimerTab/fragments/TimerCounter';

const Popover = styled(MuiPopover)(({ theme }) => ({
  pointerEvents: 'none',

  '& .MuiPaper-root': {
    padding: theme.spacing(2, 4),
    pointerEvents: 'all',
  },
}));

const TimerPopover = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const timerStartTime = useAppSelector(selectTimerStartedAt);
  const timerTitle = useAppSelector(selectTimerTitle);
  const hasReadyCheckEnabled = useAppSelector(selectReadyCheckEnabled);
  const timerId = useAppSelector(selectTimerId);
  const dispatch = useAppDispatch();
  const timerRunning = useAppSelector(selectTimerRunning);
  const { t } = useTranslation();
  const userId = useAppSelector(selectOurUuid);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const isUserReady = participantsAreReady.includes(userId as ParticipantId);

  const handleDone = () => {
    if (timerStartTime && timerId) {
      dispatch(readyToContinue.action({ timerId, status: !isUserReady }));
    }
  };

  return (
    <Popover
      anchorEl={anchorEl}
      open={timerRunning}
      hideBackdrop
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      disableEnforceFocus
    >
      <Stack spacing={2}>
        <Typography variant="h1">{t('timer-popover-title')}</Typography>
        {timerTitle && <Typography variant="h2">{timerTitle}</Typography>}
        <TimerCounter />
        {hasReadyCheckEnabled && (
          <Button color={isUserReady ? 'secondary' : 'primary'} onClick={handleDone}>
            {t(`timer-popover-button-${isUserReady ? 'not-' : ''}done`)}
          </Button>
        )}
      </Stack>
    </Popover>
  );
};

export default TimerPopover;
