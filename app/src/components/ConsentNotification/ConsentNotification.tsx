// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Stack, Typography } from '@mui/material';
import { closeSnackbar, notificationAction } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { sendStreamConsentSignal } from '../../api/types/outgoing/streaming';
import localMediaContext from '../../modules/Media/LocalMedia';
import localScreenContext from '../../modules/Media/LocalScreen';
import { AppDispatch } from '../../store';

interface ConsentOptionsProps {
  onAcceptButton: () => void;
  onDeclineButton: () => void;
}

export const showConsentNotification = (dispatch: AppDispatch) =>
  new Promise((resolve) => {
    const key = 'consent-alert-dialog';

    const setRecordingConsent = (consent: boolean) => {
      dispatch(sendStreamConsentSignal.action({ consent }));
      closeSnackbar(key);
      if (!consent) {
        localMediaContext.reconfigure({ audio: false, video: false }).catch((e) => {
          console.error(`failed to switch off camera and mic when consent was denied: ${e}`);
        });
        localScreenContext.release();
      }
      resolve(consent);
    };

    notificationAction({
      key: key,
      persist: true,
      variant: 'warning',
      hideCloseButton: true,
      msg: (
        <ConsentOptions
          onAcceptButton={() => setRecordingConsent(true)}
          onDeclineButton={() => setRecordingConsent(false)}
        />
      ),
    });
  });

const ConsentOptions = ({ onAcceptButton, onDeclineButton }: ConsentOptionsProps) => {
  const { t } = useTranslation();
  return (
    <Stack spacing={1}>
      <Typography>{t('consent-message')}</Typography>
      <Box justifyContent="end" display="flex" gap={1}>
        <Button variant="contained" color="primary" onClick={onAcceptButton}>
          {t('consent-accept')}
        </Button>
        <Button variant="contained" color="secondary" onClick={onDeclineButton}>
          {t('consent-decline')}
        </Button>
      </Box>
    </Stack>
  );
};
