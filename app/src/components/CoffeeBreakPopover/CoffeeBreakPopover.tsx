// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography, Popover as MuiPopover, Box } from '@mui/material';
import { CoffeeBreakIcon as CoffeeBreakIconDefault } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { selectTimerRunning } from '../../store/slices/timerSlice';
import TimerNormalCounter from '../TimerTab/fragments/TimerNormalCounter';

const Popover = styled(MuiPopover)(({ theme }) => ({
  pointerEvents: 'none',

  '& .MuiPaper-root': {
    padding: theme.spacing(2, 4),
    pointerEvents: 'all',
  },
}));

const Content = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
});

const CoffeeBreakIcon = styled(CoffeeBreakIconDefault)(({ theme }) => ({
  height: '4rem',
  width: 'auto',
  fill: theme.palette.secondary.light,
}));

const CoffeeBreakPopover = ({ anchorEl }: { anchorEl: HTMLElement | null }) => {
  const { t } = useTranslation();
  const timerRunning = useAppSelector(selectTimerRunning);

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
      <Content>
        <Typography id="transition-modal-title" variant="h5" component="h2">
          {t('coffee-break-layer-title')}
        </Typography>

        <CoffeeBreakIcon />

        <TimerNormalCounter alignItems="center" />
      </Content>
    </Popover>
  );
};

export default CoffeeBreakPopover;
