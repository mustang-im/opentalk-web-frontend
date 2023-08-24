// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, List, ListItem, styled, Typography, Stack } from '@mui/material';
import { ParticipantId, TargetId, ChatScope, ChatMessage as ChatMessageType } from '@opentalk/common';
import React, { useEffect, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as EncryptedMessagesImage } from '../../../assets/images/encrypted-messages-illustration.svg';
import { useAppSelector } from '../../../hooks';
import { selectCombinedMessageAndEvents } from '../../../store/selectors';
import type { RoomEvent } from '../../../store/slices/eventSlice';
import { selectChatSearchValue } from '../../../store/slices/uiSlice';
import ChatMessage from './ChatMessage';
import NoSearchResult from './NoSearchResult';

const ChatOrderedList = styled(List)<{ empty?: boolean }>(({ theme, empty }) => ({
  flex: '1 1 auto',
  overflowY: 'auto',
  height: 0,
  textAlign: 'left',
  width: '100%',
  paddingRight: theme.spacing(1),
  display: empty ? 'none' : 'block',
}));

type ChatListProps = {
  scope: ChatScope;
  targetId?: TargetId;
  participant?: ParticipantId;
  onReset?: () => void;
};

const defaultProps: ChatListProps = {
  scope: ChatScope.Global,
};

const ChatList = ({ scope, targetId, onReset }: ChatListProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Everytime selectCombinedMessageAndEvents is called new array is returned regardless of changes.
  const combinedMessageAndEvents = useAppSelector(selectCombinedMessageAndEvents(scope, targetId));
  const { t } = useTranslation();
  const chatSearchValue = useAppSelector(selectChatSearchValue);

  const searchedMessages = useMemo(() => {
    if (!chatSearchValue) {
      return combinedMessageAndEvents;
    }

    // TODO: we need a common interface for messages and events in order not to use 'any'.
    return combinedMessageAndEvents.reduce((output, record: ChatMessageType | RoomEvent) => {
      if (Object.prototype.hasOwnProperty.call(record, 'event')) return output;
      // TODO: naive approach that fails for languages such as turkish, spanish, french
      // as we cannot search for words such as "mañana" with "manana" or "Günaydın" with "gunaydin".
      // this should be extended if we start introducing new languages. One potential solution
      // would be to use `locale-index-of` npm package.
      if ((record as ChatMessageType).content.toLowerCase().indexOf(chatSearchValue.toLowerCase()) > -1) {
        output.push(record as ChatMessageType);
      }

      return output;
    }, [] as ChatMessageType[]);
  }, [combinedMessageAndEvents, chatSearchValue]);

  useEffect(() => {
    if (scrollRef.current !== null) {
      scrollRef.current.scrollIntoView();
    }
  }, [combinedMessageAndEvents.length, searchedMessages.length]);

  if (combinedMessageAndEvents.length > 0) {
    return (
      <>
        {chatSearchValue && searchedMessages.length === 0 && <NoSearchResult onReset={onReset} />}
        <ChatOrderedList data-testid={'combined-messages'} empty={searchedMessages.length === 0 || undefined}>
          {searchedMessages.map((chatMessage) => (
            <ListItem key={chatMessage.id} disableGutters>
              <ChatMessage message={chatMessage} />
            </ListItem>
          ))}
          <div ref={scrollRef} />
        </ChatOrderedList>
      </>
    );
  }

  return (
    <Stack flex={1} overflow="hidden" justifyContent="center">
      <Stack data-testid={'no-messages'} alignItems="center" overflow="auto" spacing={2}>
        <Box>
          <EncryptedMessagesImage width={'7em'} height={'7em'} />
        </Box>
        <Typography align={'center'} variant={'body2'}>
          {t('encrypted-messages')}
        </Typography>
      </Stack>
    </Stack>
  );
};

ChatList.defaultProps = defaultProps;

export default ChatList;
