// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container as MuiContainer, Stack, styled, CircularProgress, Typography } from '@mui/material';
import { getSentences } from '@opentalk/common';
import { useMemo } from 'react';
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

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  padding: theme.spacing(2, 0),
}));

const Text = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: '200',
}));

const RoomLoadingView = () => {
  const connectionState = useAppSelector(selectRoomConnectionState);
  const { t } = useTranslation();

  const sentences: Array<string> = useMemo(() => {
    switch (connectionState) {
      case ConnectionState.Setup:
        return getSentences(t('room-loading-setup'));
      case ConnectionState.Starting:
        return getSentences(t('room-loading-starting'));
      case ConnectionState.Reconnecting:
        return getSentences(t('room-loading-reconnect'));
      case ConnectionState.Blocked:
        return getSentences(t('room-loading-blocked'));
      default:
        return getSentences(t('room-loading-generic'));
    }
  }, [t, connectionState]);

  // we assume that first sentence is always a title
  // the rest will be handled as normal text
  const title = sentences.shift();

  return (
    <Container>
      <Stack spacing={2} alignItems="center">
        <CircularProgress color={'primary'} size={'8rem'} />
        <Title variant="h4">{title}</Title>
        {sentences.length > 0 &&
          sentences.map((sentence) => (
            <Text key={sentence} variant="h1">
              {sentence}
            </Text>
          ))}
      </Stack>
    </Container>
  );
};

export default RoomLoadingView;
