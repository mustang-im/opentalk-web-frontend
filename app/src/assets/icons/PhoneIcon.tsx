// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as Phone } from './source/phone.svg';

const PhoneIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Phone} inheritViewBox />;

export default PhoneIcon;
