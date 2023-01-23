// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, styled } from '@mui/material';
import { MediaSessionType, ParticipantId, VideoSetting } from '@opentalk/common';
import { PinIcon, BackIcon } from '@opentalk/common';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import NameTile from '../../../commonComponents/NameTile/NameTile';
import { useAppSelector } from '../../../hooks';
import { selectStatsById } from '../../../store/slices/connectionStatsSlice';
import { selectQualityCap } from '../../../store/slices/mediaSlice';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { selectParticipantAvatarUrl, selectParticipantName } from '../../../store/slices/participantsSlice';
import Statistics from '../../ParticipantWindow/fragments/Statistics';
import { AvatarContainer } from './AvatarContainer';
import { PresenterVideoPosition } from './ParticipantVideo';
import RemoteVideo from './RemoteVideo';
import { OverlayIconButton } from './VideoOverlay';

const SharedPresenterVideo = styled('div', {
  shouldForwardProp: (prop) => prop !== 'fullscreenMode',
})<{ fullscreenMode: boolean | undefined }>(({ theme, fullscreenMode }) => ({
  display: 'flex',
  justifyContent: 'center',
  width: '18%',
  maxHeight: '20%',
  overflow: 'hidden',
  position: 'absolute',
  borderRadius: theme.borderRadius.medium,
  background: theme.palette.background.video,

  '&.bottomLeft': {
    bottom: theme.spacing(2),
    left: theme.spacing(2),
  },
  '&.upperRight': {
    top: theme.spacing(2),
    right: fullscreenMode ? theme.spacing(8) : theme.spacing(2),
  },
  '&.bottomRight': {
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },

  '&::before': {
    content: '""',
    paddingBottom: 'calc(9/16 * 100%)',
  },
}));

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

interface ScreenPresenterVideoProps {
  participantId: ParticipantId;
  isVideoPinned: boolean;
  videoPosition: PresenterVideoPosition;
  isFullscreenMode?: boolean | undefined;
  togglePin: () => void;
  changeVideoPosition: () => void;
  isThumbnail?: boolean;
}

const ScreenPresenterVideo = React.forwardRef<HTMLDivElement, ScreenPresenterVideoProps>(
  (
    { participantId, isFullscreenMode, isVideoPinned, togglePin, videoPosition, changeVideoPosition, isThumbnail },
    ref
  ) => {
    const { t } = useTranslation();

    const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
    const videoSubscriber = useAppSelector(selectSubscriberById(videoDescriptor));
    const displayName = useAppSelector(selectParticipantName(participantId));
    const avatarUrl = useAppSelector(selectParticipantAvatarUrl(participantId));
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const stats = useAppSelector(selectStatsById(videoDescriptor));
    const qualityCap = useAppSelector(selectQualityCap);

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

    const connectionLossPercent = useMemo(() => {
      if (stats?.packetLoss === undefined) return 0;
      return Math.round(stats.packetLoss * 100);
    }, [stats?.packetLoss]);

    const PresenterOverlay = () => (
      <OverlayContainer data-testid="screenShareVideoOverlay">
        <IndicatorContainer item>
          <OverlayIconButton
            onClick={changeVideoPosition}
            aria-label={t('indicator-change-position')}
            color="secondary"
          >
            <ArrowIcon rotate={arrowIconDirection} />
          </OverlayIconButton>
          <Statistics
            descriptor={videoDescriptor}
            disablePopoverPortal={isFullscreenMode}
            packetLossPercent={connectionLossPercent}
          />
          <OverlayIconButton
            onClick={togglePin}
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

    return (
      <SharedPresenterVideo
        ref={ref}
        className={videoPosition}
        fullscreenMode={isFullscreenMode}
        data-testid="sharedPresenterVideo"
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        {mouseOver && !isThumbnail && <PresenterOverlay />}
        {videoSubscriber?.video && videoSubscriber?.limit !== VideoSetting.Off && qualityCap !== VideoSetting.Off ? (
          <RemoteVideo descriptor={videoDescriptor} />
        ) : (
          <AvatarContainer avatarUrl={avatarUrl}>{displayName || ''}</AvatarContainer>
        )}
        {isFullscreenMode && (
          <NameTile displayName={displayName || ''} audioOn={!!videoSubscriber?.audio} className="positionBottom" />
        )}
      </SharedPresenterVideo>
    );
  }
);

export default ScreenPresenterVideo;
