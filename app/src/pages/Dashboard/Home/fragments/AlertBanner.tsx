// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Alert, styled } from '@mui/material';

export const AlertBanner = styled(Alert)(({ theme }) => ({
  borderRadius: theme.borderRadius.medium,
  marginLeft: theme.spacing(19.5),
  lineHeight: theme.spacing(2.5),
  '& .MuiButton-root': {
    marginTop: theme.spacing(0.5),
  },
  '& .MuiAlert-message': {
    marginLeft: theme.spacing(1),
  },
}));
