// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { selectAuthError } from '@opentalk/react-redux-appauth';
import { Suspense, useMemo } from 'react';
import { useRoutes } from 'react-router-dom';

import SuspenseLoading from './commonComponents/SuspenseLoading';
import BetaBadge from './components/BetaBadge';
import routeArray from './config/routes';
import { useAppSelector } from './hooks';
import ErrorLoginPage from './pages/ErrorLoginPage';
import { selectIsBetaRelease, selectOidcConfig } from './store/slices/configSlice';

const Routes = () => {
  const oidcConfig = useAppSelector(selectOidcConfig);
  const isBetaRelease = useAppSelector(selectIsBetaRelease);
  const routes = useRoutes(routeArray(oidcConfig.redirectPath, oidcConfig.popupRedirectPath));
  const isAuthError = useAppSelector<Error | undefined>(selectAuthError);

  const renderRoutes = useMemo(() => {
    return isAuthError ? <ErrorLoginPage error={isAuthError} redirectUrl={window.location.pathname} /> : routes;
  }, [isAuthError, routes]);

  return (
    <Suspense fallback={<SuspenseLoading />}>
      {isBetaRelease && <BetaBadge />}
      {renderRoutes}
    </Suspense>
  );
};

export default Routes;
