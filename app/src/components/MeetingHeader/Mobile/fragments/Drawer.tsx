// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Drawer as MuiDrawer, Stack, styled } from '@mui/material';
import { BackendModules } from '@opentalk/common';
import { useTranslation } from 'react-i18next';
import { batch } from 'react-redux';

import { ModerationTabKey, PollsAndVotesMobileTab, Tab, WaitingRoomMobileTab } from '../../../../config/moderationTabs';
import { useAppDispatch, useAppSelector, useTabs } from '../../../../hooks';
import { selectActivePollsAndVotingsCount, selectPollsAndVotingsCount } from '../../../../store/selectors';
import { selectUnreadGlobalMessageCount, selectUnreadPersonalMessageCount } from '../../../../store/slices/chatSlice';
import { selectParticipantsWaitingCount } from '../../../../store/slices/participantsSlice';
import { selectWaitingRoomState } from '../../../../store/slices/roomSlice';
import {
  selectActiveTab,
  selectHaveSeenMobilePollsAndVotes,
  selectIsDrawerOpen,
  setActiveTab,
  setIsDrawerOpen,
} from '../../../../store/slices/uiSlice';
import { selectIsModerator } from '../../../../store/slices/userSlice';
import { DrawerButton } from './DrawerButton';
import DrawerTab from './DrawerTab';

const DrawerContentContainer = styled(Stack)(({ theme }) => ({
  height: '100%',
  width: '100%',
  background: theme.palette.background.video,
  padding: theme.spacing(1, 1),
  overflow: 'auto',
}));

const StyledDrawer = styled(MuiDrawer)(({ theme }) => ({
  '& .MuiPaper-root.MuiDrawer-paper': {
    width: '80%',
    background: theme.palette.background.defaultGradient,
  },
}));

const Drawer = () => {
  const isDrawerOpen = useAppSelector(selectIsDrawerOpen);
  const activeTab = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();
  const tabs = useTabs();
  const unreadGlobalMessageCount = useAppSelector(selectUnreadGlobalMessageCount);
  const unreadPersonalMessageCount = useAppSelector(selectUnreadPersonalMessageCount);
  const isModerator = useAppSelector(selectIsModerator);
  const participantsWaitingCount = useAppSelector(selectParticipantsWaitingCount);
  const isWaitingRoomEnabled = useAppSelector(selectWaitingRoomState);
  const hasUnreadMessages = unreadGlobalMessageCount > 0 || unreadPersonalMessageCount > 0;
  const voteAndPollCount = useAppSelector(selectPollsAndVotingsCount);
  const activeVoteAndPollCount = useAppSelector(selectActivePollsAndVotingsCount);
  const haveSeenMobilePollsAndVotes = useAppSelector(selectHaveSeenMobilePollsAndVotes);

  const handleSetActiveTab = (tabKey: ModerationTabKey) => dispatch(setActiveTab(tabKey));

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

  const mobileParticipantTabs = tabs.filter((tab) => tab.key === ModerationTabKey.Home);
  if (!isModerator && voteAndPollCount > 0) {
    mobileParticipantTabs.unshift(PollsAndVotesMobileTab);
  }

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
    batch(() => {
      if (activeVoteAndPollCount > 0 && !isModerator) {
        dispatch(setActiveTab(ModerationTabKey.PollsAndLegalVote));
      }
      if (participantsWaitingCount > 0 && isModerator) {
        // The click on the indicator "o" opens the waiting room overview
        dispatch(setActiveTab(ModerationTabKey.WaitingRoom));
      }
      dispatch(setIsDrawerOpen(true));
    });
  };

  const close = () => {
    batch(() => {
      dispatch(setIsDrawerOpen(false));
      if (participantsWaitingCount === 0 && activeTab === ModerationTabKey.WaitingRoom && isModerator) {
        dispatch(setActiveTab(ModerationTabKey.Home));
      }
    });
  };

  const toggle = () => {
    isDrawerOpen ? close() : open();
  };

  const renderTabs = (tabs: Tab[]) => {
    return tabs.map((tab) => {
      const isOmittedTab =
        tab.divider || tab.moduleKey === BackendModules.LegalVote || tab.moduleKey === BackendModules.Polls;

      if (!isOmittedTab) {
        const showIndicatorOnWaitingRoomTab = ModerationTabKey.WaitingRoom === tab.key && participantsWaitingCount > 0;
        const showIndicatorOnHomeTab = ModerationTabKey.Home === tab.key && hasUnreadMessages;
        const showIndicatorOnPollsAndLegalVoteTab =
          ModerationTabKey.PollsAndLegalVote === tab.key && voteAndPollCount > 0 && !haveSeenMobilePollsAndVotes;

        // Placeholder condition to show indicator inside of the drawer accordion button.
        const showIndicator =
          showIndicatorOnWaitingRoomTab || showIndicatorOnHomeTab || showIndicatorOnPollsAndLegalVoteTab;

        return (
          <DrawerTab
            key={tab.key}
            tabTitle={getTabTitle(tab)}
            disabled={tab.disabled}
            active={activeTab === tab.key}
            handleClick={() => handleSetActiveTab(tab.key)}
            showIndicator={showIndicator}
          >
            {tab.component}
          </DrawerTab>
        );
      }
    });
  };

  return (
    <>
      <DrawerButton onClick={toggle} />
      <StyledDrawer open={isDrawerOpen} onClose={close}>
        <DrawerContentContainer>
          {renderTabs(isModerator ? mobileModerationTabs : mobileParticipantTabs)}
        </DrawerContentContainer>
      </StyledDrawer>
    </>
  );
};

export default Drawer;
