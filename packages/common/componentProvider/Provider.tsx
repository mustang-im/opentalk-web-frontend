// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React, { createContext, FC, ReactNode } from 'react';

import { DefaultAvatarImage } from '../types/common';

export interface ComponentContextValue {
  children?: ReactNode[] | ReactNode;
  libravatarDefaultImage: DefaultAvatarImage;
  setHotkeysEnabled(payload: boolean): {
    payload: boolean;
    type: string;
  };
}

export const ComponentContext = createContext<ComponentContextValue | null>(null);

const ComponentProvider: FC<ComponentContextValue> = ({ libravatarDefaultImage, setHotkeysEnabled, children }) => {
  return (
    <ComponentContext.Provider
      value={{
        libravatarDefaultImage: libravatarDefaultImage,
        setHotkeysEnabled,
      }}
    >
      {children}
    </ComponentContext.Provider>
  );
};

export default ComponentProvider;
