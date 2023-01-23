// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import ndt7 from '@m-lab/ndt7';
import {
  Dialog as MuiDialog,
  Button,
  Grid,
  styled,
  DialogTitle,
  IconButton,
  Typography,
  DialogContent,
  DialogActions,
  alpha,
} from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import React, { useCallback, useState, Fragment } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectSpeedTestConfig } from '../../store/slices/configSlice';
import {
  setSpeedDownload,
  setSpeedUpload,
  setSpeedLatency,
  selectLatency,
  selectDownload,
  selectUpload,
  initSpeedMeter,
} from '../../store/slices/speedMeterSlice';
import TestIcon from './fragments/TestIcon';

const goodDownloadMbs = 15;
const slowDownloadMbs = 5;
const goodUploadMbs = 2;
const slowUploadMbs = 1;
const goodLatency = 200;
const slowLatency = 1000;

const ExpandingContainer = styled(Grid, {
  shouldForwardProp: (prop) => prop !== 'visible',
})<{ visible: boolean }>(({ visible, theme }) => ({
  paddingTop: theme.spacing(2),
  overflow: 'hidden',
  maxHeight: visible ? '25rem' : 0,
  transitionDelay: '100ms',
  transition: 'all 600ms ease-out',
  paddingBottom: theme.spacing(1),
}));

const GridDiv = styled('div')({
  width: '12rem',
  display: 'grid',
  gridTemplateColumns: '50% 30% 20%',
});

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  borderRadius: '100%',
  right: theme.spacing(2),
  top: theme.spacing(2),

  '& svg': {
    fill: theme.palette.common.black,
    width: '0.75em',
    height: '0.75em',
  },
}));

const CTAButton = styled(Button)(({ theme }) => ({
  color: theme.palette.text.secondary,
  borderColor: theme.palette.outline,
  backgroundColor: alpha(theme.palette.secondary.dark, 0.5),
  zIndex: 1,
  ':hover': {
    borderColor: theme.palette.common.white,
    backgroundColor: alpha(theme.palette.secondary.main, 0.5),
  },
}));

const IconContainer = styled(Grid, {
  shouldForwardProp: (prop) => !['testCompleted', 'testResult', 'fill'].includes(prop as string),
})<{ fill: string; testCompleted: boolean; testResult: number }>(({ theme, fill, testCompleted, testResult }) => ({
  justifyContent: 'center',
  fill: fill,
  '& svg': {
    width: '6rem',
    height: '6rem',
    borderRadius: '100%',
    backgroundColor: !testCompleted
      ? 'rgba(0,0,0,0.1)'
      : [theme.palette.error.main, theme.palette.warning.main, theme.palette.success.main][testResult],
    padding: theme.spacing(3),
  },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.secondary.dark,
}));

const Dialog = styled(MuiDialog)({
  '& .MuiDialog-paper': {
    width: '20rem',
  },
});

const enum SessionState {
  Initializing = 0,
  Running = 1,
  Completed = 2,
  Error = 3,
}

const ResultDiv = styled('div', {
  shouldForwardProp: (prop) => prop !== 'quality',
})<{ quality: number }>(({ theme, quality }) => ({
  color: [theme.palette.error.main, '#ff9300', theme.palette.success.main][quality],
  fontWeight: 'bold',
}));

const SpeedTest = () => {
  const [testState, setTestState] = useState<SessionState>(SessionState.Initializing);
  const [showDialog, setShowDialog] = useState(false);
  const downloadState = useAppSelector(selectDownload);
  const uploadState = useAppSelector(selectUpload);
  const latencyState = useAppSelector(selectLatency);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const config = useAppSelector(selectSpeedTestConfig);
  const testCompleted = testState === SessionState.Completed;

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
    startTest();
  };

  const startTest = useCallback(() => {
    setTestState(SessionState.Initializing);
    dispatch(initSpeedMeter());
    const latencyList: number[] = [];
    ndt7
      .test(
        {
          userAcceptedDataPolicy: true,
          downloadworkerfile: config.ndtDownloadWorkerJs,
          uploadworkerfile: config.ndtUploadWorkerJs,
          // if server attribute is missing an automatic public server discovery will start
          server: config.ndtServer,
        },
        {
          downloadStart: function () {
            setTestState(SessionState.Running);
          },
          downloadMeasurement: function (data: typeof ndt7) {
            if (data.Source === 'server') {
              latencyList.push(data.Data.TCPInfo.MinRTT);
            }
          },
          downloadComplete: function (data: typeof ndt7) {
            if (data.LastClientMeasurement) {
              dispatch(setSpeedDownload(data.LastClientMeasurement.MeanClientMbps));
            }
          },
          uploadComplete: function (data: typeof ndt7) {
            if (data.LastClientMeasurement) {
              dispatch(setSpeedUpload(data.LastClientMeasurement.MeanClientMbps));
            }
          },
          error: function () {
            setTestState(SessionState.Error);
          },
        }
      )
      .then(() => {
        let latency: number | undefined = undefined;
        if (latencyList.length > 0) {
          const sum = latencyList.reduce((a, b) => a + b, 0);
          const avg = sum / latencyList.length;
          latency = Math.floor(avg * 0.001); // latency is in microseconds
        }
        dispatch(setSpeedLatency(latency));
        setTestState(SessionState.Completed);
      });
  }, [dispatch, config]);

  const getMessage = () => {
    let resultMessage;
    switch (testState) {
      case SessionState.Initializing:
        resultMessage = t('speed-meter-init-message');
        break;
      case SessionState.Running:
        resultMessage = t('speed-meter-started-message');
        break;
      case SessionState.Completed:
        resultMessage = testResult() ? t('speed-meter-stable-message') : t('speed-meter-slow-message');
        break;
      case SessionState.Error:
        resultMessage = t('speed-meter-error-message');
        break;
    }
    return resultMessage.split('\\n').map((str, index) => (
      <Fragment key={index}>
        {str}
        <br />
      </Fragment>
    ));
  };

  const downloadQuality = (() => {
    if (downloadState === undefined) {
      return 0;
    } else if (downloadState >= goodDownloadMbs) {
      return 2;
    } else if (downloadState >= slowDownloadMbs) {
      return 1;
    }
    return 0;
  })();

  const uploadQuality = (() => {
    if (uploadState === undefined) {
      return 0;
    } else if (uploadState >= goodUploadMbs) {
      return 2;
    } else if (uploadState >= slowUploadMbs) {
      return 1;
    }
    return 0;
  })();

  const latencyQuality = (() => {
    if (latencyState === undefined) {
      return 0;
    } else if (latencyState <= goodLatency) {
      return 2;
    } else if (latencyState <= slowLatency) {
      return 1;
    }
    return 0;
  })();

  const testResult = () => {
    if (downloadQuality === 2 && uploadQuality === 2 && latencyQuality === 2) {
      return 2;
    } else if (downloadQuality > 0 && uploadQuality > 0 && latencyQuality > 0) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <CTAButton variant={'outlined'} onClick={handleOpenDialog} aria-label={t('speed-meter-button')}>
        {t('speed-meter-button')}
      </CTAButton>
      <Dialog aria-labelledby="speed-meter-title" open={showDialog}>
        <DialogTitle>
          {t('speed-meter-title')}
          <StyledIconButton aria-label="close" onClick={handleCloseDialog} size="small">
            <CloseIcon />
          </StyledIconButton>
        </DialogTitle>

        <Grid container>
          <Grid container direction={'column'} alignItems={'center'} spacing={2}>
            <IconContainer
              item
              container
              testCompleted={testCompleted}
              testResult={testResult()}
              fill={!testCompleted ? 'black' : 'white'}
            >
              <TestIcon animated={!testCompleted} />
            </IconContainer>
            {!testCompleted && (
              <Grid item>
                <StyledTypography align={'center'} variant={'body2'}>
                  {getMessage()}
                </StyledTypography>
              </Grid>
            )}
          </Grid>

          <ExpandingContainer
            visible={testCompleted}
            container
            direction={'column'}
            alignItems={'center'}
            spacing={2}
            wrap={'nowrap'}
          >
            <Grid item>
              <GridDiv>
                <StyledTypography variant={'body2'}>{t('speed-meter-download-label')}:</StyledTypography>
                <ResultDiv quality={downloadQuality}>
                  {downloadState !== undefined ? downloadState.toFixed(2) : '-'}
                </ResultDiv>
                <StyledTypography variant={'body2'}>{t('speed-meter-mbps')}</StyledTypography>
                <StyledTypography variant={'body2'}>{t('speed-meter-upload-label')}:</StyledTypography>
                <ResultDiv quality={uploadQuality}>
                  {uploadState !== undefined ? uploadState.toFixed(2) : '-'}
                </ResultDiv>
                <StyledTypography variant={'body2'}>{t('speed-meter-mbps')}</StyledTypography>
                <StyledTypography variant={'body2'}>{t('speed-meter-latency-label')}:</StyledTypography>

                <ResultDiv quality={latencyQuality}>{latencyState !== undefined ? latencyState : '-'}</ResultDiv>
                <StyledTypography variant={'body2'}>{t('speed-meter-ms')}</StyledTypography>
              </GridDiv>
            </Grid>
            <DialogContent>
              <StyledTypography variant={'body2'} align={'center'}>
                {getMessage()}
              </StyledTypography>
            </DialogContent>
            <DialogActions>
              <Button disabled={!testCompleted} onClick={startTest} variant="contained">
                {t('speed-meter-restart-button')}
              </Button>
            </DialogActions>
          </ExpandingContainer>
        </Grid>
      </Dialog>
    </div>
  );
};

export default SpeedTest;
