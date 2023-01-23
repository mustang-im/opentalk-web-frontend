// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import React from 'react';

import { useAppDispatch } from '../../hooks';
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

  return (
    <Container>
      <SearchTextField onSearch={(v) => dispatch(setParticipantsSearchValue(v))} fullWidth showSort />
      <ParticipantList />
    </Container>
  );
};

export default Participants;
