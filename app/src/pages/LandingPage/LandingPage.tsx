// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled } from '@mui/material';
import { Logo } from '@opentalk/common';
import { useAuthContext } from '@opentalk/redux-oidc';
import pkceChallenge from 'pkce-challenge';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import ImprintContainer from '../../components/ImprintContainer';
import JoinMeetingDialog from '../../components/JoinMeetingDialog';

const Container = styled(Stack)({
  display: 'flex',
  justifySelf: 'center',
  justifyContent: 'center',
  alignItems: 'center',
  maxWidth: 500,
});

const ButtonGroup = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.common.white,
  padding: theme.spacing(4),
  width: '30em',
  [theme.breakpoints.down('md')]: {
    maxWidth: '80vw',
  },
}));

export const LandingPage = () => {
  const auth = useAuthContext();
  const { t } = useTranslation();

  const [codeChallenge, setCodeChallenge] = useState<string | undefined>();

  useEffect(() => {
    const generateCodeChallenge = async () => {
      try {
        const { code_challenge, code_verifier } = await pkceChallenge();
        sessionStorage.setItem('code_verifier', code_verifier);
        setCodeChallenge(code_challenge);
      } catch (error) {
        console.error('Error generating code challenge:', error);
      }
    };
    generateCodeChallenge();
  }, []);

  const handleSignIn = useCallback(() => {
    auth?.signIn('/dashboard', codeChallenge);
  }, [auth, codeChallenge]);

  return (
    <>
      <Container spacing={1}>
        <Logo width="15em" height="5em" />
        <ButtonGroup spacing={2}>
          <JoinMeetingDialog />
          <Button onClick={handleSignIn} disabled={!auth}>
            {t('dashboard-sign-in')}
          </Button>
        </ButtonGroup>
      </Container>

      <ImprintContainer />
    </>
  );
};
