// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Bug } from './source/bug.svg';

const BugIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Bug} inheritViewBox />;

export default BugIcon;
