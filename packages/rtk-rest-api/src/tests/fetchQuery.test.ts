// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createSlice } from '@reduxjs/toolkit';
import { createApi } from '@reduxjs/toolkit/query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import fetchQuery, { BaseQueryApi, stripUndefinedHeaderValues } from '../fetchQuery';
import { setupApiStore } from './helpers';
import { baseQueryHandlers } from './mocks/server';

const server = setupServer(...baseQueryHandlers);

const defaultHeaders: Record<string, string> = {
  fake: 'header',
  delete: 'true',
  delete2: '1',
};
const baseUrl = 'http://example.com';

const baseQuery = fetchQuery({
  baseUrl,
  fetchFn: (x) => fetch(x),
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;

    // If we have a token set in state, let's assume that we should be passing it.
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    // A user could customize their behavior here, so we'll just test that custom scenarios would work.
    const potentiallyConflictingKeys = Object.keys(defaultHeaders);
    potentiallyConflictingKeys.forEach((key) => {
      // Check for presence of a default key, if the incoming endpoint headers don't specify it as '', then set it
      const existingValue = headers.get(key);
      if (!existingValue && existingValue !== '') {
        headers.set(key, String(defaultHeaders[key]));
        // If an endpoint sets a header with a value of '', just delete the header.
      } else if (headers.get(key) === '') {
        headers.delete(key);
      }
    });

    return headers;
  },
});
const api = createApi({
  baseQuery,
  endpoints(build) {
    return {
      query: build.query({ query: () => ({ url: '/echo', headers: {} }) }),
      mutation: build.mutation({
        query: () => ({ url: '/echo', method: 'POST', credentials: 'omit' }),
      }),
    };
  },
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: '',
  },
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
    },
  },
});

const storeRef = setupApiStore(api, { auth: authSlice.reducer });
type RootState = ReturnType<typeof storeRef.store.getState>;
let commonBaseQueryApi: BaseQueryApi;
beforeEach(() => {
  commonBaseQueryApi = {
    signal: new AbortController().signal,
    dispatch: storeRef.store.dispatch,
    getState: storeRef.store.getState,
    extra: undefined,
    type: 'query',
    endpoint: 'doesntmatterhere',
  };
});

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('fetchQuery', () => {
  describe('stripUndefined', () => {
    it('Headers', () => {
      const test = stripUndefinedHeaderValues(new Headers({}));
      expect(test).toBeInstanceOf(Headers);
    });
    it('Array', () => {
      const test = stripUndefinedHeaderValues([['Set', 'd'], ['Unset']]);
      expect(test).toEqual([['Set', 'd']]);
    });
    it('Object', () => {
      const test = stripUndefinedHeaderValues({ Set: 'd', Unset: undefined });
      expect(test).toEqual({ Set: 'd' });
    });
  });

  describe('basic additional functionality', () => {
    it('camelCase keys in json responses', async () => {
      server.use(
        rest.get('http://example.com/success', (_, res, ctx) =>
          res.once(
            ctx.json({
              snake_case: 'snake_case',
              camelCase: 'camelCase',
              UpperCamelCase: 'UpperCamelCase',
              'kebab-case': 'kebab-case',
            })
          )
        )
      );
      const req = baseQuery('/success', commonBaseQueryApi, {});
      expect(req).toBeInstanceOf(Promise);
      const res = await req;
      expect(res).toBeInstanceOf(Object);
      expect(res.data).toEqual({
        camelCase: 'camelCase',
        snakeCase: 'snake_case',
        kebabCase: 'kebab-case',
        upperCamelCase: 'UpperCamelCase',
      });
    });

    it('does not camelCase text responses', async () => {
      server.use(rest.get('http://example.com/success', (_, res, ctx) => res.once(ctx.text('hallo'))));
      const req = baseQuery({ url: '/success', responseHandler: 'text' }, commonBaseQueryApi, {});
      expect(req).toBeInstanceOf(Promise);
      const res = await req;
      expect(res).toBeInstanceOf(Object);

      expect(res.data).toEqual('hallo');
    });

    it('serializes parameters as snakeCase', async () => {
      let receivedParams;

      server.use(
        rest.get('http://example.com/params', (req, res, ctx) => {
          // Collect the searchParams into a KV Object
          receivedParams = Array.from(req.url.searchParams.entries(), ([x, y]) => ({
            [x]: y,
          }));
          return res.once(ctx.json(receivedParams));
        })
      );
      const req = baseQuery({ url: '/params', params: { perPage: 30 } }, commonBaseQueryApi, {});

      expect(req).toBeInstanceOf(Promise);
      const res = await req;
      expect(res).toBeInstanceOf(Object);
      expect(receivedParams).toEqual([{ per_page: '30' }]);
    });
  });
});
