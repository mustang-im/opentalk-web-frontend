// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Slide, Stack, styled, Tooltip } from '@mui/material';
import { MediaSessionType, ParticipantId, ParticipationKind, VideoSetting, WarningIcon } from '@opentalk/common';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectQualityCap } from '../../../store/slices/mediaSlice';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import {
  selectParticipantAvatarUrl,
  selectParticipantName,
  selectParticipationKind,
} from '../../../store/slices/participantsSlice';
import { AvatarContainer } from './AvatarContainer';
import RemoteVideo from './RemoteVideo';
import ScreenPresenterVideo from './ScreenPresenterVideo';

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
});

export type PresenterVideoPosition = 'bottomLeft' | 'upperRight' | 'bottomRight';

interface ParticipantVideoProps {
  participantId: ParticipantId;
  fullscreenMode?: boolean;
  presenterVideoIsActive?: boolean;
  isThumbnail?: boolean;
}

const ParticipantVideo = ({
  participantId,
  fullscreenMode,
  presenterVideoIsActive,
  isThumbnail,
}: ParticipantVideoProps) => {
  const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
  const screenDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Screen }), [participantId]);

  const videoSubscriber = useAppSelector(selectSubscriberById(videoDescriptor));
  const screenSubscriber = useAppSelector(selectSubscriberById(screenDescriptor));
  const displayName = useAppSelector(selectParticipantName(participantId));
  const avatarUrl = useAppSelector(selectParticipantAvatarUrl(participantId));
  const participationKind = useAppSelector(selectParticipationKind(participantId));
  const qualityCap = useAppSelector(selectQualityCap);

  const containerRef = React.useRef(null);
  const [isVideoPinned, setIsVideoPinned] = useState<boolean>(false);
  const [showPresenterVideo, setShowPresenterVideo] = useState<boolean>(!!presenterVideoIsActive);

  const [presenterVideoPosition, setPresenterVideoPosition] = useState<PresenterVideoPosition>('bottomRight');
  const positionsArray: Array<PresenterVideoPosition> = ['bottomLeft', 'upperRight', 'bottomRight'];

  const slideDirection = presenterVideoPosition === 'upperRight' ? 'down' : 'up';
  const isVisible = isVideoPinned || presenterVideoIsActive || showPresenterVideo;
  const isSipParticipant = participationKind === ParticipationKind.Sip;

  const { t } = useTranslation();

  useEffect(() => {
    if (!fullscreenMode) {
      const timer = setTimeout(() => setShowPresenterVideo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showPresenterVideo, fullscreenMode]);

  const displayPresenterVideo = useCallback(() => {
    !presenterVideoIsActive && !fullscreenMode && setShowPresenterVideo(true);
  }, [fullscreenMode, presenterVideoIsActive]);

  const handleToggle = () => setIsVideoPinned((videoPinned) => !videoPinned);

  const movePresenterVideo = () => {
    const currentIndex = positionsArray.indexOf(presenterVideoPosition);
    const nextIndex = (currentIndex + 1) % 3;
    setPresenterVideoPosition(positionsArray[nextIndex]);
  };

  const mediaFailedError = (
    <Tooltip title={t('media-subscription-failed') || ''}>
      <Stack>
        <WarningIcon />
      </Stack>
    </Tooltip>
  );

  if (screenSubscriber?.video && screenSubscriber?.limit !== VideoSetting.Off) {
    if (screenSubscriber?.error) {
      return mediaFailedError;
    }
    return (
      <Container onMouseMove={displayPresenterVideo} data-testid="participantSreenShareVideo" ref={containerRef}>
        <RemoteVideo descriptor={screenDescriptor} />
        <Slide direction={slideDirection} in={isVisible} mountOnEnter container={containerRef.current}>
          <ScreenPresenterVideo
            isFullscreenMode={fullscreenMode}
            participantId={participantId}
            isVideoPinned={isVideoPinned}
            togglePin={handleToggle}
            videoPosition={presenterVideoPosition}
            changeVideoPosition={movePresenterVideo}
            isThumbnail={isThumbnail}
          />
        </Slide>
      </Container>
    );
  }

  if (videoSubscriber?.video && qualityCap !== VideoSetting.Off && videoSubscriber?.limit !== VideoSetting.Off) {
    if (videoSubscriber?.error) {
      return mediaFailedError;
    }
    return <RemoteVideo descriptor={videoDescriptor} />;
  }

  return (
    <AvatarContainer avatarUrl={avatarUrl} isSipParticipant={isSipParticipant}>
      {displayName || ''}
    </AvatarContainer>
  );
};

export default ParticipantVideo;
