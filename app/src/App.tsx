// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useCallback, useState } from 'react';
import { Provider as StoreProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Provider from './Provider';
import Routes from './Routes';
import { createOpenTalkTheme } from './assets/themes/opentalk';
import ConfirmBrowserDialog, { isBrowserConfirmed } from './components/ConfirmBrowserDialog/ConfirmBrowserDialog';
import AppErrorBoundary from './errorBoundaries/AppErrorBoundary';
import browser from './modules/BrowserSupport';
import ErrorConfigPage from './pages/ErrorConfigPage';
import store from './store';
import { checkConfigError } from './utils/configUtils';

const App = () => {
  const signature = browser.getBrowserSignature();
  const [isConfirmed, setBrowserConfirmed] = useState(isBrowserConfirmed());
  const hasConfigError = checkConfigError();

  if (hasConfigError) return <ErrorConfigPage />;

  const handleClick = useCallback(() => {
    localStorage.setItem('browser-confirmed', signature);
    setBrowserConfirmed(true);
  }, []);

  if (!isConfirmed) {
    return (
      <ThemeProvider theme={createOpenTalkTheme()}>
        <CssBaseline />
        <ConfirmBrowserDialog handleClick={handleClick} />
      </ThemeProvider>
    );
  }

  return (
    <Router basename={new URL(window.config.baseUrl).pathname}>
      <StoreProvider store={store}>
        <AppErrorBoundary>
          <Provider>
            <Routes />
          </Provider>
        </AppErrorBoundary>
      </StoreProvider>
    </Router>
  );
};

export default App;
