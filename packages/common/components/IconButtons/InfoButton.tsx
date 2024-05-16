// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, IconButtonProps } from '@mui/material';
import React from 'react';

import { InfoOutlinedIcon } from '../../assets/icons';
import IconButton from './IconButton';

const InfoButtonStyle = styled(IconButton)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(1),
  color: theme.palette.secondary.light,
  '&& svg': {
    fontSize: '1.3rem',
  },
}));
const InfoButton = (props: IconButtonProps) => (
  <InfoButtonStyle {...props}>
    <InfoOutlinedIcon />
  </InfoButtonStyle>
);

export default InfoButton;
