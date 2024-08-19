// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SvgIcon, SvgIconProps } from '@mui/material';

import { ReactComponent as AddPlus } from './source/rect-add-plus.svg';

const AddWithRectangleIcon = (props: SvgIconProps) => <SvgIcon {...props} component={AddPlus} inheritViewBox />;

export default AddWithRectangleIcon;
