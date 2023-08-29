// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
   List,
   ListProps,
   styled,
} from '@mui/material';
import { Participant } from '@opentalk/common';
import { FC } from 'react';
import ParticipantListItem from './ParticipantListItem';

const CustomList = styled(List)({
  overflowY: 'auto',
  textAlign: 'left',
  width: '100%',
  height: '100%'
});

interface ParticipantSimpleListProps extends ListProps {
   participants: Participant[];
}

const ParticipantSimpleList: FC<ParticipantSimpleListProps> = ({ participants, ...props }) => {
   return (
      <CustomList {...props}>
         {participants.map((participant) => (
            <ParticipantListItem key={participant.id} participant={participant} />
         ))}
      </CustomList>
   )
}

export default ParticipantSimpleList;