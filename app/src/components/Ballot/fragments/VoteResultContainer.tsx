// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography, IconButton, Grid, Stack, Tooltip, Box, Chip as MuiChip, Button } from '@mui/material';
import {
  ParticipantId,
  PollId,
  LegalVoteId,
  CloseIcon,
  useDateFormat,
  Choice,
  ChoiceResult,
  getCurrentTimezone,
  ChoiceId,
} from '@opentalk/common';
import {
  LegalVoteType,
  VoteOption,
  legalVoteStore,
  LegalVoteCountdown,
  LegalVoteTokenClipboard,
} from '@opentalk/components';
import { FormEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { batch } from 'react-redux';

import legalVoteSignaling from '../../../api/types/outgoing/legal-vote';
import { vote as pollVote } from '../../../api/types/outgoing/poll';
import VoteResultTable from '../../../features/VoteResultTable';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectPollById, voted } from '../../../store/slices/pollSlice';
import { setVoteOrPollIdToShow } from '../../../store/slices/uiSlice';
import { selectOurUuid } from '../../../store/slices/userSlice';
import VoteResult, { VoteType } from './VoteResult';
import VoteResultDate from './VoteResultDate';

const TooltipIcon = styled('div')(({ color }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '100%',
  marginRight: '1rem',
  background: color,
}));

const Chip = styled(MuiChip)(() => ({
  marginLeft: 0,
  borderRadius: 0,
  borderColor: 'transparent',
  pointerEvents: 'none',
  '& .MuiChip-label': {
    paddingRight: 0,
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));

const CustomFieldset = styled('fieldset')(({ theme }) => ({
  border: 'none',
  padding: 0,
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  '& legend': {
    width: '100%',
    padding: 0,
    margin: 0,
    color: theme.palette.text.primary,
  },
}));

const CustomForm = styled('form')(() => ({
  width: '100%',
}));

interface VoteResultContainerProps {
  voteOrPollId: PollId | LegalVoteId;
  onClose: () => void;
}

export interface Vote {
  id: PollId | LegalVoteId;
  voters?: Record<ParticipantId, VoteOption>;
  choices?: Array<Choice>;
  results?: Array<ChoiceResult>;
  name?: string;
  topic: string;
  votes?: Record<VoteOption, number>;
  state: 'active' | 'finished' | 'canceled';
  voted: boolean;
  live?: boolean;
}

const VoteResultContainer = ({ voteOrPollId, onClose }: VoteResultContainerProps) => {
  const dispatch = useAppDispatch();
  const ourUuid = useAppSelector(selectOurUuid);
  const { t } = useTranslation();
  const currentLegalVote = useAppSelector(legalVoteStore.selectVoteById(voteOrPollId));
  const currentPoll = useAppSelector(selectPollById(voteOrPollId));
  const startTime = new Date(currentLegalVote?.startTime ?? new Date());
  const formattedTime = useDateFormat(startTime, 'time');
  const [showResults, setShowResults] = useState(false);
  const [selectedPollOption, setSelectedPollOption] = useState<{
    id?: PollId;
    choiceId?: ChoiceId;
  }>({});
  const isLiveVote = currentLegalVote?.kind === 'live_roll_call' || currentLegalVote?.kind === 'roll_call';

  const vote: Vote | LegalVoteType | undefined = currentLegalVote || currentPoll;
  const isVoteActive = vote?.state === 'active';
  const [selectedLegalVoteOption, setSelectedLegalVoteOption] = useState<VoteOption | undefined>(
    currentLegalVote?.selectedOption
  );

  const submittedLegalVoteOption = Boolean(currentLegalVote?.votedAt);
  const submittedPollOption = Boolean(currentPoll?.voted);

  // to uncheck all checkboxes on every new voting
  useEffect(() => {
    setSelectedLegalVoteOption(undefined);
    setSelectedPollOption({});
  }, [voteOrPollId]);

  let numberOfVotes = 0;

  if (currentLegalVote !== undefined && vote) {
    numberOfVotes = Object.values(vote?.votes || {}).reduce(function sumVotes(sum, totalVotesForCurrentOption) {
      return sum + totalVotesForCurrentOption;
    }, 0);
  }

  function isVote(vote: Vote | LegalVoteType): vote is Vote {
    return (vote as Vote).results !== undefined;
  }

  if (currentPoll !== undefined && vote) {
    numberOfVotes = (isVote(vote) && vote?.results?.reduce((acc, result) => acc + result.count, 0)) || 0;
  }

  const isSubmitButtonDisabled =
    !isVoteActive ||
    submittedLegalVoteOption ||
    submittedPollOption ||
    (!selectedPollOption.id && !selectedLegalVoteOption);
  const isRenderingLegalVote = currentLegalVote && currentLegalVote.votes !== undefined;
  const allowedToVote = ourUuid ? Boolean(currentLegalVote?.allowedParticipants?.includes(ourUuid)) : false;
  const showSubmitButton = isRenderingLegalVote ? allowedToVote : true; // We hide submit button only for users that cannot place a legal vote.

  useEffect(() => {
    vote && setVoteOrPollIdToShow(vote.id);
  }, [vote]);

  const mapVoteKey = (key: string) => {
    return t(`legal-vote-${key}-label`);
  };

  const submitLegalVoteOption = (event: FormEvent) => {
    event.preventDefault();
    if (!currentLegalVote || !currentLegalVote.id || !selectedLegalVoteOption) {
      return;
    }
    batch(() => {
      dispatch(
        legalVoteStore.actions.saveSelectedOption({
          legalVoteId: currentLegalVote.id,
          selectedOption: selectedLegalVoteOption,
        })
      );
      dispatch(
        legalVoteSignaling.actions.vote.action({
          legalVoteId: currentLegalVote.id,
          option: selectedLegalVoteOption,
          token: currentLegalVote?.token || '',
          timezone: getCurrentTimezone(),
        })
      );
    });
  };

  const submitPollVoteOption = (event: FormEvent) => {
    event.preventDefault();
    batch(() => {
      if (selectedPollOption.id && selectedPollOption.choiceId !== undefined) {
        dispatch(voted({ id: selectedPollOption.id as PollId, selectedChoiceId: selectedPollOption.choiceId }));
        dispatch(pollVote.action({ pollId: selectedPollOption.id as PollId, choiceId: selectedPollOption.choiceId }));
      }
    });
  };

  const renderVoteResult = () => {
    if (isRenderingLegalVote) {
      return (
        <>
          {Object.keys(currentLegalVote.votes).map(
            (voteKey, index) =>
              (voteKey !== 'abstain' || (voteKey === 'abstain' && currentLegalVote.enableAbstain)) && (
                <VoteResult
                  key={index}
                  title={mapVoteKey(voteKey as VoteOption)}
                  optionIndex={index}
                  voteType={VoteType.LegalVote}
                  voteData={{
                    votePercentage:
                      currentLegalVote.votes && currentLegalVote.votes[voteKey as VoteOption] != 0
                        ? (currentLegalVote.votes[voteKey as VoteOption] / numberOfVotes) * 100
                        : 0,
                    numberOfVotes,
                    currentVotes: currentLegalVote.votes ? currentLegalVote.votes[voteKey as VoteOption] : 0,
                    isVotable: isVoteActive && allowedToVote,
                    legalVoteId: currentLegalVote.id as LegalVoteId,
                  }}
                  isChecked={voteKey === selectedLegalVoteOption}
                  onVote={() => {
                    setSelectedLegalVoteOption(voteKey as VoteOption);
                  }}
                />
              )
          )}
        </>
      );
    }

    return (
      <>
        {currentPoll &&
          currentPoll.choices &&
          currentPoll.choices.map((choice, index) => {
            const result = currentPoll.results?.find((result) => result.id === choice.id);
            return (
              <VoteResult
                key={index}
                voteType={VoteType.Poll}
                title={choice.content || ''}
                optionIndex={index}
                voteData={{
                  votePercentage: result !== undefined ? (result.count / numberOfVotes) * 100 : 0,
                  numberOfVotes,
                  currentVotes: result !== undefined ? result.count : 0,
                  isVotable: isVoteActive,
                  legalVoteId: currentPoll.id,
                }}
                isChecked={selectedPollOption.choiceId === choice.id || currentPoll.selectedChoiceId === choice.id}
                onVote={() => {
                  setSelectedPollOption({
                    id: currentPoll.id,
                    choiceId: choice.id,
                  });
                }}
                showResult={currentPoll.live || currentPoll.state === 'finished'}
              />
            );
          })}
      </>
    );
  };

  const renderLiveIndicator = (vote: Vote | undefined) => {
    if (vote && 'live' in vote) {
      const liveTooltip = t('votes-result-live-tooltip');
      const notLiveTooltip = t('votes-result-not-live-tooltip');
      return (
        <Box mt={1}>
          <Tooltip title={vote?.live ? liveTooltip : notLiveTooltip}>
            <TooltipIcon color={vote?.live ? 'green' : 'red'} />
          </Tooltip>
        </Box>
      );
    }
  };

  const getSubtitle = (vote: LegalVoteType | undefined) => {
    if (vote && 'subtitle' in vote) {
      return vote?.subtitle === '' ? null : vote.subtitle;
    }
    return null;
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowResults(false);
  }, [currentLegalVote]);

  const showResultsHandler = () => {
    setShowResults(true);
  };

  const scrollToResults = () => {
    if (resultsRef && resultsRef.current && resultsRef.current.scrollIntoView) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isTableHintVisible = () => {
    if (isLiveVote || currentLegalVote === undefined || currentLegalVote.votingRecord === undefined || !allowedToVote) {
      return false;
    }
    const hasResults = Object.keys(currentLegalVote.votingRecord).length > 0;
    return hasResults;
  };

  const showResultTable = (isLiveVote || showResults) && currentLegalVote && allowedToVote;

  return (
    <Grid container rowSpacing={1.4} sx={{ width: '100%' }}>
      <Grid item xs={12} style={{ scrollBehavior: 'smooth' }}>
        <Stack width="100%" direction="row" alignItems="center" justifyContent="space-between" gap={1}>
          <Box display="flex" alignItems="center" flex={1} gap={1}>
            <Chip
              size="medium"
              label={t(`legal-vote-overview-panel-status-${vote?.state}`)}
              color={vote?.state === 'active' ? 'success' : 'error'}
              variant="filled"
              clickable={false}
            />
            {currentLegalVote && <Box>{formattedTime}</Box>}
            {currentLegalVote && currentLegalVote.duration && currentLegalVote.startTime && (
              <LegalVoteCountdown
                duration={currentLegalVote.duration}
                startTime={currentLegalVote.startTime}
                active={currentLegalVote.state === 'active'}
              />
            )}
          </Box>
          <IconButton
            onClick={onClose}
            aria-label={t('global-close-dialog')}
            // When we open up vote result dialog, we want to place a focus
            // inside of it, so the content can be read by the screenreader.
            // FIXME: there is an issue with starting new votes without closing old ones
            // because component never unmounts, so autofocus is no re-applied.
            /* eslint-disable jsx-a11y/no-autofocus */
            autoFocus
          >
            <CloseIcon />
          </IconButton>
        </Stack>
      </Grid>
      <CustomForm onSubmit={isRenderingLegalVote ? submitLegalVoteOption : submitPollVoteOption} method="POST">
        <CustomFieldset>
          <legend id="vote-result-legend">
            {vote?.name && (
              <Typography variant="h2" component="h3">
                {vote.name}
              </Typography>
            )}
            {getSubtitle(vote as LegalVoteType) && (
              <Typography variant="body1" component="h4">
                {getSubtitle(vote as LegalVoteType)}
              </Typography>
            )}
            {vote?.topic && (
              <Typography variant="body1" component="h4">
                {vote.topic}
              </Typography>
            )}
          </legend>
          {renderLiveIndicator(vote as Vote)}
          {renderVoteResult()}
        </CustomFieldset>
        {!allowedToVote && (vote as LegalVoteType)?.allowedParticipants?.length && (
          <Grid item xs={12} container justifyContent="flex-start">
            <Typography color={'primary'} textAlign={'center'}>
              {t('legal-vote-not-selected')}
            </Typography>
          </Grid>
        )}
        {showSubmitButton && (
          <Grid item xs={12} my={1} container justifyContent="stretch">
            <Button type="submit" disabled={isSubmitButtonDisabled} fullWidth>
              {t('global-submit')}
            </Button>
          </Grid>
        )}
      </CustomForm>
      {currentLegalVote?.votedAt && allowedToVote && (
        <Grid item xs={12}>
          <VoteResultDate
            date={new Date(currentLegalVote?.votedAt)}
            state={currentLegalVote.state}
            showTableHint={isTableHintVisible()}
            showResultsHandler={showResultsHandler}
          />
        </Grid>
      )}
      {currentLegalVote && currentLegalVote.votedAt && currentLegalVote.state === 'finished' && allowedToVote && (
        <Grid item xs={12}>
          <LegalVoteTokenClipboard
            name={currentLegalVote.name}
            timestamp={currentLegalVote.votedAt || ''}
            token={currentLegalVote.token || ''}
            vote={t(`legal-vote-${selectedLegalVoteOption}-label`) as string}
          />
        </Grid>
      )}
      {showResultTable && Object.keys(currentLegalVote?.votingRecord || {}).length !== 0 && (
        <Grid ref={resultsRef} item xs={12}>
          <VoteResultTable scrollToResults={scrollToResults} voteId={currentLegalVote.id} />
        </Grid>
      )}
    </Grid>
  );
};

export default VoteResultContainer;
