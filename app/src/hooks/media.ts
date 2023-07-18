// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { VideoSetting, notifications } from '@opentalk/common';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '.';
import { getMediaStream, MediaDescriptor, requestVideoQuality } from '../modules/WebRTC';
import { selectQualityCap } from '../store/slices/mediaSlice';
import { selectSubscriberById } from '../store/slices/mediaSubscriberSlice';

export const useRemoteMedia = (descriptor: MediaDescriptor, mediaKind: 'video' | 'audio') => {
  const [media, setMediaStream] = useState<
    { stream?: MediaStream; process?: Promise<void>; descriptor: MediaDescriptor } | undefined
  >(undefined);
  const [isAborted, setAborted] = useState(false);
  const [qualityTarget, setQualityTarget] = useState<VideoSetting>(VideoSetting.Off);
  const releaseHandler = useRef<(() => void) | undefined>();
  const qualityMax = useAppSelector(selectQualityCap);
  const subscriber = useAppSelector(selectSubscriberById(descriptor));

  const qualityCap = descriptor.mediaType === 'screen' ? Math.max(qualityMax, VideoSetting.Low) : qualityMax;
  const quality = Math.min(qualityCap, qualityTarget);

  const { t } = useTranslation();

  const release = useCallback(() => {
    if (releaseHandler.current !== undefined) {
      releaseHandler.current();
      releaseHandler.current = undefined;
    }
  }, [releaseHandler]);

  const reserve = useCallback(
    (quality: VideoSetting, descriptor: MediaDescriptor) => {
      requestVideoQuality(descriptor, quality)
        .then((newRelease) => {
          release();
          releaseHandler.current = newRelease;
        })
        .catch((e) => {
          console.error('requestVideoQuality failed', e);
        });
    },
    [release]
  );

  useEffect(() => {
    if (media !== undefined) {
      reserve(quality, media.descriptor);
    }
  }, [media, quality, reserve]);

  useEffect(() => {
    if (media?.descriptor === descriptor && (media?.process || media?.stream)) {
      return;
    }
    if (subscriber === undefined || subscriber[mediaKind] === undefined) {
      return;
    }

    const process = getMediaStream(descriptor)
      .then((stream) => {
        const observedTrack = stream.getTracks().find((track) => track.kind === mediaKind);
        if (observedTrack === undefined) {
          console.error(`Expected media track unavailable for participant ${descriptor.participantId}`);
          notifications.error(t('signaling-subscription-failed'));
          return undefined;
        }
        const endedListener = () => {
          setMediaStream(undefined);
          observedTrack.removeEventListener('ended', endedListener);
        };
        observedTrack.addEventListener('ended', endedListener);
        if (!isAborted) {
          setMediaStream({ stream, descriptor });
        }
      })
      .catch((e) => {
        console.error(`Subscription for participant ${descriptor.participantId} failed: ${e}`);
        //TODO: send an error report
        notifications.error(t('signaling-subscription-failed'));
      });

    // store loading state
    //TODO: use the thunk pending instead of loading
    setMediaStream({ process, descriptor });
  }, [subscriber, media, mediaKind, descriptor, t]);

  // detach on unmount
  useEffect(() => release, [release]);

  // parent component can prevent state update after unmounting (e.g. on promise subscription)
  const cleanup = () => {
    setAborted(true);
  };

  return { stream: media?.stream, setQualityTarget, cleanup };
};
