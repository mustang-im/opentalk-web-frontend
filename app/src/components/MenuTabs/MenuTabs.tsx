// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AppBar as MuiAppBar, Tab as MuiTab, Tabs as MuiTabs, styled, Box, Typography, Badge } from '@mui/material';
import { ParticipantId, GroupId } from '@opentalk/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { setLastSeenTimestamp } from '../../api/types/outgoing/chat';
import ChatScope from '../../enums/ChatScope';
import { useAppSelector } from '../../hooks';
import {
  addLastSeenTimestamp,
  selectAllChatMessages,
  selectLastSeenTimestampGlobal,
  selectLastSeenTimestampsGroup,
  selectLastSeenTimestampsPrivate,
  TimestampState,
} from '../../store/slices/chatSlice';
import { selectParticipantsTotal } from '../../store/slices/participantsSlice';
import { selectChatConversationState } from '../../store/slices/uiSlice';
import Chat from '../Chat';
import ChatOverview from '../ChatOverview';
import Participants from '../Participants';
import TabPanel from './fragments/TabPanel';

const StyledBadge = styled(Badge)(({ theme }) => ({
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
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const chatConversationState = useAppSelector(selectChatConversationState);
  const allChatMessages = useAppSelector(selectAllChatMessages);
  const lastSeenTimestampGlobal = useAppSelector(selectLastSeenTimestampGlobal);
  const lastSeenTimestampsGroup = useAppSelector(selectLastSeenTimestampsGroup);
  const lastSeenTimestampsPrivate = useAppSelector(selectLastSeenTimestampsPrivate);
  const totalParticipants = useAppSelector(selectParticipantsTotal);
  const dispatch = useDispatch();

  const filterUnreadMessages = (scope: ChatScope, lastSeenTimestamps: TimestampState[]) => {
    const scopeMessages = allChatMessages.filter((message) => message.scope === scope);
    let messageCount = scopeMessages.length;
    if (scopeMessages.length > 0 && lastSeenTimestamps.length > 0) {
      const messagesIds = scopeMessages
        .filter(
          (message, index, array) =>
            message.scope === scope && array.findIndex((t) => t.target === message.target) === index
        )
        .map((message) => message.target);
      messagesIds.forEach((id) => {
        const lastSeen = lastSeenTimestamps.filter((ts) => ts.target === id);
        const idsMessages = scopeMessages.filter((msg) => msg.target === id);
        if (lastSeen.length === 1) {
          const filteredMessages = idsMessages.filter(
            (msg) => new Date(msg.timestamp).getTime() > new Date(lastSeen[0].timestamp).getTime()
          );
          messageCount = filteredMessages.length;
          return;
        } else {
          if (idsMessages.length > 0) {
            messageCount = idsMessages.length;
            return;
          }
        }
      });
    }

    return messageCount;
  };

  const getUnreadMessagesCount = (scope: ChatScope) => {
    if (scope === ChatScope.Global) {
      if (lastSeenTimestampGlobal) {
        const messages = allChatMessages.filter(
          (m) =>
            m.scope === ChatScope.Global &&
            new Date(m.timestamp).getTime() > new Date(lastSeenTimestampGlobal).getTime()
        );
        return messages.length;
      }
      return 0;
    }

    const privateCount = filterUnreadMessages(ChatScope.Private, lastSeenTimestampsPrivate);
    if (privateCount > 0) {
      return privateCount;
    }

    const groupCount = filterUnreadMessages(ChatScope.Group, lastSeenTimestampsGroup);
    return groupCount;
  };

  useEffect(() => {
    if (chatConversationState.scope !== undefined && chatConversationState.targetId !== undefined) {
      setValue(2);
    }
  }, [chatConversationState]);

  useEffect(() => {
    const timestamp = new Date().toISOString();
    if (value === 2 && chatConversationState.scope !== undefined && chatConversationState.targetId !== undefined) {
      if (chatConversationState.scope === ChatScope.Group) {
        dispatch(
          addLastSeenTimestamp({
            scope: chatConversationState.scope,
            target: chatConversationState.targetId as GroupId,
            timestamp: timestamp,
          })
        );
        dispatch(
          setLastSeenTimestamp.action({
            timestamp: timestamp,
            scope: chatConversationState.scope,
            target: chatConversationState.targetId as GroupId,
          })
        );
      }
      if (chatConversationState.scope === ChatScope.Private) {
        const data = {
          scope: chatConversationState.scope,
          target: chatConversationState.targetId as ParticipantId,
          timestamp: timestamp,
        };
        dispatch(addLastSeenTimestamp(data));
        dispatch(
          setLastSeenTimestamp.action({
            timestamp: timestamp,
            scope: chatConversationState.scope,
            target: chatConversationState.targetId as ParticipantId,
          })
        );
      }
    }

    if (value === 0) {
      dispatch(addLastSeenTimestamp({ scope: ChatScope.Global, timestamp: timestamp }));
      dispatch(setLastSeenTimestamp.action({ timestamp: timestamp, scope: ChatScope.Global }));
    }
  }, [value, chatConversationState]);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  const getBadge = (tab: number) => {
    if (tab === value) {
      return;
    }

    const top = -3;
    const count = getUnreadMessagesCount(ChatScope.Group);
    if (count > 0 && tab === 2) {
      const left = 74;
      return (
        <StyledBadge
          variant={'dot'}
          sx={{
            left: left,
            top: top,
          }}
        />
      );
    }

    if (getUnreadMessagesCount(ChatScope.Global) > 0 && tab === 0) {
      const left = 42;
      return (
        <StyledBadge
          variant={'dot'}
          sx={{
            left: left,
            top: top,
          }}
        />
      );
    }
  };

  return (
    <Container>
      <Box>
        <AppBar position={'static'} color={'secondary'} elevation={0}>
          <Tabs value={value} onChange={handleChange} variant={'fullWidth'}>
            <Tab label={t('menutabs-chat')} icon={getBadge(0)} iconPosition="start" />
            <Tab
              label={t('menutabs-people')}
              icon={<Typography variant="caption">({totalParticipants})</Typography>}
              iconPosition="end"
            />
            <Tab label={t('menutabs-messages')} icon={getBadge(2)} iconPosition="start" />
          </Tabs>
        </AppBar>
      </Box>
      <TabPanel value={value} index={0}>
        <Chat />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Participants />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChatOverview />
      </TabPanel>
    </Container>
  );
};

export default MenuTabs;
