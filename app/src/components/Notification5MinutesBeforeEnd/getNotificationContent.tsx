// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box } from '@mui/material';
import { styled } from '@mui/system';
import { CloseIcon, FeedbackIcon, IconButton, snackbarRef } from '@opentalk/common';
import { SnackbarKey } from '@opentalk/notistack';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AnimationTimerDown from './fragments/AnimationTimerDown';

const BoxContent = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(0, 4),
  height: '60px',
  padding: '0 30px',
  background: theme.palette.error.main,
}));

const BoxInteractive = styled(Box)({
  flex: '1',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const getNotificationContent = (
  setIsOpenNotification: (state: boolean) => void,
  minuteDefault: number,
  timesLeft: number[]
) => {
  return (key: SnackbarKey) => {
    const { t } = useTranslation();
    const [minute, setMinute] = useState(minuteDefault);

    const handleClose = useCallback(() => {
      setIsOpenNotification(false);
      snackbarRef.closeSnackbar(key);
    }, []);

    useEffect(() => {
      timesLeft.forEach((time) => {
        setTimeout(() => {
          setMinute((min) => min - 1);
        }, time);
      });
    }, []);

    return (
      <BoxContent>
        <Box display="flex" alignItems="center">
          <FeedbackIcon />
        </Box>
        <BoxInteractive>
          {minute > 1 && (
            <>
              <span>{t('closes-time-before-one-minute', { minute })}</span>

              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </>
          )}
          {minute === 1 && (
            <>
              <span>{t('closes-time-in-one-minute', { minute })}</span>
              <AnimationTimerDown />
            </>
          )}
        </BoxInteractive>
      </BoxContent>
    );
  };
};

export default getNotificationContent;
