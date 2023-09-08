// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Theme, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRef, useState, useEffect } from 'react';

import { useAppSelector } from '../../hooks';
import { useHotkeys } from '../../hooks/useHotkeys';
import { selectDebugMode, selectShowCoffeeBreakCurtain } from '../../store/slices/uiSlice';
import { selectIsModerator } from '../../store/slices/userSlice';
import { CoffeeBreakView } from '../CoffeeBreakView/CoffeeBreakView';
import DebugPanel from '../DebugPanel';
import MobileMeetingHeader from '../MobileMeetingHeader/MobileMeetingHeader';
import RemoteAudioStreams from '../RemoteAudioStreams';
import TimerPopover from '../TimerPopover';
import Toolbar from '../Toolbar';
import InnerLayout from './InnerLayout';
import MobileLayout from './MobileLayout';

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
  [theme.breakpoints.down('sm')]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}));

const MeetingView = () => {
  const theme: Theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallPortraitScreen = useMediaQuery(`${theme.breakpoints.down('md')} and (orientation: landscape)`);
  const debugMode = useAppSelector(selectDebugMode);
  const isCoffeeBreakOpen = useAppSelector(selectShowCoffeeBreakCurtain);
  const isModerator = useAppSelector(selectIsModerator);
  const containerRef = useRef(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const enableAudio = isModerator || !isCoffeeBreakOpen;
  const showCoffeeBreakCurtain = useAppSelector(selectShowCoffeeBreakCurtain);

  useHotkeys();

  useEffect(() => {
    setAnchorEl(containerRef.current);
    return () => setAnchorEl(null);
  }, [containerRef]);

  return (
    <Container ref={containerRef}>
      {showCoffeeBreakCurtain && !isModerator ? (
        <CoffeeBreakView />
      ) : (
        <>
          {debugMode && <DebugPanel />}

          {enableAudio && <RemoteAudioStreams />}

          {!showCoffeeBreakCurtain && <TimerPopover anchorEl={anchorEl} />}

          {isSmallScreen || isSmallPortraitScreen ? (
            <>
              <MobileMeetingHeader />
              <MobileLayout />
              <Toolbar />
            </>
          ) : (
            <InnerLayout />
          )}
        </>
      )}
    </Container>
  );
};

export default MeetingView;
