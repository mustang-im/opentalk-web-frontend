// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, Grid, Stack, styled, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/styles';
import { HelpIcon } from '@opentalk/common';
import React, { ReactNode, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import arrowImage from '../../assets/images/arrow-illustration.png';
import LocalVideo from '../../components/LocalVideo';
import { useAppSelector } from '../../hooks';
import { selectFeatures } from '../../store/slices/configSlice';
import { selectVideoEnabled } from '../../store/slices/mediaSlice';
import QuickStartPopper from '../QuickStartPopover';
import SpeedTest from '../SpeedTest';
import { EchoPlayBack } from './fragments/EchoPlayback';
import { SelfTestToolbar } from './fragments/SelfTestToolbar';

const SelfTestContainer = styled('div')(() => ({
  position: 'relative',
  padding: 0,
  width: '100%',
  maxWidth: '1200px',

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

const HelpIconButton = styled(Button)(({ theme }) => ({
  borderRadius: '50%',
  padding: theme.spacing(0.5),
  margin: theme.spacing(1, 1, 0, 0),
  minWidth: '10px',
  borderColor: theme.palette.common.white,
  zIndex: 2,
  '& .MuiSvgIcon-root': {
    color: theme.palette.common.white,
    fontSize: theme.typography.pxToRem(30),
  },
}));

const BottomContainer = styled('nav')(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(6),
  bottom: 0,
  left: 0,
  position: 'relative',
  zIndex: 1,
  [theme.breakpoints.up('md')]: {
    position: 'absolute',
  },
}));

const MonitorContainer = styled('main')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  aspectRatio: '16/9',

  '& h1, p': {
    color: theme.palette.secondary.contrastText,
  },
}));
interface SelftestProps {
  children: ReactNode;
  actionButton?: ReactNode;
  title?: string;
}

const SelfTest = ({ children, actionButton, title }: SelftestProps) => {
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const { joinWithoutMedia } = useAppSelector(selectFeatures);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const quickTestIconRef = useRef(null);
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <SelfTestContainer>
      <Stack component="header" direction="row-reverse">
        <HelpIconButton
          aria-label={t('conference-quick-start-open')}
          variant="outlined"
          onClick={() => setShowQuickStart(true)}
          ref={quickTestIconRef}
        >
          <HelpIcon />
        </HelpIconButton>
        <QuickStartPopper
          onClose={() => setShowQuickStart(false)}
          open={showQuickStart}
          variant="lobby"
          anchorEl={quickTestIconRef.current}
        />
        <SpeedTestContainer>
          <SpeedTest />
        </SpeedTestContainer>
      </Stack>
      <MonitorContainer>
        {videoEnabled ? (
          <LocalVideo noRoundedCorners hideUserName />
        ) : (
          <>
            {title && (
              <Typography
                variant="h2"
                textAlign={'center'}
                color={theme.palette.common.white}
                marginBottom={theme.spacing(5)}
                component="h1"
              >
                {t('joinform-room-title', { title })}
              </Typography>
            )}
            <Typography
              variant="h1"
              textAlign={'center'}
              fontSize={'2.9rem'}
              lineHeight={'2.9rem'}
              mb={2}
              component="h2"
              color={theme.palette.common.white}
            >
              {t('selftest-header')}
            </Typography>
            <Typography textAlign={'center'} fontSize={'1.37rem'}>
              {joinWithoutMedia ? t('selftest-body-do-test') : t('selftest-body')}
            </Typography>
          </>
        )}
        <EchoPlayBack />
      </MonitorContainer>
      <BottomContainer>
        <Grid container direction="row" justifyContent="center" alignItems="center" spacing={2}>
          <Grid item>{children}</Grid>
          <Grid item>
            <SelfTestToolbar actionButton={actionButton} />
          </Grid>
        </Grid>
      </BottomContainer>
    </SelfTestContainer>
  );
};

export default SelfTest;
