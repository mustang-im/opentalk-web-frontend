// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, List } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React from 'react';

import { MutedParticipant } from '../MuteParticipants';
import MuteParticipantsItem from './MuteParticipantsItem';

type MuteParticipantsListProps = {
  participantsList: MutedParticipant[];
  onCheck: (checked: boolean, participantId: ParticipantId) => void;
};

const ListContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 0.5),
  width: '100%',
  maxHeight: 'calc(100vh - 26em)',
  overflow: 'auto',
}));

const MuteParticipantsList = ({ participantsList, onCheck }: MuteParticipantsListProps) => (
  <ListContainer>
    <List>
      {participantsList.map((participant, index) => (
        <MuteParticipantsItem
          participant={participant}
          onCheck={(checked) => onCheck(checked, participant.id)}
          key={index}
        />
      ))}
    </List>
  </ListContainer>
);

export default MuteParticipantsList;
