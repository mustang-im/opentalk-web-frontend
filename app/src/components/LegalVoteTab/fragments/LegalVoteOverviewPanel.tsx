// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Stack, Typography, Button, Box } from '@mui/material';
import { truncate } from 'lodash';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { cancel, stop } from '../../../api/types/outgoing/legalVote';
import { LegalBallotIcon } from '../../../assets/icons';
import { ProgressBar } from '../../../commonComponents';
import { useDateFormat } from '../../../hooks';
import { LegalVoteType } from '../../../types';
import { getCurrentTimezone } from '../../../utils/timeFormatUtils';
import LegalVoteCountdown from '../../LegalVoteCountdown';

const MainContainer = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  padding: theme.spacing(1.5),
  borderRadius: '0.4rem',
}));

const Divider = styled('div')({
  borderTop: '3px solid #193a47',
});

const VoteState = styled('div')<{ state?: 'active' | 'finished' | 'canceled' }>(({ theme, state }) => ({
  backgroundColor: state === 'active' ? theme.palette.success.main : theme.palette.error.main,
  padding: theme.spacing(0.5),
  fontWeight: 'bold',
}));

const ButtonContainer = styled('div')(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

const TopicTypography = styled(Typography)({
  wordBreak: 'break-word',
});

interface IProps {
  vote: LegalVoteType | undefined;
}

const LegalVoteOverviewPanel = ({ vote }: IProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [dispatchTriggered, setDispatchTriggered] = useState(false);

  const handleCancel = () => {
    if (!vote?.id || dispatchTriggered) {
      return;
    }

    setDispatchTriggered(true);

    dispatch(
      cancel.action({
        legalVoteId: vote?.id,
        reason: 'Testing reasons',
        timezone: getCurrentTimezone(),
      })
    );
  };

  const handleEnd = () => {
    if (!vote?.id || dispatchTriggered) {
      return;
    }

    setDispatchTriggered(true);

    dispatch(
      stop.action({
        legalVoteId: vote?.id,
        timezone: getCurrentTimezone(),
      })
    );
  };

  const startTime = new Date(vote ? vote?.localStartTime : '');
  const endTime = startTime.getTime() + (vote?.duration ? vote?.duration : 0) * 1000;
  const formattedStartTime = useDateFormat(startTime, 'time');
  const getVotedNumber = () => (vote?.votingRecord !== undefined ? Object.keys(vote.votingRecord).length : 0);
  const MAX_TOPIC_LENGTH = 120;

  return (
    <MainContainer spacing={2}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center">
          <VoteState state={vote?.state}>{t(`ballot-overview-panel-status-${vote?.state}`)}</VoteState>
          <Typography ml={1}>{`${formattedStartTime}`}</Typography>
        </Box>
        {vote && (
          <LegalVoteCountdown
            duration={vote.duration || 0}
            startTime={vote.startTime}
            active={vote.state === 'active'}
            flex={1}
            justifyContent="flex-end"
          />
        )}
      </Box>
      <Stack spacing={1}>
        {vote?.duration && (
          <ProgressBar
            endTime={endTime}
            startTime={startTime.getTime()}
            isFinished={Boolean(vote?.state !== 'active')}
          />
        )}
        <Divider />
        <Typography noWrap align="center">
          {vote?.name}
        </Typography>
        <TopicTypography variant="body2" align="center">
          {truncate(vote?.topic, { length: MAX_TOPIC_LENGTH })}
        </TopicTypography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <LegalBallotIcon />
          <Typography ml={0.5}>
            {getVotedNumber()}/{vote?.allowedParticipants.length || 0}
          </Typography>
        </Box>
        {vote?.state === 'active' && (
          <>
            <Divider />
            <ButtonContainer>
              <Button size="small" variant="text" onClick={handleCancel} disabled={dispatchTriggered}>
                {t('legal-vote-overview-panel-button-cancel')}
              </Button>
              <Button size="small" variant="contained" onClick={handleEnd} disabled={dispatchTriggered}>
                {t('legal-vote-overview-panel-button-end')}
              </Button>
            </ButtonContainer>
          </>
        )}
      </Stack>
    </MainContainer>
  );
};

export default LegalVoteOverviewPanel;
