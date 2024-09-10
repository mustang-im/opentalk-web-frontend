// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as SharedFolderSVG } from './source/shared-folder.svg';

const SharedFolderIcon = (props: SvgIconProps) => <SvgIcon {...props} component={SharedFolderSVG} inheritViewBox />;

export default SharedFolderIcon;
