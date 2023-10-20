// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';
import React, { createContext, ReactNode, useContext, useState, useLayoutEffect } from 'react';
import { FullScreenHandle, useFullScreenHandle } from 'react-full-screen';

interface ExtendedFullScreenHandle extends FullScreenHandle {
  enter: (participantId?: ParticipantId) => Promise<void>;
  fullscreenParticipantID: ParticipantId | undefined;
  rootElement: HTMLElement | null;
  setRootElement: (element: HTMLElement | null) => void;
  hasActiveOverlay: boolean;
  setHasActiveOverlay: (hasActiveOverlay: boolean) => void;
}

const FullscreenContext = createContext<ExtendedFullScreenHandle | null>(null);

const FullscreenProvider = ({ children }: { children: ReactNode }) => {
  const fullscreenHandle = useFullScreenHandle();

  const [fullscreenParticipantID, setFullscreenParticipantID] = useState<ParticipantId | undefined>(undefined);
  const [rootElement, setRootElement] = useState<HTMLElement | null>(
    typeof document !== 'undefined' ? document.body : null
  );
  const [hasActiveOverlay, setHasActiveOverlay] = useState<boolean>(false);

  const enterFullscreen = (participantId?: ParticipantId) => {
    setFullscreenParticipantID(participantId);
    return fullscreenHandle.enter();
  };

  useLayoutEffect(() => {
    if (!fullscreenHandle.active) {
      setHasActiveOverlay(false);
    }
  }, [fullscreenHandle.active]);

  const extendedFullscreenHandle = {
    ...fullscreenHandle,
    rootElement,
    setRootElement,
    hasActiveOverlay,
    setHasActiveOverlay,
    enter: enterFullscreen,
    fullscreenParticipantID,
  };

  return <FullscreenContext.Provider value={extendedFullscreenHandle}>{children}</FullscreenContext.Provider>;
};

export default FullscreenProvider;

export const useFullscreenContext = (): ExtendedFullScreenHandle => {
  const contextValue = useContext(FullscreenContext);

  if (contextValue === null) {
    throw Error('Fullscreen context has not been Provided!');
  }

  return contextValue;
};
