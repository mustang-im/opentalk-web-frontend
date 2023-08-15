// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Slide, Stack, styled, Tooltip } from '@mui/material';
import { MediaSessionType, ParticipantId, VideoSetting, WarningIcon } from '@opentalk/common';
import { useCallback, useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectQualityCap } from '../../../store/slices/mediaSlice';
import { selectSubscriberStateById } from '../../../store/slices/mediaSubscriberSlice';
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
  presenterVideoIsActive?: boolean;
  isThumbnail?: boolean;
}

const ParticipantVideo = ({ participantId, presenterVideoIsActive, isThumbnail }: ParticipantVideoProps) => {
  const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
  const screenDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Screen }), [participantId]);

  const videoSubscriber = useAppSelector(selectSubscriberStateById(videoDescriptor, 'video'));
  const screenSubscriber = useAppSelector(selectSubscriberStateById(screenDescriptor, 'video'));
  const qualityCap = useAppSelector(selectQualityCap);

  const containerRef = useRef(null);
  const [isVideoPinned, setIsVideoPinned] = useState<boolean>(false);
  const [showPresenterVideo, setShowPresenterVideo] = useState<boolean>(!!presenterVideoIsActive);

  const [presenterVideoPosition, setPresenterVideoPosition] = useState<PresenterVideoPosition>('bottomRight');
  const positionsArray: Array<PresenterVideoPosition> = ['bottomLeft', 'upperRight', 'bottomRight'];

  const slideDirection = presenterVideoPosition === 'upperRight' ? 'down' : 'up';
  const isVisible = isVideoPinned || presenterVideoIsActive || showPresenterVideo;

  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => setShowPresenterVideo(false), 5000);
    return () => clearTimeout(timer);
  }, [showPresenterVideo]);

  const displayPresenterVideo = useCallback(() => {
    !presenterVideoIsActive && setShowPresenterVideo(true);
  }, [presenterVideoIsActive]);

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

  if (screenSubscriber?.active && screenSubscriber?.limit !== VideoSetting.Off) {
    if (screenSubscriber?.error) {
      return mediaFailedError;
    }
    return (
      <Container onMouseMove={displayPresenterVideo} data-testid="participantSreenShareVideo" ref={containerRef}>
        <RemoteVideo descriptor={screenDescriptor} />
        <Slide direction={slideDirection} in={isVisible} mountOnEnter container={containerRef.current}>
          <ScreenPresenterVideo
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

  if (videoSubscriber?.active && qualityCap !== VideoSetting.Off && videoSubscriber?.limit !== VideoSetting.Off) {
    if (videoSubscriber?.error) {
      return mediaFailedError;
    }
    return <RemoteVideo descriptor={videoDescriptor} />;
  }

  return <AvatarContainer participantId={participantId} />;
};

export default ParticipantVideo;
