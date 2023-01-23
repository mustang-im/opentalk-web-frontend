// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TableCell, TableRow, Typography } from '@mui/material';
import { VoteOption } from '@opentalk/components';
import { memo } from 'react';

import { useAppSelector } from '../hooks';
import { selectUserAsParticipant } from '../store/selectors';
import { selectParticipantById } from '../store/slices/participantsSlice';

interface VoteResultRowProps {
  participantId: string;
  selectedVote: VoteOption;
  token: string;
}

function VoteResultRow(props: VoteResultRowProps) {
  const participant = useAppSelector(selectParticipantById(props.participantId.toLowerCase()));
  const user = useAppSelector(selectUserAsParticipant);

  if (!user?.id && !participant?.id) {
    return null;
  }

  return (
    <TableRow>
      <TableCell>
        <Typography noWrap component="span" sx={{ maxWidth: '170px', display: 'block' }} title={props.token}>
          {props.token.slice(0, 10)}
        </Typography>
      </TableCell>
      <TableCell>{props.selectedVote === 'yes' ? 'x' : null}</TableCell>
      <TableCell>{props.selectedVote === 'no' ? 'x' : null}</TableCell>
      <TableCell>{props.selectedVote === 'abstain' ? 'x' : null}</TableCell>
    </TableRow>
  );
}

export default memo(VoteResultRow);
