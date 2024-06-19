// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Live } from './source/live.svg';

const LiveIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Live} inheritViewBox />;

export default LiveIcon;
