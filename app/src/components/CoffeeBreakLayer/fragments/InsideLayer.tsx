// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Fade, styled } from '@mui/material';
import Box from '@mui/material/Box';
import { memo } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectIsModerator } from '../../../store/slices/userSlice';
import { CoffeeBreakAnnounce } from './CoffeeBreakAnnounce';
import { Layers } from './FullScreenLayer';

export const FirstLayer = styled(Box)({
  background: `url('/assets/background.svg') no-repeat`,
  backgroundSize: 'cover',
  gridRow: 'span 2',
  zIndex: 1,
  overflow: 'hidden',
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

const LayerWithRounding = styled(SecondLayer)(({ theme }) => ({
  borderRadius: theme.borderRadius.medium,
}));

export const InsideLayer = memo(({ open, handleClose }: Layers) => {
  const isModerator = useAppSelector(selectIsModerator);

  if (!isModerator) {
    return null;
  }

  return (
    <Fade in={open}>
      <FirstLayer>
        <LayerWithRounding>
          <CoffeeBreakAnnounce {...{ handleClose }} />
        </LayerWithRounding>
      </FirstLayer>
    </Fade>
  );
});
