// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Container, Grid, Typography, useTheme } from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { enterRoom } from '../../api/types/outgoing/control';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectFeatures } from '../../store/slices/configSlice';
import { selectRoomConnectionState, ConnectionState } from '../../store/slices/roomSlice';
import { useMediaContext } from '../MediaProvider/MediaProvider';
import SelfTest from '../SelfTest';

const WaitingView = () => {
  const connectionState = useAppSelector(selectRoomConnectionState);
  const theme = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const mediaContext = useMediaContext();
  const { joinWithoutMedia } = useAppSelector(selectFeatures);

  const readyToEnter = connectionState === ConnectionState.ReadyToEnter;

  const moveToRoom = useCallback(async () => {
    if (joinWithoutMedia) {
      await mediaContext.trySetVideo(false);
      await mediaContext.trySetAudio(false);
    }
    dispatch(enterRoom.action());
  }, [dispatch, joinWithoutMedia, mediaContext]);

  return (
    <Container>
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <SelfTest>
            <Typography
              variant="body1"
              textAlign={'center'}
              fontSize={'1.37rem'}
              color={theme.palette.text.secondary}
              justifyContent="center"
              width={'100%'}
            >
              {t('in-waiting-room')}
            </Typography>
          </SelfTest>
        </Grid>
        <Grid item container xs={12} spacing={1} justifyContent={'center'}>
          <Button onClick={moveToRoom} disabled={!readyToEnter}>
            {readyToEnter ? t('joinform-enter-now') : t('joinform-waiting-room-enter')}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default WaitingView;
