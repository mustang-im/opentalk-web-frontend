// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Chip, styled } from '@mui/material';

export const ActiveStateChip = styled(Chip)(() => ({
  marginLeft: 0,
  borderRadius: 0,
  borderColor: 'transparent',
  pointerEvents: 'none',
  '& .MuiChip-label': {
    paddingRight: 0,
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));
