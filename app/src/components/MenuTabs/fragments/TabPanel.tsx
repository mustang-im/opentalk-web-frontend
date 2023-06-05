// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box } from '@mui/material';
import React from 'react';

import { MenuTab } from '../MenuTabs';

interface TabPanelProps {
  children?: React.ReactNode;
  value: MenuTab;
  hidden: boolean;
}

const TabPanel = ({ children, value, hidden }: TabPanelProps) => {
  return (
    <Box
      flex={1}
      display={hidden ? 'none' : 'flex'}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-hidden={hidden}
      aria-labelledby={`tab-${value}`}
    >
      {!hidden && children}
    </Box>
  );
};

export default TabPanel;
