// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ParticipantId } from '@opentalk/common';
import React, { createContext, ReactNode, useContext, useState } from 'react';
import { FullScreenHandle, useFullScreenHandle } from 'react-full-screen';

interface ExtendedFullScreenHandle extends FullScreenHandle {
  enter: (participantId?: ParticipantId) => Promise<void>;
  fullscreenParticipantID: ParticipantId | undefined;
}

const FullscreenContext = createContext<ExtendedFullScreenHandle | null>(null);

const FullscreenProvider = ({ children }: { children: ReactNode }) => {
  const fullscreenHandle = useFullScreenHandle();

  const [fullscreenParticipantID, setFullscreenParticipantID] = useState<ParticipantId | undefined>(undefined);

  const enterFullscreen = (participantId?: ParticipantId) => {
    setFullscreenParticipantID(participantId);
    return fullscreenHandle.enter();
  };

  const extendedFullscreenHandle = { ...fullscreenHandle, enter: enterFullscreen, fullscreenParticipantID };

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
