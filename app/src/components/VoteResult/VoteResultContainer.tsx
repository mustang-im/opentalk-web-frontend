import { styled, Typography, Container, IconButton, Grid, Stack, Tooltip } from '@mui/material';
import { ParticipantId, PollId, LegalVoteId, CloseIcon } from '@opentalk/common';
import { LegalVoteType, VoteOption, legalVoteStore } from '@opentalk/components';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { Choice, ChoiceResult } from '../../api/types/incoming/poll';
import legalVoteSignaling from '../../api/types/outgoing/legal-vote';
import { vote as pollVote } from '../../api/types/outgoing/poll';
import VoteResultTable from '../../features/VoteResultTable';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectPollVoteById, closeResultWindow as closePollResultWindow, voted } from '../../store/slices/pollSlice';
import { setVotePollIdToShow } from '../../store/slices/uiSlice';
import { selectIsModerator, selectOurUuid } from '../../store/slices/userSlice';
import VoteResult from './VoteResult';

const TooltipIcon = styled('div')(({ color }) => ({
  width: '1rem',
  height: '1rem',
  borderRadius: '100%',
  marginRight: '1rem',
  background: color,
}));

const MainContainer = styled(Container)(({ theme }) => ({
  background: theme.palette.background.voteResult,
  position: 'fixed',
  top: '10rem',
  left: '25rem',
  width: '30rem',
  borderRadius: '1rem',
  display: 'flex',
  gap: '1rem',
  padding: theme.spacing(2),
  justifyContent: 'space-evenly',
  flexDirection: 'column',
  zIndex: 1000,
}));

const StyledStack = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2, 0, 2, 2),
  width: '100%',
}));

const TopicTypography = styled(Typography)({
  wordBreak: 'break-word',
});

interface IVoteResultContainerProps {
  legalVoteId: PollId | LegalVoteId;
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
  hidden?: boolean;
}

const VoteResultContainer = ({ legalVoteId }: IVoteResultContainerProps) => {
  const dispatch = useAppDispatch();
  const ourUuid = useAppSelector(selectOurUuid);
  const { t } = useTranslation();
  const currentLegalVote = useAppSelector(legalVoteStore.selectVoteById(legalVoteId));
  const currentPoll = useAppSelector(selectPollVoteById(legalVoteId));
  const isModerator = useAppSelector(selectIsModerator);

  const closeResultWindow = () => {
    dispatch(closePollResultWindow());
    dispatch(legalVoteStore.closeResultWindow());
    dispatch(setVotePollIdToShow(undefined));
  };

  const vote: Vote | LegalVoteType | undefined = currentLegalVote || currentPoll;

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

  const allowedToVote = ourUuid
    ? (vote as LegalVoteType)?.allowedParticipants?.includes(ourUuid as ParticipantId)
    : false;

  const mapVoteKey = (key: string) => {
    return t(`legal-vote-${key}-label`);
  };

  const renderVoteResult = () => {
    if (vote?.votes !== undefined) {
      return (
        <Grid container spacing={2} direction={'column'}>
          {Object.keys(vote.votes).map(
            (voteKey, index) =>
              (voteKey !== 'abstain' || (voteKey === 'abstain' && (vote as LegalVoteType)?.enableAbstain)) && (
                <Grid item key={index}>
                  <VoteResult
                    key={index}
                    title={mapVoteKey(voteKey as VoteOption)}
                    optionIndex={index}
                    voteData={{
                      votePercentage:
                        vote?.votes && vote?.votes[voteKey as VoteOption] != 0
                          ? (vote?.votes[voteKey as VoteOption] / numberOfVotes) * 100
                          : 0,
                      numberOfVotes,
                      currentVotes: vote?.votes ? vote?.votes[voteKey as VoteOption] : 0,
                      isVotable: allowedToVote && Boolean(vote?.state === 'active'),
                      legalVoteId: vote?.id as LegalVoteId,
                    }}
                    onVote={() => {
                      dispatch(
                        legalVoteSignaling.actions.vote.action({
                          legalVoteId: vote?.id as LegalVoteId,
                          option: voteKey as VoteOption,
                        })
                      );
                    }}
                  />
                </Grid>
              )
          )}
        </Grid>
      );
    }

    return (
      <Grid container spacing={2} direction={'column'}>
        {vote &&
          isVote(vote) &&
          vote?.choices &&
          vote?.choices.map((choice, index) => {
            const result = vote?.results?.find((result) => result.id === choice.id);
            return (
              <Grid item key={index}>
                <VoteResult
                  key={index}
                  title={choice.content || ''}
                  optionIndex={index}
                  voteData={{
                    votePercentage: result !== undefined ? (result.count / numberOfVotes) * 100 : 0,
                    numberOfVotes,
                    currentVotes: result !== undefined ? result.count : 0,
                    isVotable: vote.voted ? !vote.voted : Boolean(vote?.state === 'active'),
                    legalVoteId: vote?.id,
                  }}
                  onVote={() => {
                    dispatch(voted({ id: vote?.id as PollId }));
                    dispatch(pollVote.action({ pollId: vote?.id as PollId, choiceId: choice.id }));
                  }}
                  showResult={vote.live || vote?.state === 'finished'}
                />
              </Grid>
            );
          })}
      </Grid>
    );
  };

  const renderLiveIndicator = (vote: Vote | undefined) => {
    if (vote && 'live' in vote) {
      const liveTooltip = t('votes-result-live-tooltip');
      const notLiveTooltip = t('votes-result-not-live-tooltip');
      return (
        <Grid item container alignItems={'flex-start'} justifyContent={'space-between'} spacing={0}>
          <Grid item>
            <TopicTypography>{vote?.topic}</TopicTypography>
          </Grid>
          <Grid item>
            {vote?.live ? (
              <Tooltip title={liveTooltip}>
                <TooltipIcon color={'green'} />
              </Tooltip>
            ) : (
              <Tooltip title={notLiveTooltip}>
                <TooltipIcon color={'red'} />
              </Tooltip>
            )}
          </Grid>
        </Grid>
      );
    }
    return <TopicTypography>{vote?.topic}</TopicTypography>;
  };

  const getSubtitle = (vote: LegalVoteType | undefined) => {
    if (vote && 'subtitle' in vote) {
      return vote?.subtitle;
    }
    return undefined;
  };

  return (
    <MainContainer>
      <Grid container spacing={2}>
        <Stack width={'100%'} alignItems={'flex-end'}>
          <IconButton onClick={closeResultWindow} aria-label="close-vote-results">
            <CloseIcon />
          </IconButton>
        </Stack>
        <StyledStack sx={{ width: '100%' }} spacing={1}>
          {!allowedToVote && (vote as LegalVoteType)?.allowedParticipants?.length && (
            <Typography color={'primary'} textAlign={'center'}>
              {t('legal-vote-not-selected')}
            </Typography>
          )}
          <Typography variant={'h2'}>{vote?.name}</Typography>
          {getSubtitle(vote as LegalVoteType) && (
            <TopicTypography>{getSubtitle(vote as LegalVoteType)}</TopicTypography>
          )}
          {renderLiveIndicator(vote as Vote)}
        </StyledStack>
        <Grid item container spacing={1}>
          <Grid item xs={12}>
            {renderVoteResult()}
          </Grid>
        </Grid>
        {vote?.voted && (
          <StyledStack>
            <Typography color={'primary'}>{t('legal-vote-success')}</Typography>
          </StyledStack>
        )}
        {vote && currentLegalVote && isModerator && isVote(vote) && !vote.hidden && (
          <StyledStack>
            <VoteResultTable voteId={currentLegalVote.id} />
          </StyledStack>
        )}
      </Grid>
    </MainContainer>
  );
};

export default VoteResultContainer;
