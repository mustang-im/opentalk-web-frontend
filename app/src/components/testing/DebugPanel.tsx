// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AppBar, Tabs, Tab } from '@mui/material';
import React, { useState } from 'react';

import TabPanel from '../ui/TabPanel';
import ModerationWindow from './moderation';

export const DebugPanel = () => {
  const [tab, setTab] = useState(0);

  return (
    <>
      <AppBar position="static">
        <Tabs value={tab} onChange={(e, i) => setTab(i)} centered>
          <Tab label="Moderation" value={0} />
          <Tab label="Legal Vote" value={2} />
          <Tab label="Breakout" value={1} />
        </Tabs>
      </AppBar>
      <TabPanel index={0} value={tab}>
        <ModerationWindow />
      </TabPanel>
    </>
  );
};

export default DebugPanel;
