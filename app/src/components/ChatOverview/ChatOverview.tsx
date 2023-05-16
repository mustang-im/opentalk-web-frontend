// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, List as MuiList, styled, Typography } from '@mui/material';
import { BackIcon, NewMessageIcon, ChatScope, TargetId } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as NoNewMessageImage } from '../../assets/images/no-messages-illustration.svg';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectAllPersonalChats } from '../../store/slices/chatSlice';
import { selectAllOnlineParticipants } from '../../store/slices/participantsSlice';
import { chatConversationStateSet, selectChatConversationState } from '../../store/slices/uiSlice';
import Chat from '../Chat';
import ChatOverviewItem from './fragments/ChatOverviewItem';
import NewMessagePopover from './fragments/NewMessagePopover';

const List = styled(MuiList)({
  '& > * > *': {
    borderTop: `1px solid #385865`,
  },
  '& > :last-child > *': {
    borderBottom: `1px solid #385865`,
  },
  flex: 1,
});

const ChatOverview = () => {
  const chatConversationState = useAppSelector(selectChatConversationState);
  const { t } = useTranslation();
  const chats = useAppSelector(selectAllPersonalChats);
  const dispatch = useAppDispatch();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();
  const participants = useAppSelector(selectAllOnlineParticipants);

  const setSelectedChat = (scope: ChatScope, targetId: TargetId) => {
    dispatch(
      chatConversationStateSet({
        scope: scope,
        targetId: targetId,
      })
    );
  };

  const newMessageClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const resetSelectedChat = () => {
    dispatch(
      chatConversationStateSet({
        scope: undefined,
        targetId: undefined,
      })
    );
  };

  const renderChats = () =>
    chats.length > 0 ? (
      <List>
        {chats.map((chat) =>
          chat.scope !== ChatScope.Global ? (
            <ChatOverviewItem key={chat.id} onClick={() => setSelectedChat(chat.scope, chat.id)} chat={chat} />
          ) : null
        )}
      </List>
    ) : (
      <Box px={2} flex={1} display={'flex'} flexDirection={'column'} justifyContent={'center'} alignItems={'center'}>
        <NoNewMessageImage width={'7.5em'} height={'7.5em'} />
        <Typography align={'center'} variant={'body2'}>
          {t('empty-messages')}
        </Typography>
      </Box>
    );

  if (chatConversationState.scope !== undefined && chatConversationState.targetId !== undefined)
    return (
      <Box display={'flex'} flex={1} pt={2} flexDirection={'column'} width="100%">
        <div>
          <Button
            size={'small'}
            startIcon={<BackIcon />}
            variant={'text'}
            color={'secondary'}
            onClick={resetSelectedChat}
          >
            {t('button-back-messages')}
          </Button>
        </div>
        <Chat scope={chatConversationState.scope} target={chatConversationState.targetId} />
      </Box>
    );

  const open = Boolean(anchorEl);
  return (
    <Box flex={1} display={'flex'} pt={2} flexDirection={'column'} maxWidth={'100%'}>
      <Box>
        <Button
          size={'small'}
          disabled={participants.length === 0}
          onClick={newMessageClickHandler}
          variant={'text'}
          focusRipple={true}
          startIcon={<NewMessageIcon />}
        >
          {t('button-new-message')}
        </Button>
      </Box>
      <NewMessagePopover open={open} setAnchorEl={setAnchorEl} anchorEl={anchorEl} />
      {renderChats()}
    </Box>
  );
};

export default ChatOverview;
