// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Badge, styled } from '@mui/material';

export const Indicator = styled(Badge, { label: 'Indicator' })(({ theme }) => ({
  width: '0.75rem',
  height: '0.75rem',
  borderRadius: '50%',
  background: theme.palette.primary.main,
}));
