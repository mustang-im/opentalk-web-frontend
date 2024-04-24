// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, styled } from '@mui/material';

export const MeetingHeaderButton = styled(IconButton)<{ active?: boolean }>(({ theme, active }) => ({
  background: active ? theme.palette.primary.main : theme.palette.background.video,
  borderRadius: '0.25rem',
  '& .MuiSvgIcon-root': {
    fill: active ? theme.palette.background.default : theme.palette.text.primary,
  },
  '&:hover .MuiSvgIcon-root': {
    fill: theme.palette.text.primary,
  },
}));
