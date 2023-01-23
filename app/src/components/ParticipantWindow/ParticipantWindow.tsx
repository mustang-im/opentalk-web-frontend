// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Box as MuiBox } from '@mui/material';
import { AutomodSelectionStrategy, MediaSessionType, ParticipantId } from '@opentalk/common';
import React, { useMemo, useState } from 'react';

import automod from '../../api/types/outgoing/automod';
import NameTile from '../../commonComponents/NameTile/NameTile';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useFullscreenContext } from '../../provider/FullscreenProvider';
import { selectSubscriberById } from '../../store/slices/mediaSubscriberSlice';
import {
  selectModerationActive,
  selectRemaining,
  selectSelectionMode,
  selectSpeaker,
} from '../../store/slices/moderationSlice';
import { selectParticipantName } from '../../store/slices/participantsSlice';
import { selectOurUuid } from '../../store/slices/userSlice';
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
}

const ParticipantWindow = ({
  participantId,
  activePresenter,
  alwaysShowOverlay,
  isThumbnail,
}: ParticipantWindowProps) => {
  const dispatch = useAppDispatch();
  const speaker = useAppSelector(selectSpeaker);
  const ourUuid = useAppSelector(selectOurUuid);

  const fullscreenHandle = useFullscreenContext();

  const moderationActive = useAppSelector(selectModerationActive);
  const moderationMode = useAppSelector(selectSelectionMode);
  const moderationRemaining = useAppSelector(selectRemaining);
  const displayName = useAppSelector(selectParticipantName(participantId));
  const [activeOverlay, setActiveOverlay] = useState<boolean>(!!alwaysShowOverlay);

  const videoDescriptor = useMemo(
    () => ({ participantId: participantId, mediaType: MediaSessionType.Video }),
    [participantId]
  );
  const videoSubscriber = useAppSelector(selectSubscriberById(videoDescriptor));

  const handleDisplayOverlay = (show: boolean) => !alwaysShowOverlay && setActiveOverlay(show);

  return (
    <Container
      onMouseEnter={() => handleDisplayOverlay(true)}
      onMouseLeave={() => handleDisplayOverlay(false)}
      data-testid="ParticipantWindow"
    >
      <ParticipantVideo
        participantId={participantId}
        presenterVideoIsActive={activePresenter}
        isThumbnail={isThumbnail}
      />

      {moderationActive &&
        speaker === ourUuid &&
        moderationMode === AutomodSelectionStrategy.Nomination &&
        moderationRemaining?.includes(participantId) && (
          <button onClick={() => dispatch(automod.actions.pass.action({ next: participantId }))}>Yield Next</button>
        )}

      <VideoOverlay participantId={participantId} active={activeOverlay && !fullscreenHandle.active} />
      {!fullscreenHandle.active && (
        <NameTile audioOn={!!videoSubscriber?.audio} displayName={displayName || ''} className="positionBottom" />
      )}
      <HandRaisedBox>
        <HandRaisedIndicator participantId={participantId} />
      </HandRaisedBox>
    </Container>
  );
};

export default ParticipantWindow;
