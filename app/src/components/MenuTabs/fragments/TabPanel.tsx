// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box } from '@mui/material';
import React from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number | string;
  value: number | string | Record<string, unknown>;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  if (value !== index) {
    return null;
  }
  return (
    <Box
      flex={1}
      display={'flex'}
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
    >
      {children}
    </Box>
  );
};

export default TabPanel;
