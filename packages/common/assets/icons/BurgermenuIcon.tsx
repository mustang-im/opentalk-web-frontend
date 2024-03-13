// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Burgermenu } from './source/burgermenu-icon.svg';

const BurgermenuIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Burgermenu} inheritViewBox />;

export default BurgermenuIcon;
