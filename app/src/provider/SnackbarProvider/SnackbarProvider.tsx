// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SnackbarProvider as DefaultSnackbarProvider } from '@opentalk/common';
import { ReactNode, useState, useEffect } from 'react';

import { TimeLimitNotification } from '../../components/TimeLimitNotification/TimeLimitNotification';
import { useAppSelector } from '../../hooks';
import { selectIsFullscreenMode } from '../../store/slices/uiSlice';

declare module 'notistack' {
  interface VariantOverrides {
    timeLimit: true;
  }
  interface OptionsObject {
    minutes?: number;
  }
}

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  const [notistackDomRoot, setNotistackDomRoot] = useState<HTMLElement | undefined>(undefined);
  const isFullScreenMode = useAppSelector(selectIsFullscreenMode);

  // Normal mode (no fullscreen): snackbar container is applied to the `root` div by default
  //
  // Fullscreen mode: the element, which is being displayed in fullscreen mode, will
  // overlap the snackbar container and the snackbars will be unvisible for the user.
  // Therefore we need to re-mout the snackbar container and append it to the fullscreen element.
  //
  useEffect(() => {
    const fullscreenElement = document.fullscreenElement;
    if (isFullScreenMode && fullscreenElement) {
      setNotistackDomRoot(document.fullscreenElement as HTMLElement);
    } else {
      setNotistackDomRoot(undefined);
    }
  }, [isFullScreenMode]);

  return (
    <>
      <DefaultSnackbarProvider Components={{ timeLimit: TimeLimitNotification }} domRoot={notistackDomRoot}>
        {children}
      </DefaultSnackbarProvider>
    </>
  );
};

export default SnackbarProvider;
