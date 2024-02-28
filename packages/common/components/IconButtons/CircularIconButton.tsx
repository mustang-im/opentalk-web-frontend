// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

import { styled } from "@mui/material";
import IconButton from "./IconButton";

const CircularIconButton = styled(IconButton)(({ theme }) => ({
  padding: theme.spacing(1),
  border: 'solid',
  borderWidth: theme.typography.pxToRem(1),
  borderColor: theme.palette.background.paper,
  borderRadius: '100%',
  width: '2rem',
  height: '2rem',

  '& .MuiSvgIcon-root': {
    fill: theme.palette.background.paper,
    width: '1.5em',
    height: '1.5em',
  },
    
  '&&:hover, &&:focus': {
    background: theme.palette.secondary.lightest,
    '& .MuiSvgIcon-root': {
      fill: theme.palette.text.primary,
    },
  },
}));

export default CircularIconButton;