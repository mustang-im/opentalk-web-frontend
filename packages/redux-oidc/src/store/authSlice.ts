// move this to common
import { createSlice } from '@reduxjs/toolkit';

import { AuthTypeError, SerializedError, SessionStatus, getSessionStatus } from '../utils';
import { login, codeCallback, getNewToken } from './authActions';

export interface AuthState {
  state: SessionStatus;
  loginTimestamp: string | undefined;
  loading: boolean;
  refreshTokenLoading: boolean;
  error: SerializedError | undefined;
}

/**
 * ### SessionStatus Machine Graph
 *	 Initial state = ANONYMOUS
 * - CodeCallback:
 *      PENDING -> PENDING -> Login to keyclock starts
 *      Success -> PENDING -> Login to controller starts
 * 		Failed  -> ANONYMOUS -> User gets redirected to login page
 * - Login:
 * 		PENDING -> PENDING | AUTHORIZED (depending if it's called after CodeCallback or getNewToken) -> Login to controller starts
 * 		Success -> AUTHORIZED -> Login finished successfully
 * 		Failed  -> ANONYMOUS -> User gets redirected to login page
 *
 *  - getNewToken:
 * 		Failed  -> ANONYMOUS -> User gets redirected to login page
 */

const initialState = {
  state: getSessionStatus(),
  loginTimestamp: undefined,
  refreshTokenLoading: false,
  loading: false,
} as AuthState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authorize: (state) => {
      state.state = SessionStatus.AUTHORIZED;
    },
    startLoading: (state) => {
      state.state = SessionStatus.PENDING;
    },
    logout: (state) => {
      state.state = SessionStatus.ANONYMOUS;
    },
    authError: (state, { payload }) => {
      state.error = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(codeCallback.pending, (state) => {
        state.state = SessionStatus.PENDING;
      })
      .addCase(codeCallback.rejected, (state, { payload }) => {
        state.state = SessionStatus.ANONYMOUS;
        state.error = payload as SerializedError;
        state.loading = false;
      })
      .addCase(login.pending, (state) => {
        state.error = undefined;
      })
      .addCase(login.fulfilled, (state) => {
        state.state = SessionStatus.AUTHORIZED;
        state.error = undefined;
        state.loginTimestamp = new Date().toISOString();
      })
      .addCase(login.rejected, (state, { payload }) => {
        state.state = SessionStatus.ANONYMOUS;
        state.error = payload as SerializedError;
      })
      .addCase(getNewToken.pending, (state) => {
        state.refreshTokenLoading = true;
      })
      .addCase(getNewToken.fulfilled, (state) => {
        state.refreshTokenLoading = false;
      })
      .addCase(getNewToken.rejected, (state, { payload }) => {
        state.refreshTokenLoading = false;
        state.error = payload as SerializedError;
        state.state = SessionStatus.ANONYMOUS;
      });
  },
});

export const { authorize, logout, startLoading, authError } = authSlice.actions;

export const selectIsRefreshTokenLoading = (state: { auth: AuthState }): boolean => state.auth.refreshTokenLoading;
export const selectLoginTimestamp = (state: { auth: AuthState }): string | undefined => state.auth.loginTimestamp;
export const selectIsUserInitialLogin = (state: { auth: AuthState }): boolean =>
  state.auth.loginTimestamp === undefined;
export const selectIsAuthenticated = (state: { auth: AuthState }): boolean => state.auth.state === 'authorized';
export const selectAuthIsPending = (state: { auth: AuthState }): boolean => state.auth.state === SessionStatus.PENDING;
export const selectError = (state: { auth: AuthState }) => state.auth.error;
export const selectRefreshError = (state: { auth: AuthState }) =>
  state.auth.error?.name === AuthTypeError.RefreshTokenFailed;

export default authSlice.reducer;
