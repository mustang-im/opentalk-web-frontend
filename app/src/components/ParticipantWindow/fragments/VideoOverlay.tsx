// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, styled, IconButton } from '@mui/material';
import { MediaSessionType, ParticipantId } from '@opentalk/common';
import { PinIcon, FullscreenViewIcon } from '@opentalk/common';
import React, { MouseEventHandler, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../provider/FullscreenProvider';
import { selectStatsById } from '../../../store/slices/connectionStatsSlice';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { selectParticipantName } from '../../../store/slices/participantsSlice';
import {
  pinnedParticipantIdSet,
  selectParticipantsLayout,
  selectPinnedParticipantId,
} from '../../../store/slices/uiSlice';
import Statistics from './Statistics';
import UnresponsiveSubscriberStream from './UnresponsiveSubscriberStream';

const OverlayContainer = styled(Grid)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  fontSize: 'inherit',
  width: '100%',
  padding: theme.spacing(1),
  background: 'transparent',
}));

const IndicatorContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  display: 'grid',
  gridAutoFlow: 'column',
  gridAutoColumns: theme.spacing(3),
  gap: theme.spacing(1),
}));

export const OverlayIconButton = styled(IconButton)(({ theme }) => ({
  '&.MuiIconButton-colorPrimary, &.MuiIconButton-colorSecondary': {
    height: theme.spacing(2.5),
    width: theme.spacing(3),
    padding: theme.spacing(1),
    opacity: 0.8,
    color: theme.palette.primary.contrastText,
    '& .MuiSvgIcon-root': {
      fontSize: theme.typography.pxToRem(13),
    },
    ':hover': {
      opacity: 1,
    },
  },

  '&.MuiIconButton-colorPrimary': {
    svg: {
      fill: theme.palette.secondary.contrastText,
    },
    ':hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },

  '&.MuiIconButton-colorSecondary': {
    ':hover': {
      backgroundColor: theme.palette.secondary.lighter,
    },
  },
}));

interface VideoOverlayProps {
  participantId: ParticipantId;
  active: boolean;
}

const VideoOverlay = ({ participantId, active }: VideoOverlayProps) => {
  const userLayout = useAppSelector(selectParticipantsLayout);
  const dispatch = useAppDispatch();
  const mediaDescriptor = useMemo(() => ({ participantId, mediaType: MediaSessionType.Video }), [participantId]);
  const subscriber = useAppSelector(selectSubscriberById(mediaDescriptor));
  const displayName = useAppSelector(selectParticipantName(participantId));
  const pinnedParticipantId = useAppSelector(selectPinnedParticipantId);
  const stats = useAppSelector(selectStatsById(mediaDescriptor));
  const { t } = useTranslation();
  const online = subscriber?.streamState?.connection === 'connected';

  const fullscreenHandle = useFullscreenContext();

  const togglePin = useCallback(() => {
    const updatePinnedId = pinnedParticipantId === participantId ? undefined : participantId;
    dispatch(pinnedParticipantIdSet(updatePinnedId));
  }, [dispatch, participantId, pinnedParticipantId]);

  const openFullScreenView: MouseEventHandler = useCallback(
    (e) => {
      e.stopPropagation();
      fullscreenHandle.enter(participantId).catch((e) => console.error('failed to enter fullscreen mode:', e));
    },
    [fullscreenHandle, participantId]
  );

  const connectionLossPercent = useMemo(() => {
    if (stats?.connection.packetLoss === undefined) {
      return 0;
    }
    return Math.round(stats.connection.packetLoss * 100);
  }, [stats?.connection.packetLoss]);

  const getOverlayButtons = () => (
    <IndicatorContainer item>
      {online && (active || connectionLossPercent >= 1) && (
        <Statistics descriptor={mediaDescriptor} packetLossPercent={connectionLossPercent} />
      )}
      {active && (
        <>
          {userLayout === LayoutOptions.Speaker && (
            <OverlayIconButton
              color={pinnedParticipantId === participantId ? 'primary' : 'secondary'}
              onClick={togglePin}
              aria-label={t(`indicator-pinned`, {
                participantName: displayName || '',
              })}
            >
              <PinIcon />
            </OverlayIconButton>
          )}
          <OverlayIconButton aria-label={t('indicator-fullscreen-open')} onClick={openFullScreenView} color="secondary">
            <FullscreenViewIcon />
          </OverlayIconButton>
        </>
      )}
      <UnresponsiveSubscriberStream descriptor={mediaDescriptor} />
    </IndicatorContainer>
  );

  return <OverlayContainer children={getOverlayButtons()} />;
};

export default VideoOverlay;
