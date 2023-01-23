// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, CircularProgress, Theme, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { legalVoteStore } from '@opentalk/components';
import React, { useRef, useState, useEffect } from 'react';

import { useAppSelector } from '../../hooks';
import { selectCurrentShownPollVoteId, selectShowPollWindow } from '../../store/slices/pollSlice';
import { selectRoomConnectionState, ConnectionState } from '../../store/slices/roomSlice';
import { selectDebugMode, selectVotePollIdToShow } from '../../store/slices/uiSlice';
import Cinema from '../Cinema';
import DebugPanel from '../DebugPanel';
import HotKeys from '../HotKeys';
import LocalVideo from '../LocalVideo';
import MeetingHeader from '../MeetingHeader/index';
import MeetingSidebar from '../MeetingSidebar/index';
import RemoteAudioStreams from '../RemoteAudioStreams';
import TimerPopover from '../TimerPopover';
import Toolbar from '../Toolbar';
import VoteResultContainer from '../VoteResult/VoteResultContainer';

const Container = styled('div')(({ theme }) => ({
  background: theme.palette.background.overlay,
  overflow: 'auto',
  display: 'grid',
  height: '100%',
  width: '100%',

  '&.MuiContainer-root': {
    paddingLeft: 0,
    paddingRight: 0,
  },
}));

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

const ToolbarWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  zIndex: theme.zIndex.mobileStepper,
  backgroundColor: theme.palette.background.paper,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LocalVideoWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 65,
  width: 100,
  zIndex: theme.zIndex.mobileStepper,
}));

const MeetingView = () => {
  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallPortraitScreen = useMediaQuery(`${theme.breakpoints.down('md')} and (orientation: landscape)`);
  const currentVoteId = useAppSelector(legalVoteStore.selectCurrentShownVoteId);
  const showVoteResultContainer = useAppSelector(legalVoteStore.selectShowLegalVoteWindow);
  const showPollResultContainer = useAppSelector(selectShowPollWindow);
  const currentShownPollVoteId = useAppSelector(selectCurrentShownPollVoteId);
  const votePollIdToShow = useAppSelector(selectVotePollIdToShow);
  const debugMode = useAppSelector(selectDebugMode);
  const connectionState = useAppSelector(selectRoomConnectionState);

  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setAnchorEl(containerRef.current);
    return () => setAnchorEl(null);
  }, [containerRef]);

  return (
    <Container ref={containerRef}>
      {debugMode && <DebugPanel />}
      <RemoteAudioStreams />
      <TimerPopover anchorEl={anchorEl} />
      <HotKeys />
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
      {(isSmallScreen || isSmallPortraitScreen) && (
        <>
          <LocalVideoWrapper>
            <LocalVideo />
          </LocalVideoWrapper>
          <ToolbarWrapper>
            <Toolbar />
          </ToolbarWrapper>
        </>
      )}
    </Container>
  );
};

export default MeetingView;
