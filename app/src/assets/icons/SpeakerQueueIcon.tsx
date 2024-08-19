// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as SpeakerQueue } from './source/speaker-queue.svg';

const SpeakerQueueIcon = (props: SvgIconProps) => <SvgIcon {...props} component={SpeakerQueue} inheritViewBox />;

export default SpeakerQueueIcon;
