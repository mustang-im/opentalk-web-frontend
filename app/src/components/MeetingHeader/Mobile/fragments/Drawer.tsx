// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Drawer as MuiDrawer, Stack, styled } from '@mui/material';
import { IconButton as DefaultIconButton, LogoSmallIcon } from '@opentalk/common';
import { BackendModules } from '@opentalk/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ModerationTabKey, Tab } from '../../../../config/moderationTabs';
import { useAppDispatch, useAppSelector, useTabs } from '../../../../hooks';
import { EnterpriseProvider } from '../../../../provider/EnterpriseProvider';
import { selectActiveTab, setActiveTab } from '../../../../store/slices/uiSlice';
import DrawerTab from './DrawerTab';

const DrawerContentContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  width: '100%',
  background: theme.palette.background.video,
  padding: theme.spacing(1, 1),
  overflow: 'auto',
}));

const IconButton = styled(DefaultIconButton)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  width: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const StyledDrawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiPaper-root.MuiDrawer-paper': {
    width: '80%',
    background: theme.palette.background.defaultGradient,
  },
}));

const Drawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();
  const tabs = useTabs();

  const handleSetActiveTab = (tabKey: ModerationTabKey) => {
    dispatch(setActiveTab(tabKey));
  };

  const { t } = useTranslation();

  const getTabTitle = (tab: Tab) => {
    if (tab.titleKey) {
      return t(`${tab.titleKey}`);
    }
    if (tab.key === ModerationTabKey.Home) {
      return t(`${tab.tooltipTranslationKey}`);
    }

    return '';
  };

  const Tabs = tabs.map((tab) => {
    if (
      !tab.divider &&
      //Temporary disabling of voting and polls until they are taken care of by separate issue
      !(tab.moduleKey === BackendModules.LegalVote || tab.moduleKey === BackendModules.Polls)
    ) {
      return (
        <DrawerTab
          key={tab.key}
          tabTitle={getTabTitle(tab)}
          disabled={tab.disabled}
          active={activeTab === tab.key}
          handleClick={() => handleSetActiveTab(tab.key)}
        >
          {/* As part of follow-up issue creating tabs this should either be included as a wrapper to each tab component
          or some other way to prevent duplication with MeetingSidebar.tsx */}
          <EnterpriseProvider moduleKey={tab.moduleKey}>{tab.component}</EnterpriseProvider>
        </DrawerTab>
      );
    }
  });

  return (
    <>
      <IconButton onClick={() => setIsDrawerOpen(true)}>
        <LogoSmallIcon />
      </IconButton>
      <StyledDrawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <DrawerContentContainer>{Tabs}</DrawerContentContainer>
      </StyledDrawer>
    </>
  );
};

export default Drawer;
