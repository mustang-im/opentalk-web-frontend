// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Box, IconButton as MuiIconButton, Slide } from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { useFullscreenContext } from '../../provider/FullscreenProvider';
import { selectCombinedSpeakerId } from '../../store/selectors';
import { selectAllOnlineParticipants } from '../../store/slices/participantsSlice';
import LocalVideo from '../LocalVideo';
import ParticipantWindow from '../ParticipantWindow';
import Toolbar from '../Toolbar';

const Container = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
});

const ToolbarWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  bottom: 0,
  zIndex: theme.zIndex.mobileStepper,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LocalVideoContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
  width: '18%',
  maxHeight: '20%',
  zIndex: theme.zIndex.mobileStepper,
}));

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  position: 'absolute',
  top: 15,
  right: 15,
  zIndex: theme.zIndex.mobileStepper,
  opacity: 0.6,
  padding: theme.spacing(0.75),
}));

const FullscreenView = () => {
  const fullscreenHandle = useFullscreenContext();
  const { t } = useTranslation();
  const [isActiveOverlay, setIsActiveOverlay] = useState<boolean>(false);
  const [isLocalVideoPinned, setIsLocalVideoPinned] = useState<boolean>(false);

  const fullscreenSpeakerId = fullscreenHandle.fullscreenParticipantID;
  const selectedSpeakerId = useAppSelector(selectCombinedSpeakerId);
  const participants = useAppSelector(selectAllOnlineParticipants);
  const usedParticipantId = fullscreenSpeakerId || selectedSpeakerId;
  const selectedParticipant = participants.find((p) => p.id === usedParticipantId) || participants[0];

  useEffect(() => {
    const timer = setTimeout(() => setIsActiveOverlay(false), 5000);
    return () => clearTimeout(timer);
  }, [isActiveOverlay]);

  const screenVideo = useMemo(() => {
    if (selectedParticipant === undefined) {
      return null;
    }

    return <ParticipantWindow activePresenter={isActiveOverlay} participantId={selectedParticipant.id} />;
  }, [selectedParticipant, isActiveOverlay]);

  const toggleLocalVideoPin = () => setIsLocalVideoPinned((prevState) => !prevState);

  return (
    <Container
      onMouseMove={() => setIsActiveOverlay(true)}
      onMouseLeave={() => setIsActiveOverlay(false)}
      data-testid="fullscreen"
    >
      <IconButton aria-label={t('indicator-fullscreen-close')} onClick={fullscreenHandle.exit} color="secondary">
        <CloseIcon />
      </IconButton>
      <Slide direction="down" in={isLocalVideoPinned || isActiveOverlay} mountOnEnter>
        <LocalVideoContainer data-testid="fullscreenLocalVideo">
          <LocalVideo fullscreenMode togglePinVideo={toggleLocalVideoPin} isVideoPinned={isLocalVideoPinned} />
        </LocalVideoContainer>
      </Slide>
      <Slide direction="up" in={isActiveOverlay} mountOnEnter unmountOnExit>
        <ToolbarWrapper>
          <Toolbar layout="fullscreen" />
        </ToolbarWrapper>
      </Slide>
      {screenVideo}
    </Container>
  );
};

export default FullscreenView;
