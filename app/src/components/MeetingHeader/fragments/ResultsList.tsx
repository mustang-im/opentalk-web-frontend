// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, MenuList, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectAllVotes } from '../../../store/slices/legalVoteSlice';
import { selectAllPolls } from '../../../store/slices/pollSlice';
import ResultsItem from './ResultsItem';

const ResultsList = () => {
  const { t } = useTranslation();
  const votes = useAppSelector(selectAllVotes);
  const polls = useAppSelector(selectAllPolls);

  return (
    <MenuList>
      <Stack p={2}>
        <Typography variant={'h2'} align={'center'}>
          {t('votes-poll-overview-title')}
        </Typography>
      </Stack>
      {votes.map((vote) => (
        <ResultsItem key={vote.id} item={vote} />
      ))}
      {polls.map((poll) => (
        <ResultsItem key={poll.id} item={poll} />
      ))}
    </MenuList>
  );
};

export default ResultsList;
