// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as ShareScreenOn } from './source/share-screen-on.svg';

const ShareScreenOnIcon = (props: SvgIconProps) => <SvgIcon {...props} component={ShareScreenOn} inheritViewBox />;

export default ShareScreenOnIcon;
