// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import { selectIsLoading } from '@opentalk/react-redux-appauth';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import LoginButton from './fragments/LoginButton';

const LoginPopup = () => {
  const { t } = useTranslation();
  const isLoading = useAppSelector(selectIsLoading);

  const renderLoginText = () => {
    if (isLoading) {
      return t('login-form-body-loading');
    }
    return t('login-form-body');
  };

  return (
    <Dialog aria-labelledby="customized-dialog-title" open fullWidth maxWidth={'xs'}>
      <DialogTitle>{t('login-form-title')}</DialogTitle>
      <DialogContent>
        <Typography variant={'body2'}>{renderLoginText()}</Typography>
      </DialogContent>

      <DialogActions>
        <LoginButton fullWidth />
      </DialogActions>
    </Dialog>
  );
};
export default LoginPopup;
