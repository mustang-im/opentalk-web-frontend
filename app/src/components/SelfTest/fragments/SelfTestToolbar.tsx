// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, styled } from '@mui/material';
import React, { ReactNode } from 'react';

import browser from '../../../modules/BrowserSupport';
import AudioButton from '../../Toolbar/fragments/AudioButton';
import BlurScreenButton from '../../Toolbar/fragments/BlurScreenButton';
import VideoButton from '../../Toolbar/fragments/VideoButton';

const GridContainer = styled(Grid)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    //Removes negative margin that is default added from MUI
    marginTop: theme.spacing(0),
    '& .MuiGrid-root.MuiGrid-item': {
      paddingTop: 0,
    },
  },
}));

interface SelfTestToolbarProps {
  actionButton?: ReactNode;
}

export const SelfTestToolbar = ({ actionButton }: SelfTestToolbarProps) => (
  <GridContainer
    container
    item
    direction="row"
    spacing={2}
    sm={12}
    md="auto"
    alignItems="stretch"
    justifyContent="center"
  >
    <Grid container item direction="row" sm={12} md="auto" gap={2} justifyContent="center">
      <AudioButton isLobby />
      <VideoButton isLobby />
      {!browser.isSafari() && <BlurScreenButton isLobby />}
    </Grid>
    <Grid item xs={12} sm="auto" justifyItems="center" flexBasis="auto">
      {actionButton}
    </Grid>
  </GridContainer>
);
