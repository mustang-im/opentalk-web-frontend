// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIconProps } from '@mui/material';

import { ReactComponent as OpentalkLogo } from './source/logo.svg';

const Logo = (props: SvgIconProps) => (
  <OpentalkLogo width="12.8997em" height="2.072em" fill="white" aria-disabled {...props} />
);

export default Logo;
