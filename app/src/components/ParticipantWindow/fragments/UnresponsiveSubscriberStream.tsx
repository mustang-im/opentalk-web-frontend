// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Tooltip } from '@mui/material';
import { CameraOnIcon, ConnectionGoodIcon, MicOnIcon, WarningIcon } from '@opentalk/common';
import React, { VideoHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { MediaDescriptor, MediaStreamState } from '../../../modules/WebRTC';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';

type IRemoteVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  descriptor: MediaDescriptor;
};

const UnresponsiveSubscriberStream = ({ descriptor }: IRemoteVideoProps) => {
  const subscriber = useAppSelector(selectSubscriberById(descriptor));
  const { t } = useTranslation();

  const renderFailedTooltip = (title: string, icon?: React.ReactNode) => (
    <Tooltip title={title}>
      <Stack direction={'row'}>
        <WarningIcon color="error" fontSize="medium" />
        {icon}
      </Stack>
    </Tooltip>
  );

  const unresponsiveSubscriberStreamState = () => {
    switch (subscriber?.streamState) {
      case MediaStreamState.Broken:
        if (subscriber?.audio || subscriber?.video) {
          return renderFailedTooltip(
            t('participant-stream-broken-tooltip') || '',
            <ConnectionGoodIcon color="error" fontSize="medium" />
          );
        }
        break;
      case MediaStreamState.AudioBroken:
        if (subscriber?.audio) {
          return renderFailedTooltip(
            t('participant-audio-broken-tooltip') || '',
            <MicOnIcon color="error" fontSize="medium" />
          );
        }
        break;
      case MediaStreamState.VideoBroken:
        if (subscriber?.video) {
          return renderFailedTooltip(
            t('participant-video-broken-tooltip') || '',
            <CameraOnIcon color="error" fontSize="medium" />
          );
        }
        break;
    }
  };

  return <>{unresponsiveSubscriberStreamState()}</>;
};

export default UnresponsiveSubscriberStream;
