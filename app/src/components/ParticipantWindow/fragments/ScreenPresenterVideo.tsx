// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { MediaSessionType, ParticipantId, VideoSetting } from '@opentalk/common';
import React, { useState, useMemo } from 'react';

import NameTile from '../../../commonComponents/NameTile/NameTile';
import { useAppSelector } from '../../../hooks';
import { selectQualityCap } from '../../../store/slices/mediaSlice';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { selectParticipantAvatarUrl, selectParticipantName } from '../../../store/slices/participantsSlice';
import { AvatarContainer } from './AvatarContainer';
import { PresenterVideoPosition } from './ParticipantVideo';
import { PresenterOverlay } from './PresenterOverlay';
import RemoteVideo from './RemoteVideo';

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

interface ScreenPresenterVideoProps {
  participantId: ParticipantId;
  isVideoPinned: boolean;
  videoPosition: PresenterVideoPosition;
  isFullscreenMode?: boolean;
  togglePin: () => void;
  changeVideoPosition: () => void;
  isThumbnail?: boolean;
}

const ScreenPresenterVideo = React.forwardRef<HTMLDivElement, ScreenPresenterVideoProps>(
  (
    { participantId, isFullscreenMode, isVideoPinned, togglePin, videoPosition, changeVideoPosition, isThumbnail },
    ref
  ) => {
    const videoDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
    const videoSubscriber = useAppSelector(selectSubscriberById(videoDescriptor));
    const displayName = useAppSelector(selectParticipantName(participantId));
    const avatarUrl = useAppSelector(selectParticipantAvatarUrl(participantId));
    const [mouseOver, setMouseOver] = useState<boolean>(false);
    const qualityCap = useAppSelector(selectQualityCap);

    return (
      <SharedPresenterVideo
        ref={ref}
        className={videoPosition}
        fullscreenMode={isFullscreenMode}
        data-testid="sharedPresenterVideo"
        onMouseEnter={() => setMouseOver(true)}
        onMouseLeave={() => setMouseOver(false)}
      >
        {mouseOver && !isThumbnail && (
          <PresenterOverlay
            videoPosition={videoPosition}
            participantId={participantId}
            fullscreenMode={isFullscreenMode}
            isVideoPinned={isVideoPinned}
            togglePin={togglePin}
            changeVideoPosition={changeVideoPosition}
          />
        )}
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
