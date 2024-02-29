// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';
import React from 'react';

import { ReactComponent as Emoji } from './source/emoji.svg';

const EmojiIcon = (props: SvgIconProps) => <SvgIcon {...props} component={Emoji} inheritViewBox />;

export default EmojiIcon;
