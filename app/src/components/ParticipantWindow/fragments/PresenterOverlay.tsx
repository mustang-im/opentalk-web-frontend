// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, styled } from '@mui/material';
import { BackIcon, MediaSessionType, ParticipantId, PinIcon } from '@opentalk/common';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectParticipantName } from '../../../store/slices/participantsSlice';
import { PresenterVideoPosition } from './ParticipantVideo';
import Statistics from './Statistics';
import { OverlayIconButton } from './VideoOverlay';

const OverlayContainer = styled(Grid)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  fontSize: 'inherit',
  width: '100%',
  padding: theme.spacing(1),
  background: 'transparent',
  zIndex: theme.zIndex.mobileStepper,
}));

const IndicatorContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: theme.spacing(3),
  gap: theme.spacing(1),
}));

const ArrowIcon = styled(BackIcon, {
  shouldForwardProp: (prop) => prop !== 'rotate',
})<{ rotate: string }>(({ rotate }) => ({
  transform: rotate,
}));

export interface PresenterOverlayProps {
  participantId: ParticipantId;
  fullscreenMode?: boolean;
  isVideoPinned: boolean;
  videoPosition: PresenterVideoPosition;
  togglePin: () => void;
  changeVideoPosition: () => void;
}
export const PresenterOverlay = ({
  videoPosition,
  participantId,
  fullscreenMode,
  togglePin,
  changeVideoPosition,
  isVideoPinned,
}: PresenterOverlayProps) => {
  const { t } = useTranslation();

  const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
  const displayName = useAppSelector(selectParticipantName(participantId));

  const arrowIconDirection = useMemo(() => {
    switch (videoPosition) {
      case 'bottomLeft':
        return 'rotate(135deg)';
      case 'upperRight':
        return 'rotate(-90deg)';
      default:
        return 'rotate(0)';
    }
  }, [videoPosition]);

  return (
    <OverlayContainer data-testid="screenShareVideoOverlay">
      <IndicatorContainer item>
        <OverlayIconButton onClick={changeVideoPosition} aria-label={t('indicator-change-position')} color="secondary">
          <ArrowIcon rotate={arrowIconDirection} />
        </OverlayIconButton>
        <Statistics descriptor={videoDescriptor} disablePopoverPortal={fullscreenMode} />
        <OverlayIconButton
          onClick={togglePin}
          translate="no"
          color={isVideoPinned ? 'primary' : 'secondary'}
          aria-label={t(`indicator-pinned`, {
            participantName: displayName || '',
          })}
        >
          <PinIcon />
        </OverlayIconButton>
      </IndicatorContainer>
    </OverlayContainer>
  );
};
