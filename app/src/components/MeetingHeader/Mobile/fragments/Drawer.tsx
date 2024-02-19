// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Drawer as MuiDrawer, Stack, styled } from '@mui/material';
import { IconButton as DefaultIconButton, LogoSmallIcon } from '@opentalk/common';
import { BackendModules } from '@opentalk/common';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ModerationTabKey, Tab, WaitingRoomMobileTab } from '../../../../config/moderationTabs';
import { useAppDispatch, useAppSelector, useTabs } from '../../../../hooks';
import { EnterpriseProvider } from '../../../../provider/EnterpriseProvider';
import { selectUnreadGlobalMessageCount, selectUnreadPersonalMessageCount } from '../../../../store/slices/chatSlice';
import { selectParticipantsWaitingCount } from '../../../../store/slices/participantsSlice';
import { selectWaitingRoomState } from '../../../../store/slices/roomSlice';
import { selectIsSharedFolderAvailableIndicatorVisible } from '../../../../store/slices/sharedFolderSlice';
import { selectActiveTab, selectIsCurrentWhiteboardHighlighted, setActiveTab } from '../../../../store/slices/uiSlice';
import { selectIsModerator } from '../../../../store/slices/userSlice';
import { Indicator } from '../../fragments/Indicator';
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

const ButtonIndicator = styled(Indicator)({
  position: 'absolute',
  top: '0.1rem',
  right: '0.1rem',
});

const Drawer = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();
  const tabs = useTabs();
  const unreadGlobalMessageCount = useAppSelector(selectUnreadGlobalMessageCount);
  const unreadPersonalMessageCount = useAppSelector(selectUnreadPersonalMessageCount);
  const isCurrentWhiteboardHighlighted = useAppSelector(selectIsCurrentWhiteboardHighlighted);
  const isSharedFolderAvailableIndicatorVisible = useAppSelector(selectIsSharedFolderAvailableIndicatorVisible);
  const isModerator = useAppSelector(selectIsModerator);
  const participantsWaitingCount = useAppSelector(selectParticipantsWaitingCount);
  const isWaitingRoomEnabled = useAppSelector(selectWaitingRoomState);
  const hasParticipantsWaiting = participantsWaitingCount > 0;
  const hasUnreadMessages = unreadGlobalMessageCount > 0 || unreadPersonalMessageCount > 0;

  const showIndicator =
    hasUnreadMessages ||
    isCurrentWhiteboardHighlighted ||
    isSharedFolderAvailableIndicatorVisible ||
    (isModerator && hasParticipantsWaiting);

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

  const homeTab = tabs.find((tab) => tab.key === ModerationTabKey.Home);
  const mobileModerationTabs = tabs.slice();
  if (isWaitingRoomEnabled && isModerator) {
    /**
     * This solution works for now as we want waiting room to be first tab
     * when it's available and is only conditionally visible tab outside of the
     * settings. This will be refactored in the future when we have more tabs.
     */
    mobileModerationTabs.unshift(WaitingRoomMobileTab);
  }

  const open = () => {
    if (participantsWaitingCount > 0 && isModerator) {
      // The click on the indicator "o" opens the waiting room overview
      dispatch(setActiveTab(ModerationTabKey.WaitingRoom));
    }
    setIsDrawerOpen(true);
  };

  const close = () => {
    setIsDrawerOpen(false);
    if (participantsWaitingCount === 0 && activeTab === ModerationTabKey.WaitingRoom && isModerator) {
      dispatch(setActiveTab(ModerationTabKey.Home));
    }
  };

  const toggle = () => {
    isDrawerOpen ? close() : open();
  };

  const Tabs = mobileModerationTabs.map((tab) => {
    if (
      !tab.divider &&
      //Temporary disabling of voting and polls until they are taken care of by separate issue
      !(tab.moduleKey === BackendModules.LegalVote || tab.moduleKey === BackendModules.Polls)
    ) {
      // Placeholder condition to show indicator inside of the drawer accordion button.
      const showIndicator =
        (ModerationTabKey.WaitingRoom === tab.key && participantsWaitingCount > 0) ||
        (ModerationTabKey.Home === tab.key && hasUnreadMessages);

      return (
        <DrawerTab
          key={tab.key}
          tabTitle={getTabTitle(tab)}
          disabled={tab.disabled}
          active={activeTab === tab.key}
          handleClick={() => handleSetActiveTab(tab.key)}
          showIndicator={showIndicator}
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
      <IconButton onClick={toggle}>
        <LogoSmallIcon />
        {showIndicator && <ButtonIndicator />}
      </IconButton>
      <StyledDrawer open={isDrawerOpen} onClose={close}>
        {isModerator && <DrawerContentContainer>{Tabs}</DrawerContentContainer>}
        {!isModerator && homeTab && (
          <DrawerContentContainer>
            <DrawerTab
              key={homeTab.key}
              tabTitle={getTabTitle(homeTab)}
              disabled={homeTab.disabled}
              active={activeTab === homeTab.key}
              handleClick={() => handleSetActiveTab(homeTab.key)}
            >
              {/* As part of follow-up issue creating tabs this should either be included as a wrapper to each tab component
          or some other way to prevent duplication with MeetingSidebar.tsx */}
              <EnterpriseProvider moduleKey={homeTab.moduleKey}>{homeTab.component}</EnterpriseProvider>
            </DrawerTab>
          </DrawerContentContainer>
        )}
      </StyledDrawer>
    </>
  );
};

export default Drawer;
