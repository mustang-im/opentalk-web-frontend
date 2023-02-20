// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, CircularProgress } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import { legalVoteStore } from '@opentalk/components';

import { TimerStyle } from '../../api/types/outgoing/timer';
import { useAppSelector } from '../../hooks';
import { selectCurrentShownPollVoteId, selectShowPollWindow } from '../../store/slices/pollSlice';
import { selectRoomConnectionState, ConnectionState } from '../../store/slices/roomSlice';
import { selectParticipantsReady, selectTimerRunning, selectTimerStyle } from '../../store/slices/timerSlice';
import { selectVotePollIdToShow } from '../../store/slices/uiSlice';
import { selectOurUuid } from '../../store/slices/userSlice';
import Cinema from '../Cinema';
import CoffeeBreakLayer from '../CoffeeBreakLayer';
import { CoffeeBreakRequesters } from '../CoffeeBreakLayer/CoffeeBreakLayer';
import MeetingHeader from '../MeetingHeader/index';
import MeetingSidebar from '../MeetingSidebar/index';
import VoteResultContainer from '../VoteResult/VoteResultContainer';

const InnerContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  height: '100%',
  width: '100%',
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  minHeight: 0,
  gridTemplate: 'auto 1fr / auto 1fr',
  [theme.breakpoints.down('sm')]: {
    gridTemplate: 'unset',
    gridTemplateRows: 'max-content',
    paddingBottom: theme.spacing(10),
  },
  [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
    gridTemplate: 'unset',
    gridTemplateRows: 'max-content',
    paddingBottom: theme.spacing(10),
  },
}));

const CircularProgressBar = styled(CircularProgress)({
  margin: 'auto',
});

const InnerLayout = () => {
  const currentVoteId = useAppSelector(legalVoteStore.selectCurrentShownVoteId);
  const showVoteResultContainer = useAppSelector(legalVoteStore.selectShowLegalVoteWindow);
  const showPollResultContainer = useAppSelector(selectShowPollWindow);
  const currentShownPollVoteId = useAppSelector(selectCurrentShownPollVoteId);
  const votePollIdToShow = useAppSelector(selectVotePollIdToShow);
  const connectionState = useAppSelector(selectRoomConnectionState);
  const timerStyle = useAppSelector(selectTimerStyle);
  const timerRunning = useAppSelector(selectTimerRunning);
  const userId = useAppSelector(selectOurUuid);
  const participantsAreReady = useAppSelector(selectParticipantsReady);
  const isUserReady = participantsAreReady.includes(userId as ParticipantId);

  if (timerStyle === TimerStyle.CoffeeBreak && timerRunning && !isUserReady) {
    return (
      <InnerContainer>
        <MeetingSidebar />
        <CoffeeBreakLayer requester={CoffeeBreakRequesters.LayerInside} />
      </InnerContainer>
    );
  }

  return (
    <InnerContainer>
      <MeetingSidebar />
      <MeetingHeader />
      {connectionState === ConnectionState.Leaving || connectionState === ConnectionState.Starting ? (
        <CircularProgressBar />
      ) : (
        <>
          <Cinema />
          {votePollIdToShow && <VoteResultContainer legalVoteId={votePollIdToShow} />}
          {!votePollIdToShow && currentVoteId && showVoteResultContainer && (
            <VoteResultContainer legalVoteId={currentVoteId} />
          )}
          {!votePollIdToShow && currentShownPollVoteId && showPollResultContainer && (
            <VoteResultContainer legalVoteId={currentShownPollVoteId} />
          )}
        </>
      )}
    </InnerContainer>
  );
};

export default InnerLayout;
