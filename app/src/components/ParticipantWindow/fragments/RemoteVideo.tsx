// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

/*  Since we probably won't be able to provide a real time transcription for videos as of now, media-has-caption will be disabled for now.*/

/* eslint-disable jsx-a11y/media-has-caption */
import { styled, Grid, CircularProgress } from '@mui/material';
import { VideoSetting } from '@opentalk/common';
import { debounce } from 'lodash';
import React, { useEffect, useRef, useCallback, VideoHTMLAttributes, useState } from 'react';

import { useRemoteMedia } from '../../../hooks/media';
import { idFromDescriptor, MediaDescriptor } from '../../../modules/WebRTC';

const Container = styled(Grid)({
  width: '100%',
  height: '100%',
});

const Loader = styled(CircularProgress)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const Video = styled('video')({
  width: '100%',
  height: '100%',
});

type IRemoteVideoProps = VideoHTMLAttributes<HTMLVideoElement> & {
  descriptor: MediaDescriptor;
};

const RemoteVideo = ({ descriptor }: IRemoteVideoProps) => {
  const { stream, setQualityTarget } = useRemoteMedia(descriptor, 'video');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState(0);

  useEffect(() => {
    if (videoRef.current !== null && stream !== undefined) {
      const videoElement = videoRef.current;
      videoElement.srcObject = stream;
      videoElement.playsInline = true;
      return () => {
        videoElement.srcObject = null;
      };
    }
    if (videoRef.current !== null) {
      return () => {
        videoRef.current = null;
      };
    }
    return;
  }, [stream, videoRef]);

  const handleResize = useCallback(() => {
    if (!containerRef.current) return;

    const videoWidth = containerRef.current.clientWidth;
    const videoHeight = containerRef.current.clientHeight;
    const size = Math.min(videoHeight, videoWidth);
    setSize(size);
  }, [containerRef, setSize]);

  useEffect(() => {
    switch (true) {
      case size >= 500:
        setQualityTarget(VideoSetting.High);
        break;
      case size < 200:
        setQualityTarget(VideoSetting.Low);
        break;
      default:
        setQualityTarget(VideoSetting.Medium);
        break;
    }
  }, [setQualityTarget, size, stream]);

  useEffect(() => {
    const resizeHandler = debounce(handleResize, 100);
    resizeHandler();

    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [handleResize]);

  return (
    <Container
      ref={containerRef}
      container
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      data-testid={`remoteVideo-${idFromDescriptor(descriptor)}`}
    >
      {stream && <Video muted autoPlay ref={videoRef} />}
      {stream === undefined && <Loader />}
    </Container>
  );
};

export default RemoteVideo;
