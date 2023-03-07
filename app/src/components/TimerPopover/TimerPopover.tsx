// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Typography, Popover as MuiPopover } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import { useCallback } from 'react';
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
import TimerNormalCounter from '../TimerTab/fragments/TimerNormalCounter';

const Popover = styled(MuiPopover)(({ theme }) => ({
  pointerEvents: 'none',

  '& .MuiPaper-root': {
    padding: theme.spacing(2, 4),
    pointerEvents: 'all',
  },
}));

const TimerPopover = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const userId = useAppSelector(selectOurUuid);
  const timerId = useAppSelector(selectTimerId);
  const timerTitle = useAppSelector(selectTimerTitle);
  const timerRunning = useAppSelector(selectTimerRunning);
  const timerStartTime = useAppSelector(selectTimerStartedAt);
  const hasReadyCheckEnabled = useAppSelector(selectReadyCheckEnabled);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const isUserReady = participantsAreReady.includes(userId as ParticipantId);

  const handleDone = useCallback(() => {
    if (timerStartTime && timerId) {
      dispatch(readyToContinue.action({ timerId, status: !isUserReady }));
    }
  }, [timerStartTime, timerId, isUserReady]);

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
        <TimerNormalCounter />
        {hasReadyCheckEnabled && (
          <Button onClick={handleDone} color={isUserReady ? 'secondary' : 'primary'}>
            {t(`timer-popover-button-${isUserReady ? 'not-' : ''}done`)}
          </Button>
        )}
      </Stack>
    </Popover>
  );
};

export default TimerPopover;
