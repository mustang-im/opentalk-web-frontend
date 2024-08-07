// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Box as MuiBox } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import { useMemo, useState } from 'react';

import NameTile from '../../commonComponents/NameTile/NameTile';
import { useAppSelector } from '../../hooks';
import { useFullscreenContext } from '../../hooks/useFullscreenContext';
import { selectParticipantName } from '../../store/slices/participantsSlice';
import HandRaisedIndicator from './fragments/HandRaisedIndicator';
import ParticipantVideo from './fragments/ParticipantVideo';
import VideoOverlay from './fragments/VideoOverlay';

const Container = styled(MuiBox)(({ theme }) => ({
  position: 'relative',
  width: 'inherit',
  height: 'inherit',
  maxWidth: '100%',
  maxHeight: '100%',
  display: 'flex',
  flexWrap: 'nowrap',
  alignItems: 'center',
  justifyContent: 'center',
  background: theme.palette.background.video,
}));

const HandRaisedBox = styled(MuiBox)({
  position: 'absolute',
  right: 5,
  bottom: 5,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'flex-end',
});

interface ParticipantWindowProps {
  participantId: ParticipantId;
  activePresenter?: boolean;
  alwaysShowOverlay?: boolean;
  isThumbnail?: boolean;
  mediaRef: string;
}

const ParticipantWindow = ({
  participantId,
  activePresenter,
  alwaysShowOverlay,
  isThumbnail,
  mediaRef,
}: ParticipantWindowProps) => {
  const fullscreenHandle = useFullscreenContext();
  const displayName = useAppSelector(selectParticipantName(participantId));
  const [activeOverlay, setActiveOverlay] = useState<boolean>(!!alwaysShowOverlay);

  const handleDisplayOverlay = (show: boolean) => !alwaysShowOverlay && setActiveOverlay(show);

  const videoTile = useMemo(() => {
    return (
      <ParticipantVideo
        participantId={participantId}
        presenterVideoIsActive={activePresenter}
        isThumbnail={isThumbnail}
        mediaRef={mediaRef}
      />
    );
  }, [participantId, activePresenter, isThumbnail, mediaRef]);

  return (
    <Container
      onMouseEnter={() => handleDisplayOverlay(true)}
      onMouseLeave={() => handleDisplayOverlay(false)}
      data-testid="ParticipantWindow"
    >
      {videoTile}
      <VideoOverlay participantId={participantId} active={activeOverlay && !fullscreenHandle.active} />
      {!fullscreenHandle.active && (
        <NameTile displayName={displayName || ''} participantId={participantId} className="positionBottom" />
      )}
      <HandRaisedBox>
        <HandRaisedIndicator participantId={participantId} />
      </HandRaisedBox>
    </Container>
  );
};

export default ParticipantWindow;
