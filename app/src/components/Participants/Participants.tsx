// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { automodStore, TalkingStickParticipantList } from '@opentalk/components';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectTalkingStickParticipants } from '../../store/selectors';
import { setParticipantsSearchValue } from '../../store/slices/uiSlice';
import SearchTextField from '../SearchTextField';
import ParticipantList from './fragments/ParticipantList';

const Container = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(2),
  maxWidth: '100%',
  flex: 1,
}));

const Participants = () => {
  const dispatch = useAppDispatch();
  const isAutomodActive = useAppSelector(automodStore.selectAutomodActiveState);
  const talkingStickParticipants = useAppSelector(selectTalkingStickParticipants);

  return (
    <Container>
      {isAutomodActive ? (
        <TalkingStickParticipantList participants={talkingStickParticipants} />
      ) : (
        <>
          <SearchTextField onSearch={(v) => dispatch(setParticipantsSearchValue(v))} fullWidth showSort />
          <ParticipantList />
        </>
      )}
    </Container>
  );
};

export default Participants;
