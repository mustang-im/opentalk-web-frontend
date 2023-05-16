// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AppBar as MuiAppBar, Tab as MuiTab, Tabs as MuiTabs, styled, Box, Typography, Badge } from '@mui/material';
import { ParticipantId, GroupId, ChatScope, RoomMode } from '@opentalk/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { setLastSeenTimestamp } from '../../api/types/outgoing/chat';
import { useAppSelector } from '../../hooks';
import { selectUnreadMessageCount } from '../../store/selectors';
import { addLastSeenTimestamp, selectAllChatMessages } from '../../store/slices/chatSlice';
import { selectParticipantsTotal } from '../../store/slices/participantsSlice';
import { selectChatConversationState } from '../../store/slices/uiSlice';
import Chat from '../Chat';
import ChatOverview from '../ChatOverview';
import Participants from '../Participants';
import TabPanel from './fragments/TabPanel';
import { selectCurrentRoomMode } from '../../store/slices/roomSlice';

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

const Container = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
});

const AppBar = styled(MuiAppBar)({
  borderRadius: '0.5rem',
});

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
  '&.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary,
  },
  '& .MuiTab-iconWrapper': {
    marginLeft: theme.spacing(0.2),
  },
}));

enum SidebarTab {
  Chat = 0,
  People = 1,
  Messages = 2,
}

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

const MenuTabs = () => {
  const [currentTab, setCurrentTab] = useState(SidebarTab.Chat);
  const { t } = useTranslation();
  const chatConversationState = useAppSelector(selectChatConversationState);
  const unreadMessagesCount = useAppSelector(selectUnreadMessageCount);
  const totalParticipants = useAppSelector(selectParticipantsTotal);
  const allChatMessages = useAppSelector(selectAllChatMessages);
  const currentRoomMode = useAppSelector(selectCurrentRoomMode);

  const dispatch = useDispatch();

  useEffect(() => {
    const timestamp = new Date().toISOString();
    if (
      currentTab === SidebarTab.Messages &&
      chatConversationState.scope !== undefined &&
      chatConversationState.targetId !== undefined
    ) {
      if (chatConversationState.scope === ChatScope.Group) {
        dispatch(
          addLastSeenTimestamp({
            scope: chatConversationState.scope,
            target: chatConversationState.targetId as GroupId,
            timestamp,
          })
        );
        dispatch(
          setLastSeenTimestamp.action({
            timestamp,
            scope: chatConversationState.scope,
            target: chatConversationState.targetId as GroupId,
          })
        );
      }
      if (chatConversationState.scope === ChatScope.Private) {
        const data = {
          scope: chatConversationState.scope,
          target: chatConversationState.targetId as ParticipantId,
          timestamp,
        };
        dispatch(addLastSeenTimestamp(data));
        dispatch(
          setLastSeenTimestamp.action({
            timestamp,
            scope: chatConversationState.scope,
            target: chatConversationState.targetId as ParticipantId,
          })
        );
      }
    }

    if (currentTab === SidebarTab.Chat) {
      dispatch(addLastSeenTimestamp({ scope: ChatScope.Global, timestamp: timestamp }));
      dispatch(setLastSeenTimestamp.action({ timestamp: timestamp, scope: ChatScope.Global }));
    }
  }, [currentTab, chatConversationState, allChatMessages]);

  useEffect(() => {
    if (chatConversationState.scope !== undefined && chatConversationState.targetId !== undefined) {
      setCurrentTab(SidebarTab.Messages);
    }
  }, [chatConversationState]);

  useEffect(() => {
    if (currentRoomMode === RoomMode.TalkingStick) {
      setCurrentTab(SidebarTab.People);
    }
  }, [currentRoomMode]);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setCurrentTab(newValue);
  };

  const getBadge = (tab: number) => {
    if (tab === currentTab) {
      return;
    }
    if (unreadMessagesCount.private + unreadMessagesCount.group > 0 && tab === SidebarTab.Messages) {
      return <MessagesBadge variant={'dot'} />;
    }

    if (unreadMessagesCount.global > 0 && tab === SidebarTab.Chat) {
      return <ChatBadge variant={'dot'} />;
    }
  };

  return (
    <Container>
      <Box>
        <AppBar position={'static'} color={'secondary'} elevation={0}>
          <Tabs value={currentTab} onChange={handleChange} variant={'fullWidth'}>
            <Tab label={t('menutabs-chat')} icon={getBadge(SidebarTab.Chat)} iconPosition="end" />
            <Tab
              label={t('menutabs-people')}
              icon={<Typography variant="caption">({totalParticipants})</Typography>}
              iconPosition="end"
            />
            <Tab label={t('menutabs-messages')} icon={getBadge(SidebarTab.Messages)} iconPosition="end" />
          </Tabs>
        </AppBar>
      </Box>
      <TabPanel value={currentTab} index={SidebarTab.Chat}>
        <Chat />
      </TabPanel>
      <TabPanel value={currentTab} index={SidebarTab.People}>
        <Participants />
      </TabPanel>
      <TabPanel value={currentTab} index={SidebarTab.Messages}>
        <ChatOverview />
      </TabPanel>
    </Container>
  );
};

export default MenuTabs;
