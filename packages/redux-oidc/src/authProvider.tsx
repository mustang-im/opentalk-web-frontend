import React, { createContext, FC, PropsWithChildren, useContext, useEffect } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';

import { AuthTypeError, calculateTokenRenewalTime, hasValidToken } from '.';
import { AuthAdapter, AuthAdapterConfiguration, AuthenticationProviderUrls } from './authAdapter';
import { getNewToken } from './store/authActions';
import {
  selectError,
  selectIsAuthenticated,
  selectIsRefreshTokenLoading,
  selectLoginTimestamp,
  selectRefreshError,
  startLoading,
} from './store/authSlice';

export interface AuthContextValues {
  configuration: AuthAdapterConfiguration;
  signIn: (redirectUrl?: string) => void;
  signOut: (signOutRedirectUrl?: string) => void;
  getConfigurationEndpoints: () => Promise<AuthenticationProviderUrls>;
  getBaseUrl: () => string;
  getSavedRedirectUrl: () => string | undefined;
  getNewRefreshToken: () => void;
}

export interface AuthProviderValues {
  configuration: AuthAdapterConfiguration;
}

export const AuthContext = createContext<AuthContextValues | undefined>(undefined);

const AuthProvider: FC<PropsWithChildren<AuthProviderValues>> = ({ children, configuration }) => {
  const dispatch = useDispatch();
  const authAdapter = AuthAdapter.getInstance(configuration);
  const isRefreshAuthError = useSelector(selectRefreshError);
  const isAuthError = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loginTimestamp = useSelector(selectLoginTimestamp);
  const isRefresTokenLoading = useSelector(selectIsRefreshTokenLoading);

  // default is window.location.href
  const signIn = async (redirectUrl?: string) => {
    authAdapter.startOidcSignIn(redirectUrl);
  };

  const signOut = (signOutRedirectUrl?: string) => {
    authAdapter.signOut(signOutRedirectUrl);
  };

  const getConfigurationEndpoints = async () => await authAdapter.getConfigurationEndpoints();
  const getBaseUrl = () => authAdapter.getBaseUrl();
  const getSavedRedirectUrl = () => authAdapter.getSavedLocation();

  const getNewRefreshToken = () => {
    getConfigurationEndpoints().then((config) => {
      dispatch(
        getNewToken({
          clientId: configuration.clientId,
          tokenEndpoint: config.tokenEndpoint,
          baseUrl: configuration.baseUrl,
        })
      );
    });
  };

  /**
   * When authenticated:
   * 1. If access token is not valid get immediatly new one and put loading state to true
   * 2. If access token is valid set interval for getting new one
   */
  useEffect(() => {
    if (isAuthenticated) {
      if (isRefresTokenLoading) {
        return;
      }
      const accessToken = authAdapter.getAccessToken();
      if (!hasValidToken(accessToken)) {
        // We manualy dispatch startLoading from here, because user is already authenticated, but token is not automaticly refetched
        // (probably because user closed the app in the meantime or connection issues occured)
        // The UI needs to waits untill new token is requested.
        batch(() => {
          dispatch(startLoading());
          getNewRefreshToken();
        });
      } else {
        const renewalTokenInterval = calculateTokenRenewalTime(accessToken as string);
        const tokenInterval = setInterval(() => {
          getNewRefreshToken();
        }, renewalTokenInterval);
        return () => {
          clearInterval(tokenInterval);
        };
      }
    }
  }, [isAuthenticated, loginTimestamp]);

  // ERROR handling
  useEffect(() => {
    if (isRefresTokenLoading) {
      return;
    }
    if (isRefreshAuthError) {
      signOut(window.location.href);
    }
    if (isAuthError && isAuthError.name === AuthTypeError.SessionExpired) {
      getNewRefreshToken();
    }
  }, [isRefreshAuthError, isAuthError]);

  return (
    <AuthContext.Provider
      value={{
        configuration,
        signIn,
        signOut,
        getConfigurationEndpoints,
        getBaseUrl,
        getSavedRedirectUrl,
        getNewRefreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext() {
  return useContext(AuthContext);
}

export default AuthProvider;
