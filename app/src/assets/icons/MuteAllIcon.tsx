// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as MuteAll } from './source/mute-all.svg';

const MuteAllIcon = (props: SvgIconProps) => <SvgIcon {...props} component={MuteAll} inheritViewBox />;

export default MuteAllIcon;
