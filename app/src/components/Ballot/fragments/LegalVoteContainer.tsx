// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { batch } from 'react-redux';

import { vote as sendLegalVoteChoiceToAPI } from '../../../api/types/outgoing/legalVote';
import { CloseIcon } from '../../../assets/icons';
import { useAppDispatch, useDateFormat } from '../../../hooks';
import { saveSelectedOption } from '../../../store/slices/legalVoteSlice';
import { LegalVoteType, VoteOption } from '../../../types';
import { getCurrentTimezone } from '../../../utils/timeFormatUtils';
import LegalVoteCountdown from '../../LegalVoteCountdown';
import { LegalVoteTokenClipboard } from '../../LegalVoteTokenClipboard';
import { ActiveStateChip } from './ActiveStateChip';
import { Fieldset } from './Fieldset';
import VoteResult, { VoteType } from './VoteResult';
import VoteResultDate from './VoteResultDate';
import VoteResultTable from './VoteResultTable';

type LegalVoteContainerProps = {
  legalVote: LegalVoteType;
  onClose(): void;
  isAllowedToVote: boolean;
};

// Table is visible for all users who can vote in role_call and live_roll_call (by name)
// button is visible only in the hidden kind of the legal vote
// button in the hidden mode can be seen only after finishing the vote

export const LegalVoteContainer: FC<LegalVoteContainerProps> = ({ legalVote, onClose, isAllowedToVote }) => {
  const { t } = useTranslation();
  const isLegalVoteActive = legalVote?.state === 'active';
  const formattedTime = useDateFormat(new Date(legalVote.startTime), 'time');
  const initialSum = 0;
  const numberOfVotes = Object.values(legalVote.votes || {}).reduce(function sumVotes(sum, totalVotesForCurrentOption) {
    return sum + totalVotesForCurrentOption;
  }, initialSum);
  const [selectedLegalVoteOption, setSelectedLegalVoteOption] = useState<VoteOption | undefined>(
    legalVote.selectedOption
  );
  const isOptionDisabled = Boolean(!isLegalVoteActive || !isAllowedToVote || legalVote.votedAt);
  // you can't vote if vote is not active or you are not selected or you already voted.
  const isSubmitButtonDisabled = Boolean(
    !isLegalVoteActive || !isAllowedToVote || legalVote.votedAt || !selectedLegalVoteOption
  );
  useEffect(
    function resetSelectedLegalVoteOptionOnLegalVoteIdChange() {
      setSelectedLegalVoteOption(legalVote.selectedOption);
    },
    [legalVote.id, legalVote.selectedOption]
  );
  const hasVotes = Object.keys(legalVote.votingRecord || {}).length > 0;
  const isTableHintVisible = legalVote.kind === 'pseudonymous' && isAllowedToVote && !isLegalVoteActive && hasVotes;
  const [showResults, setShowResults] = useState(false);
  const showResultTable = (legalVote.kind !== 'pseudonymous' || showResults) && isAllowedToVote && hasVotes;
  const resultsRef = useRef<HTMLDivElement>(null);
  const scrollToResults = () => {
    if (resultsRef.current) {
      resultsRef.current.scrollTo({ behavior: 'smooth' });
    }
  };
  const dispatch = useAppDispatch();

  const submitLegalVoteOption = (event: FormEvent) => {
    event.preventDefault();
    if (!legalVote || !legalVote.id || !selectedLegalVoteOption) {
      return;
    }
    batch(() => {
      dispatch(
        saveSelectedOption({
          legalVoteId: legalVote.id,
          selectedOption: selectedLegalVoteOption,
        })
      );
      dispatch(
        sendLegalVoteChoiceToAPI.action({
          legalVoteId: legalVote.id,
          option: selectedLegalVoteOption,
          token: legalVote.token || '',
          timezone: getCurrentTimezone(),
        })
      );
    });
  };

  const calculateVotePercentage = (legalVote: LegalVoteType, voteKey: VoteOption): number => {
    return legalVote.votes && legalVote.votes[voteKey] != 0 ? (legalVote.votes[voteKey] / numberOfVotes) * 100 : 0;
  };

  return (
    <Grid container rowSpacing={1.4} width="100%">
      <Grid item xs={12} style={{ scrollBehavior: 'smooth' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flex={1} gap={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <ActiveStateChip
              size="medium"
              label={t(`ballot-overview-panel-status-${legalVote?.state}`)}
              color={isLegalVoteActive ? 'success' : 'error'}
              variant="filled"
              clickable={false}
            />
            <Box>{formattedTime}</Box>
            {typeof legalVote.duration === 'number' && (
              <LegalVoteCountdown
                duration={legalVote.duration}
                startTime={legalVote.startTime}
                active={isLegalVoteActive}
              />
            )}
          </Box>
          <IconButton
            onClick={onClose}
            aria-label={t('global-close-dialog')}
            /* eslint-disable jsx-a11y/no-autofocus */
            autoFocus
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Grid>
      <Grid component="form" container item xs={12} onSubmit={submitLegalVoteOption}>
        <Grid item xs={12}>
          <Fieldset>
            <legend id="vote-result-legend">
              <Typography variant="h2" component="h3">
                {legalVote.name}
              </Typography>
              {legalVote.subtitle && (
                <Typography variant="body1" component="h4">
                  {legalVote.subtitle}
                </Typography>
              )}
              {legalVote.topic && (
                <Typography variant="body1" component="h4">
                  {legalVote.topic}
                </Typography>
              )}
            </legend>
            <Grid item xs={12}>
              {Object.keys(legalVote.votes).map(
                (voteKey, index) =>
                  (voteKey !== 'abstain' || (voteKey === 'abstain' && legalVote.enableAbstain)) && (
                    <VoteResult
                      key={index}
                      title={t(`legal-vote-${voteKey}-label`)}
                      optionIndex={index}
                      voteType={VoteType.LegalVote}
                      voteData={{
                        votePercentage: calculateVotePercentage(legalVote, voteKey as VoteOption),
                        numberOfVotes,
                        currentVotes: legalVote.votes ? legalVote.votes[voteKey as VoteOption] : 0,
                        isVotable: !isOptionDisabled,
                        voteId: legalVote.id,
                      }}
                      isChecked={voteKey === selectedLegalVoteOption}
                      onVote={() => {
                        setSelectedLegalVoteOption(voteKey as VoteOption);
                      }}
                    />
                  )
              )}
            </Grid>
          </Fieldset>
        </Grid>
        {!isAllowedToVote && legalVote.allowedParticipants.length && (
          <Grid item xs={12} container justifyContent="flex-start" mt={1}>
            <Typography color="primary" textAlign="center">
              {t('legal-vote-not-selected')}
            </Typography>
          </Grid>
        )}
        {isAllowedToVote && (
          <Grid item xs={12} my={1} container justifyContent="stretch">
            <Button type="submit" disabled={isSubmitButtonDisabled} fullWidth>
              {t('global-submit')}
            </Button>
          </Grid>
        )}
      </Grid>
      {legalVote.votedAt && isAllowedToVote && (
        <Grid item xs={12}>
          <VoteResultDate
            date={new Date(legalVote.votedAt)}
            state={legalVote.state}
            showTableHint={isTableHintVisible}
            showResultsHandler={() => setShowResults(true)}
          />
        </Grid>
      )}
      {legalVote.votedAt && legalVote.state === 'finished' && isAllowedToVote && legalVote.token && (
        <Grid item xs={12}>
          <LegalVoteTokenClipboard
            name={legalVote.name}
            timestamp={legalVote.votedAt}
            token={legalVote.token}
            vote={t(`legal-vote-${selectedLegalVoteOption}-label`) as string}
          />
        </Grid>
      )}
      {showResultTable && hasVotes && (
        <Grid ref={resultsRef} item xs={12}>
          <VoteResultTable scrollToResults={scrollToResults} voteId={legalVote.id} />
        </Grid>
      )}
    </Grid>
  );
};
