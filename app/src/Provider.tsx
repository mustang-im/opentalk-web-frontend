// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { AuthProvider } from '@opentalk/react-redux-appauth';
import React from 'react';

import { createOpenTalkTheme } from './assets/themes/opentalk';
import { MediaProvider } from './components/MediaProvider';
import { useAppSelector } from './hooks';
import BreakoutRoomProvider from './provider/BreakoutRoomProvider';
import FullscreenProvider from './provider/FullscreenProvider';
import SnackbarProvider from './provider/SnackbarProvider';
import store from './store';
import { selectBaseUrl, selectOidcConfig } from './store/slices/configSlice';
import { ConnectionState, selectRoomConnectionState } from './store/slices/roomSlice';

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  const oidcConfig = useAppSelector(selectOidcConfig);
  const baseUrl = useAppSelector(selectBaseUrl);
  const roomState = useAppSelector(selectRoomConnectionState);
  const inRoom = roomState === ConnectionState.Online || roomState === ConnectionState.Leaving;

  return (
    <StyledEngineProvider injectFirst>
      <AuthProvider
        store={store}
        authority={oidcConfig.authority}
        clientId={oidcConfig.clientId}
        signOutRedirectUri={new URL(oidcConfig.signOutRedirectUri, baseUrl).toString()}
        redirectUri={new URL(oidcConfig.redirectPath, baseUrl).toString()}
        // We can use the popup_redirect_uri at this point to just share a single route.
        // The iframe content will never be visible.
        silentRedirectUri={new URL(oidcConfig.popupRedirectPath, baseUrl).toString()}
        popupRedirectUri={new URL(oidcConfig.popupRedirectPath, baseUrl).toString()}
        scope={oidcConfig.scope}
        silentSignin={true}
      >
        <ThemeProvider theme={inRoom ? createOpenTalkTheme('dark') : createOpenTalkTheme()}>
          <CssBaseline />
          <SnackbarProvider>
            <BreakoutRoomProvider>
              <MediaProvider>
                <FullscreenProvider>{children}</FullscreenProvider>
              </MediaProvider>
            </BreakoutRoomProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </AuthProvider>
    </StyledEngineProvider>
  );
};

export default Provider;
