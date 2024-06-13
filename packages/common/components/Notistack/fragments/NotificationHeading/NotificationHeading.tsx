// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography, styled } from '@mui/material';

export const NotificationHeading = styled(Typography)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  margin: 0,
  fontSize: '0.875rem',
  '& > svg': {
    marginRight: theme.spacing(1),
  },
  lineHeight: 1.43, // Notistack default line height value.
}));
