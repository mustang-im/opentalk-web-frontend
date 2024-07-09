// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as Feedback } from './source/feedback.svg';

const FeedbackIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Feedback} inheritViewBox />;

export default FeedbackIcon;
