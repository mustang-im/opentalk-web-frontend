// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';
import { automodStore, TalkingStickParticipantList } from '@opentalk/components';
import React from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectTalkingStickParticipants } from '../../store/selectors';
import { setParticipantsSearchValue } from '../../store/slices/uiSlice';
import SearchTextField from '../SearchTextField';
import ParticipantList from './fragments/ParticipantList';

const Participants = () => {
  const dispatch = useAppDispatch();
  const isAutomodActive = useAppSelector(automodStore.selectAutomodActiveState);
  const talkingStickParticipants = useAppSelector(selectTalkingStickParticipants);

  return (
    <Stack flex={1} spacing={2} overflow="hidden">
      {isAutomodActive ? (
        <TalkingStickParticipantList participants={talkingStickParticipants} />
      ) : (
        <>
          <SearchTextField onSearch={(v) => dispatch(setParticipantsSearchValue(v))} fullWidth showSort />
          <ParticipantList />
        </>
      )}
    </Stack>
  );
};

export default Participants;
