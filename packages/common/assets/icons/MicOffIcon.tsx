// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as MicOff } from './source/mic-off.svg';

const MicOffIcon = (props: SvgIconProps) => <SvgIcon {...props} component={MicOff} inheritViewBox />;

export default MicOffIcon;
