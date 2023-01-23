// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';

import browser from '../../modules/BrowserSupport';
import AudioButton from './fragments/AudioButton';
import BlurScreenButton from './fragments/BlurScreenButton';
import EndCallButton from './fragments/EndCallButton';
import HandraiseButton from './fragments/HandraiseButton';
import MoreButton from './fragments/MoreButton';
import ShareScreenButton from './fragments/ShareScreenButton';
import VideoButton from './fragments/VideoButton';

type LayoutTypes = 'fullscreen' | 'lobby';

const MainContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  background: 'transparent',
  justifyContent: 'space-evenly',
  padding: theme.spacing(2, 0),
  '&.fullscreen': {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: theme.spacing(1.25),
  },
  '&.lobby': {
    display: 'inline-flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
    padding: 0,
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
  [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
    gap: theme.spacing(1),
  },
}));

const Toolbar = ({ layout }: { layout?: LayoutTypes }) => {
  return (
    <MainContainer className={layout} data-testid={'Toolbar'}>
      {layout === 'lobby' ? (
        <>
          <AudioButton isLobby />
          <VideoButton isLobby />
          {!browser.isSafari() && <BlurScreenButton isLobby />}
        </>
      ) : (
        <>
          <HandraiseButton />
          <ShareScreenButton />
          <AudioButton />
          <VideoButton />
          <MoreButton />
          <EndCallButton />
        </>
      )}
    </MainContainer>
  );
};

export default Toolbar;
