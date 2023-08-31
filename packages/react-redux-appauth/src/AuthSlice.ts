import { UnixTimeStamp } from './util';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';

// Define a type for the slice state
export interface AuthSlice {
  isLoading: boolean;
  isAuthed: boolean;
  isExpired: boolean;
  access_token?: string;
  // In
  access_token_expire?: UnixTimeStamp;
  id_token?: string;
  refresh_token?: string;
  refresh_token_expire?: UnixTimeStamp;
  scope?: string;
  sess_state?: string;
  authError: Error | undefined;
}

export interface IResponse {
  access_token: string;
  access_token_expire: UnixTimeStamp;
  id_token: string;
  refresh_token: string;
  refresh_token_expire: UnixTimeStamp;
  scope: string;
  session_id: string;
}

// Define the initial state using that type
const generateInitialState = (): AuthSlice => {
  return {
    isLoading: false,
    isAuthed: false,
    id_token: undefined,
    isExpired: false,
    authError: undefined,
  };
};

const initialState = generateInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    expired: (state) => {
      state.isAuthed = false;
      state.isExpired = true;
    },
    loading: (state) => {
      state.isLoading = true;
    },
    auth_error: (state, action: PayloadAction<Error>) => {
      state.isAuthed = false;
      state.authError = action.payload;
    },
    loaded: (state) => {
      state.isLoading = false;
    },
    logged_out: () => {
      // TODO unused - never read:
      //localStorage.removeItem('auth');
      localStorage.removeItem('access_token');
      return generateInitialState();
    },
    token_updated: (state, action: PayloadAction<IResponse>) => {
      _.merge(state, action.payload);
      state.isAuthed = true;
      state.isLoading = false;
      state.authError = undefined;
      // TODO unused - never read:
      //localStorage.setItem('auth', JSON.stringify(action.payload));
      localStorage.setItem('access_token', action.payload.access_token);
    },
  },
});

export const {
  expired,
  logged_out,
  token_updated,
  loaded,
  loading,
  auth_error,
} = authSlice.actions;

// Todo find better way to type this
export const selectIsLoading = (state: { auth: AuthSlice }): boolean =>
  state.auth.isLoading;
export const selectIsAuthed = (state: { auth: AuthSlice }): boolean =>
  state.auth.isAuthed;
export const selectAccessToken = (state: {
  auth: AuthSlice;
}): string | undefined => state.auth.access_token;
export const selectIdToken = (state: { auth: AuthSlice }): string | undefined =>
  state.auth.id_token;
export const selectRefreshToken = (state: {
  auth: AuthSlice;
}): string | undefined => state.auth.refresh_token;
export const selectAccessTokenExpire = (state: {
  auth: AuthSlice;
}): UnixTimeStamp | undefined => state.auth.access_token_expire;
export const selectRefreshTokenExpire = (state: {
  auth: AuthSlice;
}): UnixTimeStamp | undefined => state.auth.refresh_token_expire;
export const selectAuthError = (state: {
  auth: AuthSlice;
}): Error | undefined => state.auth.authError;

export default authSlice.reducer;
