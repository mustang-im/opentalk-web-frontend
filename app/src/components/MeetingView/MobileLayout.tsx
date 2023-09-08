// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CircularProgress, Stack, styled } from '@mui/material';
import { legalVoteStore } from '@opentalk/components';

import { useAppSelector } from '../../hooks';
import { selectCurrentShownPollVoteId, selectShowPollWindow } from '../../store/slices/pollSlice';
import { ConnectionState, selectRoomConnectionState } from '../../store/slices/roomSlice';
import { selectVotePollIdToShow } from '../../store/slices/uiSlice';
import Cinema from '../Cinema';
import VoteResultContainer from '../VoteResult/VoteResultContainer';

const Container = styled(Stack)(() => ({
  display: 'flex',
  justifyContent: 'space-between',
  overflow: 'scroll',
}));

const InnerContainer = styled(Stack)(({ theme }) => ({
  margin: theme.spacing(1, 0.7),
}));

const CircularProgressBar = styled(CircularProgress)({
  margin: 'auto',
});

const MobileLayout = () => {
  const currentVoteId = useAppSelector(legalVoteStore.selectCurrentShownVoteId);
  const showVoteResultContainer = useAppSelector(legalVoteStore.selectShowLegalVoteWindow);
  const showPollResultContainer = useAppSelector(selectShowPollWindow);
  const currentShownPollVoteId = useAppSelector(selectCurrentShownPollVoteId);
  const votePollIdToShow = useAppSelector(selectVotePollIdToShow);
  const connectionState = useAppSelector(selectRoomConnectionState);

  //TODO: To be changed as part of Cinema mobile restructuring. Add moderator mobile view for Coffee break curtain? (non full screen coffee break)
  return (
    <Container>
      {connectionState === ConnectionState.Leaving || connectionState === ConnectionState.Starting ? (
        <CircularProgressBar />
      ) : (
        <InnerContainer>
          <Cinema />
          {votePollIdToShow && <VoteResultContainer legalVoteId={votePollIdToShow} />}
          {!votePollIdToShow && currentVoteId && showVoteResultContainer && (
            <VoteResultContainer legalVoteId={currentVoteId} />
          )}
          {!votePollIdToShow && currentShownPollVoteId && showPollResultContainer && (
            <VoteResultContainer legalVoteId={currentShownPollVoteId} />
          )}
        </InnerContainer>
      )}
    </Container>
  );
};

export default MobileLayout;
