// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CameraOnIcon, ConnectionGoodIcon, MicOnIcon } from '@opentalk/common';
import React, { VideoHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { MediaDescriptor, MediaStreamState } from '../../../modules/WebRTC';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { FailureBadge } from './FailureBadge';

type IRemoteVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  descriptor: MediaDescriptor;
};

const UnresponsiveSubscriberStream = ({ descriptor }: IRemoteVideoProps) => {
  const subscriber = useAppSelector(selectSubscriberById(descriptor));
  const { t } = useTranslation();

  switch (subscriber?.streamState) {
    case MediaStreamState.Broken:
      if (subscriber?.audio || subscriber?.video) {
        return (
          <FailureBadge title={t('participant-stream-broken-tooltip')}>
            <ConnectionGoodIcon color="error" fontSize="medium" />
          </FailureBadge>
        );
      }
      break;
    case MediaStreamState.AudioBroken:
      if (subscriber?.audio) {
        return (
          <FailureBadge title={t('participant-audio-broken-tooltip')}>
            <MicOnIcon color="error" fontSize="medium" />
          </FailureBadge>
        );
      }
      break;
    case MediaStreamState.VideoBroken:
      if (subscriber?.video) {
        return (
          <FailureBadge title={t('participant-video-broken-tooltip')}>
            <CameraOnIcon color="error" fontSize="medium" />
          </FailureBadge>
        );
      }
      break;
  }
  return null;
};

export default UnresponsiveSubscriberStream;
