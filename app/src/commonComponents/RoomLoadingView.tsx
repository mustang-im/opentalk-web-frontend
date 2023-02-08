// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CircularProgress, Typography } from '@mui/material';
import { Container as MuiContainer, Stack, styled } from '@mui/material';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../hooks';
import { ConnectionState, selectRoomConnectionState } from '../store/slices/roomSlice';

const Container = styled(MuiContainer)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  color: theme.palette.common.white,
}));

const RoomLoadingView = () => {
  const connectionState = useAppSelector(selectRoomConnectionState);
  const { t } = useTranslation();

  const title = useMemo(() => {
    switch (connectionState) {
      case ConnectionState.Setup:
        return t('room-loading-setup');
      case ConnectionState.Starting:
        return t('room-loading-starting');
      case ConnectionState.Reconnecting:
        return t('room-loading-reconnect');
      default:
        return t('room-loading-generic');
    }
  }, [t, connectionState]);

  return (
    <Container>
      <Stack spacing={6} alignItems="center">
        <CircularProgress color={'primary'} size={'8rem'} />
        <Typography variant="h1">{title}</Typography>
      </Stack>
    </Container>
  );
};

export default RoomLoadingView;
