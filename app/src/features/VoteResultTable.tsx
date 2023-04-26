// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { legalVoteStore } from '@opentalk/components';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../hooks';
import VoteEmptyRow from './VoteEmptyRow';
import VoteResultCountRow from './VoteResultCountRow';
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
  scrollToResults: () => void;
}

function VoteResultTable(props: VoteResultTableProps) {
  const { t } = useTranslation();
  const vote = useAppSelector(legalVoteStore.selectVoteById(props.voteId));

  if (!vote) {
    return null;
  }

  useEffect(() => {
    props.scrollToResults();
  }, []);

  const participants = Object.entries(vote.votingRecord || {});
  const total = vote.votes['yes'] + vote.votes['no'] + vote.votes['abstain'];

  return (
    <CustomTable stickyHeader={true}>
      <TableHead>
        <TableRow>
          <TableCell>{t('global-participants')}</TableCell>
          <TableCell>
            {t('legal-vote-yes-label')} ({vote.votes['yes'] || 0})
          </TableCell>
          <TableCell>
            {t('legal-vote-no-label')} ({vote.votes['no'] || 0})
          </TableCell>
          <TableCell>
            {t('legal-vote-abstain-label')} ({vote.votes['abstain'] || 0})
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {participants.length === 0 && <VoteEmptyRow />}
        {participants.map(([participantId, selectedVote]) => {
          return (
            <VoteResultRow
              key={participantId}
              participantId={vote.kind !== 'pseudonymous' ? participantId : ''}
              selectedVote={selectedVote}
              token={vote.kind === 'pseudonymous' ? participantId : ''}
            />
          );
        })}
        {participants.length !== 0 && <VoteResultCountRow total={total} />}
      </TableBody>
    </CustomTable>
  );
}

export default VoteResultTable;
