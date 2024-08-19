// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as Pin } from './source/pin.svg';

const PinIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Pin} inheritViewBox />;

export default PinIcon;
