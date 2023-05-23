// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as TelephoneStroke } from './source/telephone-stroke.svg';

const TelephoneStrokeIcon = (props: SvgIconProps) => <SvgIcon {...props} component={TelephoneStroke} inheritViewBox />;

export default TelephoneStrokeIcon;
