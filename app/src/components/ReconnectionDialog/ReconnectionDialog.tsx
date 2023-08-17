// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppDispatch } from '../../hooks';
import { abortedReconnection } from '../../store/slices/roomSlice';

const ReconnectionDialog = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  function abort() {
    dispatch(abortedReconnection());
  }

  return (
    <Dialog open fullWidth maxWidth={'xs'}>
      <DialogTitle>{t('reconnection-loop-dialogbox-title')}</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <CircularProgress />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button fullWidth onClick={abort}>
          {t('reconnection-loop-abort-button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReconnectionDialog;
