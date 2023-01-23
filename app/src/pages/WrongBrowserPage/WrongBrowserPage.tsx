// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, Grid, styled, Typography, useTheme } from '@mui/material';
import { WarningIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import LobbyTemplate from '../../templates/LobbyTemplate';

const StyledLogoIcon = styled(Logo)({
  height: '2rem',
  width: '9rem',
  fill: 'white',
});

const CustomGrid = styled(Grid)({
  maxWidth: '35rem',
});

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  color: theme.palette.common.white,
}));

const WrongBrowserPage = () => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <LobbyTemplate blur>
      <Container>
        <CustomGrid container justifyContent={'center'} spacing={8}>
          <Grid item>
            <WarningIcon fill={theme.palette.common.white} sx={{ width: '6rem', height: '6rem' }} />
          </Grid>

          <Grid item container spacing={2}>
            <Grid item xs={12}>
              <Typography textAlign={'center'} variant="h5" color={'inherit'}>
                {t('wrong-browser-title')}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography textAlign={'center'} variant="body2" color={'inherit'}>
                {t('wrong-browser-message')}
              </Typography>
            </Grid>
          </Grid>

          <Grid item container alignItems={'center'} direction={'column'} spacing={1}>
            <Grid item>
              <Typography variant="body1" color={'inherit'}>
                {t('wrong-browser-greeting')}
              </Typography>
            </Grid>
            <Grid item>
              <StyledLogoIcon />
            </Grid>
          </Grid>
        </CustomGrid>
      </Container>
    </LobbyTemplate>
  );
};

export default WrongBrowserPage;
