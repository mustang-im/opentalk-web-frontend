// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useMediaQuery, useTheme } from '@mui/material';

import MobileMeetingHeader from './Mobile/MobileMeetingHeader';
import DesktopMeetingHeader from './fragments/DesktopMeetingHeader';

const MeetingHeader = () => {
  const theme = useTheme();
  const isMediumDevice = useMediaQuery(theme.breakpoints.down('md'));

  return isMediumDevice ? <MobileMeetingHeader /> : <DesktopMeetingHeader />;
};

export default MeetingHeader;
