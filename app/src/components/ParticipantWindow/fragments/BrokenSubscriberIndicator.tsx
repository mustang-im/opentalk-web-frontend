// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CameraOnIcon, ConnectionGoodIcon, MicOnIcon } from '@opentalk/common';
import React, { VideoHTMLAttributes } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { MediaDescriptor } from '../../../modules/WebRTC';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { FailureBadge } from './FailureBadge';

type IRemoteVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  descriptor: MediaDescriptor;
};

const BrokenSubscriberIndicator = ({ descriptor }: IRemoteVideoProps) => {
  const subscriber = useAppSelector(selectSubscriberById(descriptor));
  const { t } = useTranslation();
  const subscriberState = subscriber?.subscriberState;

  if (subscriber === undefined) {
    return null;
  }

  if (subscriberState === undefined || subscriberState.connection !== 'connected') {
    return (
      <FailureBadge title={t('participant-stream-broken-tooltip') || ''}>
        <ConnectionGoodIcon color="error" fontSize="medium" />
      </FailureBadge>
    );
  }

  const audioBroken = subscriber.audio && !subscriberState.audioRunning;
  const videoBroken = subscriber.video && !subscriberState.videoRunning;

  if (!audioBroken && !videoBroken) {
    return null;
  }
  let errorText = '';

  if (audioBroken && videoBroken) {
    errorText = t('participant-stream-broken-tooltip');
  } else if (audioBroken) {
    errorText = t('participant-audio-broken-tooltip');
  } else if (videoBroken) {
    errorText = t('participant-video-broken-tooltip');
  }

  return (
    <FailureBadge title={errorText}>
      {audioBroken && <MicOnIcon color="error" fontSize="medium" />}
      {videoBroken && <CameraOnIcon color="error" fontSize="medium" />}
    </FailureBadge>
  );
};

export default BrokenSubscriberIndicator;
