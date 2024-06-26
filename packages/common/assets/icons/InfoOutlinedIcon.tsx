// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as InfoOutlined } from './source/info-outlined.svg';

const InfoOutlinedIcon = (props: SvgIconProps) => <SvgIcon {...props} component={InfoOutlined} inheritViewBox />;

export default InfoOutlinedIcon;
