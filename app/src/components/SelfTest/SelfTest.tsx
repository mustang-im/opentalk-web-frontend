// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, Grid, Stack, styled, Typography } from '@mui/material';
import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import arrowImage from '../../assets/images/arrow-illustration.png';
import LocalVideo from '../../components/LocalVideo';
import Toolbar from '../../components/Toolbar';
import { useAppSelector } from '../../hooks';
import { selectFeatures } from '../../store/slices/configSlice';
import { selectVideoEnabled } from '../../store/slices/mediaSlice';
import SpeedTest from '../SpeedTest';
import { EchoPlayBack } from './fragments/EchoPlayback';

const SelfTestContainer = styled('div')(() => ({
  position: 'relative',
  width: '100%',

  //The blur should be part of the theme and handled globally
  backdropFilter: 'blur(100px)',
  WebkitBackdropFilter: 'blur(100px)',
  background: `rgba(0, 22, 35, 0.5) url(${arrowImage}) no-repeat 77% 67%`,
  backgroundSize: '10rem',
}));

const SpeedTestContainer = styled(MuiContainer)(({ theme }) => ({
  top: 0,
  left: 0,
  position: 'relative',
  padding: theme.spacing(6),
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
  },
}));

const BottomContainer = styled(MuiContainer)(({ theme }) => ({
  padding: theme.spacing(6),
  bottom: 0,
  left: 0,
  position: 'relative',
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
  },
}));

const MonitorContainer = styled(Stack)(({ theme }) => ({
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '16/9',

  '& h1, p': {
    color: theme.palette.secondary.contrastText,
  },
}));

const FormContainer = styled(Grid)(() => ({
  flex: '0 0 auto',
  alignItems: 'flex-start',
}));

interface SelftestProps {
  children: ReactNode;
}

const SelfTest = ({ children }: SelftestProps) => {
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const { joinWithoutMedia } = useAppSelector(selectFeatures);
  const { t } = useTranslation();

  return (
    <SelfTestContainer>
      <SpeedTestContainer>
        <SpeedTest />
      </SpeedTestContainer>
      <MonitorContainer>
        {videoEnabled ? (
          <LocalVideo noRoundedCorners hideUserName />
        ) : (
          <>
            <Typography variant="h1" textAlign={'center'} fontSize={'2.9rem'} lineHeight={'2.9rem'} mb={2}>
              {t('selftest-header')}
            </Typography>
            <Typography variant="body1" textAlign={'center'} fontSize={'1.37rem'}>
              {joinWithoutMedia ? t('selftest-body-do-test') : t('selftest-body')}
            </Typography>
          </>
        )}
        <EchoPlayBack />
      </MonitorContainer>
      <BottomContainer>
        <FormContainer container spacing={2}>
          <Grid item md={2} />
          <Grid item xs={12} md={5}>
            {children}
          </Grid>
          <Grid item xs={12} md={4} justifyContent="center">
            <Toolbar layout="lobby" />
          </Grid>
        </FormContainer>
      </BottomContainer>
    </SelfTestContainer>
  );
};

export default SelfTest;
