// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, CircularProgress, Box } from '@mui/material';
import { selectIsLoading, useAuth } from '@opentalk/react-redux-appauth';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';

const LoginButton = ({ fullWidth }: { fullWidth?: boolean }) => {
  const auth = useAuth();

  const { t } = useTranslation();
  const isLoading = useAppSelector(selectIsLoading);
  const signIn = useCallback(() => {
    if (!auth.isLoading) {
      localStorage.setItem('redirect-uri', window.location.pathname);
      auth.signIn();
    }
  }, [auth]);

  return (
    <Button onClick={signIn} fullWidth={fullWidth} disabled={auth.isLoading}>
      {isLoading && (
        <Box marginRight="1rem">
          <CircularProgress color={'inherit'} size={12} />
        </Box>
      )}
      <>{t('login-form-button-submit')}</>
    </Button>
  );
};

export default LoginButton;
