// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Fade, styled } from '@mui/material';
import Box from '@mui/material/Box';
import { memo } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectIsModerator } from '../../../store/slices/userSlice';
import { CoffeeBreakAnnounce, CoffeeBreakAnnounceProps } from './CoffeeBreakAnnounce';
import { FirstLayer } from './InsideLayer';

const LayerFullScreen = styled(FirstLayer)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  height: '100%',
  bgcolor: 'background.paper',
  background: `url('/assets/background.svg') no-repeat`,
  backgroundSize: 'cover',
});

const SecondLayer = styled(Box)({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gridTemplateRows: '0fr 2fr',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
  backdropFilter: 'blur(100px)',
  WebkitBackdropFilter: 'blur(100px)',
  backgroundColor: `rgba(0, 22, 35, 0.5)`,
  overflow: 'auto',
  padding: 50,
});

export interface Layers extends CoffeeBreakAnnounceProps {
  open: boolean;
}

export const FullScreenLayer = memo(({ open, handleClose }: Layers) => {
  const isModerator = useAppSelector(selectIsModerator);

  if (isModerator) {
    return null;
  }

  return (
    <Fade in={open}>
      <LayerFullScreen>
        <SecondLayer>
          <CoffeeBreakAnnounce {...{ handleClose }} />
        </SecondLayer>
      </LayerFullScreen>
    </Fade>
  );
});
