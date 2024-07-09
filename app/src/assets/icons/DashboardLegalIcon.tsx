// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as DashboardLegal } from './source/dashboard-legal.svg';

const DashboardLegalIcon = (props: SvgIconProps) => <SvgIcon {...props} component={DashboardLegal} inheritViewBox />;

export default DashboardLegalIcon;
