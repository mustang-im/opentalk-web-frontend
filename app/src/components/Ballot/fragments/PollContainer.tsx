// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Grid, IconButton, Typography } from '@mui/material';
import { FC, FormEvent, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { batch } from 'react-redux';

import { vote as sendPollChoiceToAPI } from '../../../api/types/outgoing/poll';
import { CloseIcon } from '../../../assets/icons';
import { useAppDispatch } from '../../../hooks';
import { Poll, voted } from '../../../store/slices/pollSlice';
import { ChoiceId, PollId } from '../../../types';
import { ActiveStateChip } from './ActiveStateChip';
import { Fieldset } from './Fieldset';
import { LiveIndicator } from './LiveIndicator';
import VoteResult, { VoteType } from './VoteResult';

type PollContainerProps = {
  poll: Poll;
  onClose(): void;
};

export const PollContainer: FC<PollContainerProps> = ({ poll, onClose }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [selectedPollOption, setSelectedPollOption] = useState<{
    pollId?: PollId;
    choiceId?: ChoiceId;
  }>({});
  const isPollActive = poll.state === 'active';
  const submittedPollOption = poll.voted;
  const isSubmitButtonDisabled = submittedPollOption || selectedPollOption.choiceId === undefined;
  const initialSum = 0;
  const numberOfVotes = poll.results?.reduce((sum, result) => sum + result.count, initialSum) || initialSum;

  useEffect(() => {
    setSelectedPollOption({});
  }, [poll]);

  const submitPollOption = (event: FormEvent) => {
    event.preventDefault();
    batch(() => {
      if (selectedPollOption.pollId && selectedPollOption.choiceId !== undefined) {
        const { pollId, choiceId } = selectedPollOption;
        dispatch(voted({ pollId, choiceId }));
        dispatch(sendPollChoiceToAPI.action({ pollId, choiceId }));
      }
    });
  };

  return (
    <Grid container rowSpacing={1.4} width="100%">
      <Grid item xs={12} style={{ scrollBehavior: 'smooth' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" flex={1} gap={1}>
          <ActiveStateChip
            size="medium"
            label={t(`ballot-overview-panel-status-${poll?.state}`)}
            color={isPollActive ? 'success' : 'error'}
            variant="filled"
            clickable={false}
          />
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
      <Grid component="form" container item xs={12} onSubmit={submitPollOption}>
        <Grid item xs={12}>
          <Fieldset>
            <legend id="poll-result-legend">
              <Typography variant="body1" component="h4">
                {poll.topic}
              </Typography>
            </legend>
            <LiveIndicator isLive={poll.live} />
            {poll.choices.map((choice, index) => {
              const result = poll.results.find((result) => result.id === choice.id);

              return (
                <VoteResult
                  key={index}
                  voteType={VoteType.Poll}
                  title={choice.content}
                  optionIndex={index}
                  voteData={{
                    votePercentage: result !== undefined ? (result.count / numberOfVotes) * 100 : 0,
                    numberOfVotes,
                    currentVotes: result !== undefined ? result.count : 0,
                    isVotable: isPollActive,
                    legalVoteId: poll.id,
                  }}
                  isChecked={selectedPollOption.choiceId === choice.id || poll.selectedChoiceId === choice.id}
                  onVote={() => {
                    setSelectedPollOption({
                      pollId: poll.id,
                      choiceId: choice.id,
                    });
                  }}
                  showResult={poll.live || poll.state === 'finished'}
                />
              );
            })}
          </Fieldset>
        </Grid>
        <Grid item xs={12} my={1} container justifyContent="stretch">
          <Button type="submit" disabled={isSubmitButtonDisabled} fullWidth>
            {t('global-submit')}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
