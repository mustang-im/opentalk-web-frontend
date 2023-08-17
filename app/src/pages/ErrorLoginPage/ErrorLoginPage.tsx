// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, CssBaseline, Stack, styled, ThemeProvider, useTheme } from '@mui/material';
import { WarningIcon } from '@opentalk/common';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import { createOpenTalkTheme } from '../../assets/themes/opentalk';
import Error from '../../commonComponents/Error';
import LoginButton from '../../components/LoginPopup/fragments/LoginButton';
import { useAppDispatch } from '../../hooks';
import { hangUp } from '../../store/commonActions';
import LobbyTemplate from '../../templates/LobbyTemplate';

const StyledLogoIcon = styled(Logo)({
  height: '2rem',
  width: '9rem',
  fill: 'white',
});

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
}));

interface ErrorLoginProps {
  error: Error;
}

const ErrorLoginPage = ({ error }: ErrorLoginProps) => {
  const [displayLogin, setDisplayLogin] = useState<boolean>(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(hangUp());
  }, [dispatch]);

  const errorDetails = useMemo(() => {
    switch (error.name) {
      case 'error_session_expired':
        setDisplayLogin(true);
        return {
          name: t('error-session-expired'),
          message: t('error-session-expired-message'),
        };
      case 'error_oidc_configuration':
        return {
          name: t('error-oidc-configuration'),
          message: t('error-oidc-configuration-message'),
        };
      default:
        console.error('unknown login error:', error);
        return {
          name: t('error-general'),
        };
    }
  }, [error, t]);

  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <CssBaseline />
      <LobbyTemplate blur>
        <Container>
          <Stack spacing={8} alignItems="center">
            <WarningIcon fill={theme.palette.common.white} sx={{ width: '6rem', height: '6rem' }} />
            {errorDetails && <Error title={errorDetails.name} description={errorDetails.message} />}
            {displayLogin && <LoginButton />}
            <StyledLogoIcon />
          </Stack>
        </Container>
      </LobbyTemplate>
    </ThemeProvider>
  );
};

export default ErrorLoginPage;
