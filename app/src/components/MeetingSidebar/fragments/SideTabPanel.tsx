// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box } from '@mui/material';
import React, { forwardRef } from 'react';

interface SideTabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const SideTabPanel = forwardRef<unknown, SideTabPanelProps>(({ children, value, index }, ref) => {
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
      {children}
    </Box>
  );
});

export default SideTabPanel;
