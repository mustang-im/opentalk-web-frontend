// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { CssBaseline, ThemeProvider } from '@mui/material';
import 'context-filter-polyfill';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import 'webrtc-adapter';

import Provider from './Provider';
import Routes from './Routes';
import { createOpenTalkTheme } from './assets/themes/opentalk';
import './banner';
import AppErrorBoundary from './errorBoundaries/AppErrorBoundary';
import './i18n';
import browser from './modules/BrowserSupport';
import ErrorConfigPage from './pages/ErrorConfigPage';
import SplashScreenPage from './pages/SplashScreenPage';
import WrongBrowserPage from './pages/WrongBrowserPage';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { checkConfigError } from './utils/configUtils';

const devMode = window.localStorage.getItem('developmentMode') === 'true';

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<SplashScreenPage />}>
      {!(devMode || browser.isSupported()) ? (
        <ThemeProvider theme={createOpenTalkTheme()}>
          <CssBaseline />
          <WrongBrowserPage />
        </ThemeProvider>
      ) : checkConfigError() ? (
        <ErrorConfigPage />
      ) : (
        <Router basename={new URL(window.config.baseUrl).pathname}>
          <StoreProvider store={store}>
            <AppErrorBoundary>
              <Provider>
                <Routes />
              </Provider>
            </AppErrorBoundary>
          </StoreProvider>
        </Router>
      )}
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
