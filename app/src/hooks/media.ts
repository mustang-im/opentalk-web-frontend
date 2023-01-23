// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting } from '@opentalk/common';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '.';
import { getMediaStream, MediaDescriptor, requestVideoQuality } from '../modules/WebRTC';
import { selectQualityCap } from '../store/slices/mediaSlice';
import { selectSubscriberById } from '../store/slices/mediaSubscriberSlice';
import notifications from '../utils/snackBarUtils';

export const useRemoteMedia = (descriptor: MediaDescriptor, mediaKind: 'video' | 'audio') => {
  const [media, setMediaStream] = useState<{ stream?: MediaStream; descriptor: MediaDescriptor }>({ descriptor });
  const [loading, setLoading] = useState<boolean>(false);
  const [qualityTarget, setQualityTarget] = useState<VideoSetting>(VideoSetting.Off);
  const releaseHandler = useRef<(() => void) | undefined>();
  const qualityMax = useAppSelector(selectQualityCap);
  const subscriber = useAppSelector(selectSubscriberById(descriptor));
  const dispatch = useAppDispatch();

  const qualityCap = descriptor.mediaType === 'screen' ? Math.max(qualityMax, VideoSetting.Low) : qualityMax;
  const quality = Math.min(qualityCap, qualityTarget);

  const { t } = useTranslation();

  const release = useCallback(() => {
    if (releaseHandler.current !== undefined) {
      releaseHandler.current();
      releaseHandler.current = undefined;
    }
  }, []);

  const reserve = useCallback(
    (quality: VideoSetting) => {
      requestVideoQuality(media.descriptor, quality)
        .then((newRelease) => {
          release();
          releaseHandler.current = newRelease;
        })
        .catch((e) => {
          console.error('requestVideoQuality failed', e);
        });
    },
    [media.descriptor, release]
  );

  useEffect(() => {
    if (media.stream !== undefined) {
      reserve(quality);
    }
  }, [media.stream, quality, reserve]);

  useEffect(() => {
    if ((media.stream !== undefined && media.descriptor === descriptor) || loading) {
      return;
    }
    if (subscriber && subscriber[mediaKind]) {
      //TODO: use the thunk pending instead of loading
      setLoading(true);
      setMediaStream(({ descriptor }) => ({ stream: undefined, descriptor }));
      getMediaStream(descriptor)
        .then((stream) => setMediaStream({ stream, descriptor }))
        .catch((e) => {
          console.error(`Subscription for participant ${descriptor.participantId} failed: ${e}`);
          //TODO: send an error report
          notifications.error(t('signaling-subscription-failed'));
        })
        .finally(() => setLoading(false));
    }
  }, [dispatch, subscriber, media, mediaKind, loading, descriptor, t]);

  // detach on unmount
  useEffect(() => release, [release]);

  return { stream: media?.stream, setQualityTarget };
};
