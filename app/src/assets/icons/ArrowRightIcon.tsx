// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as ArrowRight } from './source/arrow-right.svg';

const ArrowRightIcon = (props: SvgIconProps) => <SvgIcon {...props} component={ArrowRight} inheritViewBox />;

export default ArrowRightIcon;
