// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { legalVoteStore } from '@opentalk/components';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../hooks';
import VoteEmptyRow from './VoteEmptyRow';
import VoteResultRow from './VoteResultRow';

const CustomTable = styled(Table)(({ theme }) => ({
  '.MuiTableRow-head > .MuiTableCell-root': {
    backgroundColor: theme.palette.background.paper,
  },
  '.MuiTableBody-root .MuiTableCell-root': {
    borderBottomColor: theme.palette.secondary.light,
  },
}));

interface VoteResultTableProps {
  voteId: string;
}

function VoteResultTable(props: VoteResultTableProps) {
  const { t } = useTranslation();
  const vote = useAppSelector(legalVoteStore.selectVoteById(props.voteId));

  if (!vote) {
    return null;
  }

  const participants = Object.entries(vote.voters || {});

  return (
    <CustomTable stickyHeader={true}>
      <TableHead>
        <TableRow>
          <TableCell>{t('global-participants')}</TableCell>
          <TableCell>{t('legal-vote-yes-label')}</TableCell>
          <TableCell>{t('legal-vote-no-label')}</TableCell>
          <TableCell>{t('legal-vote-abstain-label')}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {participants.length === 0 && <VoteEmptyRow />}
        {participants.map(([participantId, selectedVote]) => {
          return <VoteResultRow key={participantId} participantId={participantId} selectedVote={selectedVote} />;
        })}
      </TableBody>
    </CustomTable>
  );
}

export default VoteResultTable;
