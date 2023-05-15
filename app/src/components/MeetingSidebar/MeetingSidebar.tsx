// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Paper, styled, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Tab } from '../../config/moderationTabs';
import { useAppSelector, useTabs } from '../../hooks';
import { EnterpriseProvider } from '../../provider/EnterpriseProvider';
import { selectIsModerator } from '../../store/slices/userSlice';
import LocalVideo from '../LocalVideo/index';
import MenuTabs from '../MenuTabs/MenuTabs';
import ModerationSideToolbar from '../ModerationSideToolbar';
import Toolbar from '../Toolbar';
import SideTabPanel from './fragments/SideTabPanel';

const SideBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  background: theme.palette.background.paper,
  borderRadius: theme.borderRadius.medium,
  gridRow: 'span 2',
  flex: 1,
}));

const ProfileWindow = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isModerator',
})<{ isModerator?: boolean }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.borderRadius.medium,
  padding: theme.spacing(2),
  '&-webkit-transform': 'translateZ(0)',
  boxShadow: '0 1.187rem 3.187rem 0 rgb(0 0 0 / 16%), 0 0.875rem 1.187rem 0 rgb(0 0 0 / 7%)',
  width: '21rem',
}));

const MeetingSidebar = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmartphone = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallDeviceInLandscape = useMediaQuery(`${theme.breakpoints.down('md')} and (orientation: landscape)`);
  const isModerator = useAppSelector(selectIsModerator);
  const { tabs, value, handleTabSelect } = useTabs();

  if (isSmartphone || isSmallDeviceInLandscape) {
    return null;
  }

  const renderTabs = () => {
    return tabs?.map((tab: Tab, index) => {
      if (!tab.divider) {
        return (
          <Tooltip
            key={tab.key}
            placement="right"
            title={tab.tooltipTranslationKey ? t(tab.tooltipTranslationKey) : ''}
          >
            <SideTabPanel value={value} index={index} tabTitle={tab.titleKey ? t(tab.titleKey) : ''}>
              <EnterpriseProvider moduleKey={tab.moduleKey}>{tab.component}</EnterpriseProvider>
            </SideTabPanel>
          </Tooltip>
        );
      }
    });
  };

  return isModerator ? (
    <SideBar>
      <ModerationSideToolbar selectedTabs={tabs} onSelect={handleTabSelect} />
      <ProfileWindow isModerator={isModerator}>
        <LocalVideo />
        <Toolbar />
        {renderTabs()}
      </ProfileWindow>
    </SideBar>
  ) : (
    <SideBar>
      <ProfileWindow>
        <LocalVideo />
        <Toolbar />
        <SideTabPanel value={value} index={0}>
          <MenuTabs />
        </SideTabPanel>
      </ProfileWindow>
    </SideBar>
  );
};

export default MeetingSidebar;
