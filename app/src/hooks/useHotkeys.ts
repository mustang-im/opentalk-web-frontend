// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '.';
import { pass } from '../api/types/outgoing/automod';
import { useMediaContext } from '../components/MediaProvider';
import { useFullscreenContext } from '../hooks/useFullscreenContext';
import { selectIsUserMicDisabled } from '../store/selectors';
import { selectSpeakerState, setAsTransitioningSpeaker } from '../store/slices/automodSlice';
import { selectAudioEnabled, selectMediaChangeInProgress, selectVideoEnabled } from '../store/slices/mediaSlice';
import { selectCurrentRoomMode } from '../store/slices/roomSlice';
import { selectTimerStyle } from '../store/slices/timerSlice';
import { selectHotkeysEnabled } from '../store/slices/uiSlice';
import { RoomMode, TimerStyle } from '../types';

export const HOTKEY_MICROPHONE = 'm';
export const HOTKEY_VIDEO = 'v';
export const HOTKEY_FULLSCREEN = 'f';
export const HOTKEY_PUSH_TO_TALK = ' ';
export const HOTKEY_NEXT_SPEAKER = 'n';
const HOTKEYS = [HOTKEY_VIDEO, HOTKEY_MICROPHONE, HOTKEY_FULLSCREEN, HOTKEY_PUSH_TO_TALK, HOTKEY_NEXT_SPEAKER];
const HOTKEY_DEBOUNCE_TIME = 100; //ms

export const useHotkeysActive = (): boolean => {
  const hotkeysEnabled = useAppSelector(selectHotkeysEnabled);
  const timerStyle = useAppSelector(selectTimerStyle);

  return hotkeysEnabled && timerStyle !== TimerStyle.CoffeeBreak;
};

export const useHotkeys = () => {
  const mediaContext = useMediaContext();
  const fullscreenContext = useFullscreenContext();
  const audioEnabled = useAppSelector(selectAudioEnabled);
  const videoEnabled = useAppSelector(selectVideoEnabled);
  const roomMode = useAppSelector(selectCurrentRoomMode);
  const speakerState = useAppSelector(selectSpeakerState);
  const hasMicrophoneDisabledByModerator = useAppSelector(selectIsUserMicDisabled);
  const dispatch = useDispatch();

  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);
  const startingAudio = useRef<Promise<void> | undefined>();
  const stoppingAudio = useRef<Promise<void> | undefined>();
  const [isInPushedToTalkMode, setIsInPushedToTalkMode] = useState(false);

  const hotkeysEnabled = useAppSelector(selectHotkeysEnabled);
  const timerStyle = useAppSelector(selectTimerStyle);

  const hotkeysActive = hotkeysEnabled && timerStyle !== TimerStyle.CoffeeBreak;

  const switchAudio = useCallback((value: boolean) => mediaContext.trySetAudio(value), [mediaContext]);

  const toggleAudio = useCallback(() => {
    if (!isLoadingMedia) {
      switchAudio(!audioEnabled);
    }
  }, [isLoadingMedia, switchAudio, audioEnabled]);

  const toggleVideo = useCallback(() => {
    if (!isLoadingMedia) {
      mediaContext.trySetVideo(!videoEnabled);
    }
  }, [isLoadingMedia, mediaContext, videoEnabled]);

  // Push-to-talk function shall work ONLY if the user is muted (audio is disabled)
  // On keydown we start the push-to-talk mode and unmute the user,
  // On keyup - stop the push-to-talk mode and mute the user again
  // We use `startingAudio` and `stoppingAudio` promises to prevent race condition
  // between audio en-/disabling actions in mediaContext
  const pushToTalk = (type: 'keyup' | 'keydown') => {
    const startAudio = async () => {
      if (hasMicrophoneDisabledByModerator) {
        return;
      }
      await switchAudio(true);
      startingAudio.current = undefined;
    };

    const stopAudio = async () => {
      await switchAudio(false);
      stoppingAudio.current = undefined;
    };

    switch (type) {
      case 'keydown':
        if (!audioEnabled) {
          if (startingAudio.current === undefined) {
            if (stoppingAudio.current === undefined) {
              startingAudio.current = startAudio();
            } else {
              startingAudio.current = stoppingAudio.current.then(() => startAudio());
            }
          }
          setIsInPushedToTalkMode(true);
        }
        break;
      case 'keyup':
        if (isInPushedToTalkMode) {
          if (stoppingAudio.current === undefined) {
            if (startingAudio.current === undefined) {
              stoppingAudio.current = stopAudio();
            } else {
              stoppingAudio.current = startingAudio.current.then(() => stopAudio());
            }
          }
          setIsInPushedToTalkMode(false);
        }
        break;
    }
  };

  const toggleFullscreenView = useCallback(() => {
    fullscreenContext[fullscreenContext.active ? 'exit' : 'enter']();
  }, [fullscreenContext]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (!hotkeysActive) {
        return;
      }

      const { type, repeat, key } = event;

      if (HOTKEYS.includes(key) && (type === 'keyup' || type === 'keydown')) {
        event.preventDefault();

        switch (key) {
          case HOTKEY_MICROPHONE:
            if (type === 'keyup' && mediaContext.hasMicrophone && !hasMicrophoneDisabledByModerator) {
              toggleAudio();
            }
            break;
          case HOTKEY_VIDEO:
            if (type === 'keyup' && mediaContext.hasCamera) {
              toggleVideo();
            }
            break;
          case HOTKEY_FULLSCREEN:
            if (type === 'keyup') {
              toggleFullscreenView();
            }
            break;
          case HOTKEY_PUSH_TO_TALK:
            // if (!repeat) {
            pushToTalk(type);
            //}
            break;
          case HOTKEY_NEXT_SPEAKER:
            if (!repeat && roomMode === RoomMode.TalkingStick && speakerState === 'active') {
              // Attempted to achieve `setAsTransitioningSpeaker` in a middleware, but we are unable
              // to define `pass.action` case twice as it is already defined in the ee-components.
              // We would need to extract case definition from ee-components to the middleware,
              // which then brings same sequential updates like in here, just in the different place.
              dispatch(setAsTransitioningSpeaker());
              dispatch(pass.action());
            }
            break;
          default:
            break;
        }
      }
    },
    [
      mediaContext.hasMicrophone,
      mediaContext.hasCamera,
      pushToTalk,
      hotkeysActive,
      audioEnabled,
      toggleAudio,
      toggleVideo,
      toggleFullscreenView,
      roomMode,
      speakerState,
      dispatch,
    ]
  );

  useEffect(() => {
    const debouncedHandleKeypress = debounce(handleKeyPress, HOTKEY_DEBOUNCE_TIME);

    window.addEventListener('keydown', debouncedHandleKeypress);
    window.addEventListener('keyup', debouncedHandleKeypress);

    return () => {
      window.removeEventListener('keydown', debouncedHandleKeypress);
      window.removeEventListener('keyup', debouncedHandleKeypress);
    };
  }, [handleKeyPress]);
};
