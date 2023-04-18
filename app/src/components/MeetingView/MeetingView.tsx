// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Theme, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useState, useEffect } from 'react';

import { useAppSelector } from '../../hooks';
import { useTimer } from '../../hooks';
import { selectDebugMode, selectIsCoffeeBreakOpen } from '../../store/slices/uiSlice';
import { selectIsModerator } from '../../store/slices/userSlice';
import DebugPanel from '../DebugPanel';
import HotKeys from '../HotKeys';
import LocalVideo from '../LocalVideo';
import RemoteAudioStreams from '../RemoteAudioStreams';
import Timer from '../Timer';
import Toolbar from '../Toolbar';
import InnerLayout from './InnerLayout';

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
  const debugMode = useAppSelector(selectDebugMode);
  const isCoffeeBreakOpen = useAppSelector(selectIsCoffeeBreakOpen);
  const isModerator = useAppSelector(selectIsModerator);
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const enableAudio = isModerator || !isCoffeeBreakOpen;

  useTimer();

  useEffect(() => {
    setAnchorEl(containerRef.current);
    return () => setAnchorEl(null);
  }, [containerRef]);

  return (
    <Container ref={containerRef}>
      {debugMode && <DebugPanel />}

      {enableAudio && <RemoteAudioStreams />}

      <Timer anchorEl={anchorEl} />

      <HotKeys />

      <InnerLayout />

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
