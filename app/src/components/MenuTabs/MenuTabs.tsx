// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Tabs as MuiTabs, styled, Typography, Badge, Tab as MuiTab } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { VisuallyHiddenTitle } from '../../commonComponents';
import { useAppSelector } from '../../hooks';
import { selectUnreadGlobalMessageCount, selectUnreadPersonalMessageCount } from '../../store/slices/chatSlice';
import { selectParticipantsTotal } from '../../store/slices/participantsSlice';
import { selectCurrentRoomMode } from '../../store/slices/roomSlice';
import { selectChatConversationState } from '../../store/slices/uiSlice';
import { ChatScope, RoomMode } from '../../types';
import Chat from '../Chat';
import ChatOverview from '../ChatOverview';
import Participants from '../Participants';
import TabPanel, { MenuTab } from './fragments/TabPanel';

const MessagesBadge = styled(Badge)(({ theme }) => ({
  right: -4,
  top: -3,
  '& .MuiBadge-badge': {
    background: theme.palette.primary.main,
  },
}));

const ChatBadge = styled(Badge)(({ theme }) => ({
  right: -4,
  top: -3,
  '& .MuiBadge-badge': {
    background: theme.palette.primary.main,
  },
}));

const Tabs = styled(MuiTabs)(({ theme }) => ({
  minHeight: 0,
  borderRadius: theme.borderRadius.large,
  background: '#20434F', //todo theme.palette.text.secondary would be the wrong context here
  '& .MuiTabs-flexContainer': {
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const Tab = styled(MuiTab)(({ theme }) => ({
  minWidth: '33%',
  minHeight: 0,
  fontSize: '0.75rem',
  borderRadius: theme.borderRadius.large,
  color: theme.palette.text.primary,
  textTransform: 'initial',
  fontWeight: 400,
  padding: theme.spacing(1),
  whiteSpace: 'nowrap',
  '&:hover, &.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary,
  },
  '& .MuiTab-iconWrapper': {
    marginLeft: theme.spacing(0.2),
  },
}));

function getMessagingTab(isPrivateChatTab: boolean) {
  return isPrivateChatTab ? MenuTab.Messages : MenuTab.Chat;
}

const MenuTabs = () => {
  const { t } = useTranslation();
  const chatConversationState = useAppSelector(selectChatConversationState);
  const unreadGlobalMessageCount = useAppSelector(selectUnreadGlobalMessageCount);
  const unreadPersonalMessageCount = useAppSelector(selectUnreadPersonalMessageCount);
  const totalParticipants = useAppSelector(selectParticipantsTotal);
  const currentRoomMode = useAppSelector(selectCurrentRoomMode);
  const isPrivateChatTab = chatConversationState.scope !== undefined && chatConversationState.targetId !== undefined;
  const [currentTab, setCurrentTab] = useState<MenuTab>(
    currentRoomMode === RoomMode.TalkingStick ? MenuTab.People : getMessagingTab(isPrivateChatTab)
  );

  useEffect(() => {
    if (isPrivateChatTab) {
      setCurrentTab(MenuTab.Messages);
    }
  }, [isPrivateChatTab]);

  useEffect(() => {
    if (currentRoomMode === RoomMode.TalkingStick) {
      setCurrentTab(MenuTab.People);
    }
  }, [currentRoomMode]);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: MenuTab) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <VisuallyHiddenTitle component="h2" label="menutabs-area-hidden-heading" />
      <Tabs value={currentTab} onChange={handleChange} variant="fullWidth">
        <Tab
          id={`tab-${MenuTab.Chat}`}
          label={t('menutabs-chat')}
          icon={unreadGlobalMessageCount > 0 ? <ChatBadge variant="dot" /> : undefined}
          iconPosition="end"
          value={MenuTab.Chat}
          aria-controls={`tabpanel-${MenuTab.Chat}`}
        />
        <Tab
          id={`tab-${MenuTab.People}`}
          label={t('menutabs-people')}
          icon={<Typography variant="caption">({totalParticipants})</Typography>}
          iconPosition="end"
          value={MenuTab.People}
          aria-controls={`tabpanel-${MenuTab.People}`}
        />
        <Tab
          id={`tab-${MenuTab.Messages}`}
          label={t('menutabs-messages')}
          icon={unreadPersonalMessageCount > 0 ? <MessagesBadge variant="dot" /> : undefined}
          iconPosition="end"
          value={MenuTab.Messages}
          aria-controls={`tabpanel-${MenuTab.Messages}`}
        />
      </Tabs>

      <TabPanel value={MenuTab.Chat} hidden={currentTab !== MenuTab.Chat}>
        <VisuallyHiddenTitle component="h3" label="chatroom-hidden-heading" />
        <Chat scope={ChatScope.Global} />
      </TabPanel>
      <TabPanel value={MenuTab.People} hidden={currentTab !== MenuTab.People}>
        <VisuallyHiddenTitle component="h3" label="participant-list-hidden-heading" />
        <Participants />
      </TabPanel>
      <TabPanel value={MenuTab.Messages} hidden={currentTab !== MenuTab.Messages}>
        <ChatOverview />
      </TabPanel>
    </>
  );
};

export default MenuTabs;
