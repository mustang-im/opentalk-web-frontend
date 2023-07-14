// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Theme, useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useState, useEffect } from 'react';

import { useAppSelector } from '../../hooks';
import { useTimer } from '../../hooks';
import { selectDebugMode, selectIsCoffeeBreakFullscreen } from '../../store/slices/uiSlice';
import { selectIsModerator } from '../../store/slices/userSlice';
import { CoffeeBreakView } from '../CoffeeBreakView/CoffeeBreakView';
import DebugPanel from '../DebugPanel';
import HotKeys from '../HotKeys';
import LocalVideo from '../LocalVideo';
import RemoteAudioStreams from '../RemoteAudioStreams';
import NormalTimerPopover from '../TimerPopover';
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
  const isCoffeeBreakOpen = useAppSelector(selectIsCoffeeBreakFullscreen);
  const isModerator = useAppSelector(selectIsModerator);
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const enableAudio = isModerator || !isCoffeeBreakOpen;
  const isCoffeeBreakFullscreen = useAppSelector(selectIsCoffeeBreakFullscreen);

  useTimer();

  useEffect(() => {
    setAnchorEl(containerRef.current);
    return () => setAnchorEl(null);
  }, [containerRef]);

  const renderContent = () => {
    //If the coffee break cover is open then we replace the entirety of the content with it
    if (isCoffeeBreakFullscreen && !isModerator) {
      return <CoffeeBreakView />;
    }

    return (
      <>
        {debugMode && <DebugPanel />}

        {enableAudio && <RemoteAudioStreams />}

        {!isCoffeeBreakFullscreen && <NormalTimerPopover anchorEl={anchorEl} />}

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
      </>
    );
  };

  return <Container ref={containerRef}>{renderContent()}</Container>;
};

export default MeetingView;
