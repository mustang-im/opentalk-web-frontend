// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { CoffeeBreakIcon as CoffeeBreakIconDefault, TimerStyle } from '@opentalk/common';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as LogoIconDefault } from '../../../assets/images/logo.svg';
import { useAppSelector } from '../../../hooks';
import { selectTimerRunning, selectTimerStyle } from '../../../store/slices/timerSlice';
import { selectIsCoffeeBreakOpen } from '../../../store/slices/uiSlice';
import CoffeeBreakTimer from './CoffeeBreakTimer';

const LogoIcon = styled(LogoIconDefault)(({ theme }) => ({
  height: '2rem',
  width: '9rem',
  fill: theme.palette.primary.main,
}));

const CoffeeBreakIcon = styled(CoffeeBreakIconDefault)(({ theme }) => ({
  height: '6rem',
  width: 'auto',
  fill: theme.palette.secondary.light,
  position: 'relative',
  left: '1rem',
}));

const Content = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
});

export interface CoffeeBreakAnnounceProps {
  handleClose: () => void;
}

export const CoffeeBreakAnnounce = memo(({ handleClose }: CoffeeBreakAnnounceProps) => {
  const { t } = useTranslation();
  const isTimerRunning = useAppSelector(selectTimerRunning);
  const timerStyle = useAppSelector(selectTimerStyle);
  const isCoffeeBreakOpen = useAppSelector(selectIsCoffeeBreakOpen);

  return (
    <>
      <LogoIcon />

      <Content>
        {isTimerRunning && isCoffeeBreakOpen && <CoffeeBreakIcon />}

        <Typography variant="h3" component="h2">
          {isTimerRunning && isCoffeeBreakOpen ? t('coffee-break-layer-title') : t('coffee-break-stopped-title')}
        </Typography>

        {isTimerRunning && timerStyle === TimerStyle.CoffeeBreak && <CoffeeBreakTimer />}

        <Button onClick={handleClose}>{t('coffee-break-layer-button')}</Button>
      </Content>
    </>
  );
});
