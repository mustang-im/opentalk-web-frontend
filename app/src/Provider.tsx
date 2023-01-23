// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import DateFnsUtils from '@date-io/date-fns';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { CssBaseline, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { AuthProvider } from '@opentalk/react-redux-appauth';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { createOpenTalkTheme } from './assets/themes/opentalk';
import { MediaProvider } from './components/MediaProvider';
import { useAppSelector } from './hooks';
import BreakoutRoomProvider from './provider/BreakoutRoomProvider';
import FullscreenProvider from './provider/FullscreenProvider';
import NotificationProvider from './provider/NotificationProvider';
import store from './store';
import { selectBaseUrl, selectOidcConfig } from './store/slices/configSlice';
import { selectInRoomState } from './store/slices/roomSlice';

const localeMap = new Map([
  ['en', enLocale],
  ['de', deLocale],
]);

interface IProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: IProviderProps) => {
  const oidcConfig = useAppSelector(selectOidcConfig);
  const baseUrl = useAppSelector(selectBaseUrl);
  const inRoom = useAppSelector(selectInRoomState);
  const { i18n } = useTranslation();
  // Language can be in the format of en-US or de-DE
  const language = i18n.language.split('-')[0];
  const locale = localeMap.get(language);

  return (
    <StyledEngineProvider injectFirst>
      <LocalizationProvider dateAdapter={AdapterDateFns} utils={DateFnsUtils} locale={locale}>
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
            <NotificationProvider>
              <BreakoutRoomProvider>
                <MediaProvider>
                  <FullscreenProvider>{children}</FullscreenProvider>
                </MediaProvider>
              </BreakoutRoomProvider>
            </NotificationProvider>
          </ThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </StyledEngineProvider>
  );
};

export default Provider;
