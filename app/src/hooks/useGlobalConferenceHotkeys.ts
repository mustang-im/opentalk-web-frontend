// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomMode, selectHotkeysEnabled } from '@opentalk/common';
import { automodStore } from '@opentalk/components';
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '.';
import { automod } from '../api/types/outgoing';
import { useMediaContext } from '../components/MediaProvider';
import { useFullscreenContext } from '../provider/FullscreenProvider';
import { selectAudioEnabled, selectMediaChangeInProgress, selectVideoEnabled } from '../store/slices/mediaSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';

export const HOTKEYS = ['v', 'm', 'f'];

const useGlobalConferenceHotkeys = () => {
  const mediaContext = useMediaContext();
  const fullscreenContext = useFullscreenContext();
  const hotkeysEnabled = useAppSelector(selectHotkeysEnabled);
  const audioEnabled = useAppSelector(selectAudioEnabled);
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const roomMode = useAppSelector(selectCurrentRoomMode);
  const speakerState = useAppSelector(automodStore.selectSpeakerState);
  const dispatch = useDispatch();

  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);
  const push2TalkStart = useRef<Promise<void> | undefined>();
  const push2TalkEnd = useRef<Promise<void> | undefined>();
  const [push2TalkEnabled, setPush2TalkEnabled] = useState<boolean>(!audioEnabled);

  const switchAudio = useCallback((value: boolean) => mediaContext.trySetAudio(value), [mediaContext]);

  const toggleAudio = useCallback(() => {
    if (!isLoadingMedia) {
      switchAudio(!audioEnabled).then(() => setPush2TalkEnabled(audioEnabled));
    }
  }, [isLoadingMedia, switchAudio, audioEnabled]);

  const toggleVideo = useCallback(() => {
    if (!isLoadingMedia) {
      mediaContext.trySetVideo(!videoEnabled);
    }
  }, [isLoadingMedia, mediaContext, videoEnabled]);

  const pushToTalk = useCallback(
    (type: 'keyup' | 'keydown') => {
      const startAudio = async () => {
        await switchAudio(true);
        push2TalkStart.current = undefined;
      };

      const stopAudio = async () => {
        await switchAudio(false);
        push2TalkEnd.current = undefined;
      };

      //Maybe not nice looking due to the deep nesting. This is used to filter the actions and avoid race conditions within the mediaContext
      switch (type) {
        case 'keydown':
          if (push2TalkStart.current === undefined) {
            if (push2TalkEnd.current === undefined) {
              push2TalkStart.current = startAudio();
            } else {
              push2TalkStart.current = push2TalkEnd.current.then(() => startAudio());
            }
          }
          break;
        case 'keyup':
          if (push2TalkEnd.current === undefined) {
            if (push2TalkStart.current === undefined) {
              push2TalkEnd.current = stopAudio();
            } else {
              push2TalkEnd.current = push2TalkStart.current.then(() => stopAudio());
            }
          }
          break;
      }
    },
    [switchAudio]
  );

  const toggleFullscreenView = useCallback(async () => {
    if (fullscreenContext.active) {
      await fullscreenContext.exit();
    } else {
      await fullscreenContext.enter();
    }
  }, [fullscreenContext]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!hotkeysEnabled) {
        return;
      }

      const { type, repeat, key } = event;

      if (HOTKEYS.includes(key) && type === 'keyup') {
        event.preventDefault();

        switch (key) {
          case 'm':
            if (mediaContext.hasMicrophone) {
              toggleAudio();
            }
            break;
          case 'v':
            if (mediaContext.hasCamera) {
              toggleVideo();
            }
            break;
          case 'f':
            toggleFullscreenView();
            break;
        }
      }

      if (!repeat && key === 'n' && roomMode === RoomMode.TalkingStick && speakerState === 'active') {
        event.preventDefault();
        // Attempted to achieve `setAsTransitioningSpeaker` in a middleware, but we are unable
        // to define `pass.action` case twice as it is already defined in the ee-components.
        // We would need to extract case definition from ee-components to the middleware,
        // which then brings same sequential updates like in here, just in the different place.
        dispatch(automodStore.actions.setAsTransitioningSpeaker());
        dispatch(automod.actions.pass.action());
      }

      if (key === ' ' && (type === 'keyup' || type === 'keydown')) {
        event.preventDefault();

        if (!repeat && push2TalkEnabled) {
          pushToTalk(type);
        }
      }
    },
    [
      mediaContext.hasMicrophone,
      mediaContext.hasCamera,
      pushToTalk,
      hotkeysEnabled,
      push2TalkEnabled,
      toggleAudio,
      toggleVideo,
      toggleFullscreenView,
      roomMode,
      speakerState,
      dispatch,
    ]
  );

  useEffect(() => {
    const debouncedHandleKeypress = debounce(handleKeyPress, 100);

    window.addEventListener('keydown', debouncedHandleKeypress);
    window.addEventListener('keyup', debouncedHandleKeypress);

    return () => {
      window.removeEventListener('keydown', debouncedHandleKeypress);
      window.removeEventListener('keyup', debouncedHandleKeypress);
    };
  }, [handleKeyPress]);
};

export default useGlobalConferenceHotkeys;
