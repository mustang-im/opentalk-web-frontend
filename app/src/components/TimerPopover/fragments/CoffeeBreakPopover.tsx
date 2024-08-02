// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography, Stack } from '@mui/material';
import { CoffeeBreakIcon as CoffeeBreakIconDefault } from '@opentalk/common';
import { TimerStyle } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectTimerActive } from '../../../store/slices/timerSlice';
import TimerDuration from '../../TimerTab/fragments/TimerDuration';
import { Container } from './Container';

const CoffeeBreakIcon = styled(CoffeeBreakIconDefault)(({ theme }) => ({
  height: '4rem',
  width: 'auto',
  fill: theme.palette.secondary.light,
}));

const CoffeeBreakPopover = () => {
  const { t } = useTranslation();
  const timerActive = useAppSelector(selectTimerActive);

  return (
    <Container open={Boolean(timerActive)} role="dialog" aria-labelledby="transition-modal-title">
      <Stack alignItems="center" spacing={1}>
        <Typography id="transition-modal-title" variant="h5" component="h2">
          {t('coffee-break-popover-title')}
        </Typography>

        <CoffeeBreakIcon />

        <TimerDuration alignItems="center" style={TimerStyle.CoffeeBreak} />
      </Stack>
    </Container>
  );
};

export default CoffeeBreakPopover;
