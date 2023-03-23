// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Typography, styled } from '@mui/material';
import React, { forwardRef } from 'react';

interface SideTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  tabTitle?: string;
}

const TabTitle = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  fontSize: '1.25rem',
}));

const TabContainer = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 19em)',
  overflow: 'auto',
  // buttons shall take the whole width of the tab
  '.MuiButton-root': {
    flexGrow: 1,
  },
});

const SideTabPanel = forwardRef<unknown, SideTabPanelProps>(({ children, value, index, tabTitle }, ref) => {
  if (value !== index) {
    return null;
  }

  return (
    <Box
      {...ref}
      flex={1}
      display={'flex'}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      flexDirection={'column'}
      maxWidth={'100%'}
      maxHeight={'100%'}
    >
      <TabTitle>{tabTitle}</TabTitle>
      <TabContainer>{children}</TabContainer>
    </Box>
  );
});

export default SideTabPanel;
