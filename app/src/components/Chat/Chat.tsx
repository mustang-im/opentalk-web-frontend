// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { TargetId, ChatScope } from '@opentalk/common';
import { debounce } from 'lodash';
import React, { useCallback, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../hooks';
import { selectChatSearchValue, setChatSearchValue } from '../../store/slices/uiSlice';
import ChatForm from './fragments/ChatForm';
import ChatList from './fragments/ChatList';
import ChatSearch from './fragments/ChatSearch';

const Container = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  flex: 1,
  marginTop: theme.spacing(2),
  gap: theme.spacing(1),
  maxWidth: '100%',
}));

interface IChatProps {
  targetId?: TargetId;
  scope?: ChatScope;
}

const Chat = ({ targetId, scope }: IChatProps) => {
  // Default value is used when we switch tabs and component remounts.
  const defaultChatValue = useAppSelector(selectChatSearchValue);
  const [searchValue, setSearchValue] = useState<string>(defaultChatValue);
  const dispatch = useDispatch();
  const chatSearchInputReference = useRef<HTMLInputElement | null>(null);

  const debouncedSetChatSearchValue = useCallback(
    debounce((value: string) => {
      dispatch(setChatSearchValue(value));
    }, 150),
    []
  );

  const onChangeMiddleware = (nextSearchValue: string) => {
    setSearchValue(nextSearchValue);
    debouncedSetChatSearchValue(nextSearchValue);
  };

  const resetSearch = () => {
    setSearchValue('');
    dispatch(setChatSearchValue(''));
    if (chatSearchInputReference.current) {
      chatSearchInputReference.current.focus();
    }
  };

  return (
    <Container data-testid={'chat'}>
      <ChatSearch value={searchValue} onChange={onChangeMiddleware} ref={chatSearchInputReference} />
      <ChatList scope={scope} targetId={targetId} onReset={resetSearch} />
      <ChatForm scope={scope} targetId={targetId} />
    </Container>
  );
};

Chat.defaultProps = {
  scope: ChatScope.Global,
};

export default Chat;
