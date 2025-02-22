// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as NoOfParticipants } from './source/no-of-participants.svg';

const NoOfParticipantsIcon = (props: SvgIconProps) => (
  <SvgIcon {...props} component={NoOfParticipants} inheritViewBox />
);

export default NoOfParticipantsIcon;
