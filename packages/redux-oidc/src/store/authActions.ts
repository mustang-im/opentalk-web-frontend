import { createAsyncThunk } from '@reduxjs/toolkit';
import convertToCamelCase from 'camelcase-keys';
import convertToSnakeCase from 'snakecase-keys';

import { AuthTypeError, generateSerilizadError, storeToken } from '../utils';

export interface LoginProps {
  idToken: string;
  baseUrl: string;
}

export interface CodeCallBackProps {
  clientId: string;
  redirectUri: string;
  code: string;
  tokenEndpoint: string;
  baseUrl?: string;
}

/**
 * Final Auth steps
 * Once we have all tokens we need to login the user to the controller
 */
export const login = createAsyncThunk('user/login', async (payload: LoginProps, { rejectWithValue }) => {
  try {
    const response = await fetch(new URL('v1/auth/login', payload.baseUrl).toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(convertToSnakeCase({ idToken: payload.idToken })),
    });
    if (!response.ok) {
      return rejectWithValue(
        generateSerilizadError({
          name: AuthTypeError.LoginUserFailed,
          message: response.statusText,
          status: response.status,
        })
      );
    }
    return convertToCamelCase(await response.json(), { deep: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      // Unexpected token < in JSON
      console.debug('There was a SyntaxError', error);
      throw new Error(String(error));
    }
    return rejectWithValue(
      generateSerilizadError({ name: AuthTypeError.LoginUserFailed, message: error, status: 503 })
    );
  }
});

export const codeCallback = createAsyncThunk(
  'auth/code_callback',
  async (payload: CodeCallBackProps, { rejectWithValue, dispatch }) => {
    try {
      const response = await fetch(payload.tokenEndpoint, {
        method: 'POST',
        body: new URLSearchParams(
          convertToSnakeCase({
            grantType: 'authorization_code',
            clientId: payload.clientId,
            redirectUri: payload.redirectUri,
            code: payload.code,
          })
        ),
      });

      if (!response.ok) {
        return rejectWithValue(
          generateSerilizadError({
            name: AuthTypeError.CodeCallbackFailed,
            message: response.statusText,
            status: response.status,
          })
        );
      }

      const data = convertToCamelCase(await response.json(), { deep: true });
      storeToken(data);
      if (payload.baseUrl) {
        await dispatch(login({ idToken: data.idToken, baseUrl: payload.baseUrl }));
      }
      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.debug('There was a SyntaxError', error);
        throw new Error(String(error));
      }
      return rejectWithValue(
        generateSerilizadError({
          name: AuthTypeError.CodeCallbackFailed,
          message: 'Unable to fetch code callback api',
          status: 503,
        })
      );
    }
  }
);

interface RefreshTokenInterface {
  clientId: string;
  tokenEndpoint: string;
  baseUrl?: string;
}
export const getNewToken = createAsyncThunk(
  'auth/get_new_token',
  async (payload: RefreshTokenInterface, { rejectWithValue, dispatch }) => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.debug('No refresh token found');
      return rejectWithValue(
        generateSerilizadError({
          name: AuthTypeError.RefreshTokenFailed,
          message: 'Refresh token not present',
          status: 503,
        })
      );
    }
    try {
      const response = await fetch(payload.tokenEndpoint, {
        body: new URLSearchParams(
          convertToSnakeCase({
            grantType: 'refresh_token',
            clientId: payload.clientId,
            refreshToken: refreshToken,
          })
        ),
        method: 'POST',
      });
      if (!response.ok) {
        return rejectWithValue(
          generateSerilizadError({
            name: AuthTypeError.RefreshTokenFailed,
            message: response.statusText,
            status: response.status,
          })
        );
      }
      const data = convertToCamelCase(await response.json(), { deep: true });
      storeToken(data);
      if (payload.baseUrl) {
        dispatch(login({ idToken: data.idToken, baseUrl: payload.baseUrl }));
      }
      return data;
    } catch (error) {
      if (error instanceof SyntaxError) {
        // Unexpected token < in JSON
        console.debug('There was a SyntaxError', error);
        throw new Error(String(error));
      }
      return rejectWithValue(
        generateSerilizadError({
          name: AuthTypeError.RefreshTokenFailed,
          message: 'Refresh token not present',
          status: 503,
        })
      );
    }
  }
);
