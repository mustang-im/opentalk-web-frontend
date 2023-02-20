// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, CircularProgress, styled } from '@mui/material';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
  background: theme.palette.background.overlay,
}));

const SuspenseLoading = () => (
  <Container>
    <CircularProgress color={'primary'} />
  </Container>
);

export default SuspenseLoading;
