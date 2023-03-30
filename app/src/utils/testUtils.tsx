// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import DateFnsUtils from '@date-io/date-fns';
import '@emotion/styled';
import { LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { ThemeProvider } from '@mui/material';
import '@mui/material';
import '@mui/styles';
import { MediaSessionType, ParticipantId, ParticipationKind, VideoSetting } from '@opentalk/common';
import { SnackbarUtilsConfigurator } from '@opentalk/common';
import { ftl2js } from '@opentalk/fluent_conv';
import { SnackbarProvider } from '@opentalk/notistack';
import { AuthProvider } from '@opentalk/react-redux-appauth';
import {
  DateTime,
  Email,
  EventId,
  EventType,
  InviteStatus,
  RoomId,
  UserId,
  TimelessEvent,
} from '@opentalk/rest-api-rtk-query';
import { combineReducers, ConfigureStoreOptions, Store } from '@reduxjs/toolkit';
import { act, render as rtlRender, RenderOptions } from '@testing-library/react';
import fs from 'fs';
import i18n from 'i18next';
import { range } from 'lodash';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore as createStoreTlk } from 'redux';
import { v4 as uuidv4 } from 'uuid';

import { createOpenTalkTheme } from '../assets/themes/opentalk';
import { MediaProvider } from '../components/MediaProvider';
import { idFromDescriptor, MediaId, SubscriberStateChanged, SubscriberConfig } from '../modules/WebRTC';
import FullscreenProvider from '../provider/FullscreenProvider';
import { appReducers } from '../store';
import { Participant, ProtocolAccess, WaitingState } from '../store/slices/participantsSlice';

export const loadLanguage = async (lng: string) => {
  const filename = 'public/locales/' + lng + '/k3k.ftl';
  await new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err?, data?) {
      if (err) {
        reject(err);
      }

      i18n.loadNamespaces('k3k', () => {
        const bundle = ftl2js(data);
        i18n.addResourceBundle(lng, 'k3k', bundle);
        resolve(data);
      });
    });
  });
};

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',
  resources: { en: { translations: {} } },
});

export const createStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) => {
  const store = createStoreTlk(
    combineReducers({ ...appReducers }),
    options?.initialState && { ...options.initialState }
  );

  const dispatch = jest.fn(store.dispatch);
  store.dispatch = dispatch;

  return { store, dispatch };
};

export * from '@testing-library/react';

export const render = async (ui: React.ReactElement, store?: Store, options?: RenderOptions) => {
  function Wrapper({ children }: { children: React.ReactElement }): React.ReactElement {
    if (store === undefined) {
      return (
        <LocalizationProvider dateAdapter={AdapterDateFns} utils={DateFnsUtils}>
          <ThemeProvider theme={createOpenTalkTheme()}>
            <I18nextProvider i18n={i18n}>
              <SnackbarProvider
                maxSnack={3}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <SnackbarUtilsConfigurator />
                {children}
              </SnackbarProvider>
            </I18nextProvider>
          </ThemeProvider>
        </LocalizationProvider>
      );
    }
    return (
      <ThemeProvider theme={createOpenTalkTheme()}>
        <Provider store={store}>
          <MemoryRouter>
            <LocalizationProvider dateAdapter={AdapterDateFns} utils={DateFnsUtils}>
              <AuthProvider
                store={store}
                authority="http://OP"
                clientId="Frontend"
                redirectUri="http://void"
                signOutRedirectUri="http://void"
                scope="void"
              >
                <I18nextProvider i18n={i18n}>
                  <SnackbarProvider
                    maxSnack={3}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <SnackbarUtilsConfigurator />
                    <MediaProvider>
                      <FullscreenProvider>{children}</FullscreenProvider>
                    </MediaProvider>
                  </SnackbarProvider>
                </I18nextProvider>
              </AuthProvider>
            </LocalizationProvider>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );
  }
  let result;
  await act(async () => {
    result = await rtlRender(ui, { wrapper: Wrapper, ...options });
  });
  return result;
};

export const jwtVariables = {
  NAME: 'Jürgen Tests',
  TOKEN:
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiSsO8cmdlbiBUZXN0cyJ9.t9f4AJVApbVfSWUJetD7qAOF-UQvebb3eVuDtE8RmHY',
};

/*
  const mockStore
  create participants and use them to create a redux store for testing.

  @params participantCount: number of mocked participants
  @returns mocked redux store for testing
*/

export const mockStore = (participantCount: number, options?: { video?: boolean; screen?: boolean }) => {
  const participantsIds = range(participantCount);
  const participants = participantsIds.map((index) => mockedParticipant(index));

  const subscribers: Array<SubscriberConfig & SubscriberStateChanged> = [];
  if (options?.video) {
    participants.forEach(({ id }) =>
      subscribers.push({
        participantId: id,
        mediaType: MediaSessionType.Video,
        video: true,
        audio: true,
        subscriberState: { audioRunning: true, videoRunning: true, connection: 'connected' },
        videoSettings: VideoSetting.High,
      })
    );
  }

  if (options?.screen) {
    participants.forEach(({ id }) =>
      subscribers.push({
        participantId: id,
        mediaType: MediaSessionType.Screen,
        video: true,
        audio: false,
        subscriberState: { audioRunning: false, videoRunning: true, connection: 'connected' },
        videoSettings: VideoSetting.High,
      })
    );
  }

  const initialState = {
    participants: {
      ids: participants.map((p) => p.id),
      entities: participants.reduce((entities: Record<ParticipantId, Participant>, participant) => {
        entities[participant.id] = participant;
        return entities;
      }, {}),
    },
    subscribers: {
      ids: subscribers.map(idFromDescriptor),
      entities: subscribers.reduce(
        (entities: Record<MediaId, SubscriberConfig & SubscriberStateChanged>, subscriber) => {
          entities[idFromDescriptor(subscriber)] = subscriber;
          return entities;
        },
        {}
      ),
    },
  };

  return createStore({
    initialState,
  });
};

export const mockedParticipant = (index: number): Participant => ({
  id: `00000000-e6b4-4759-00${index}` as ParticipantId,
  displayName: `Test User Randy Mock${index}`,
  handIsUp: false,
  handUpdatedAt: '2022-03-23T12:32:30Z',
  joinedAt: '2022-03-23T12:32:30Z',
  leftAt: null,
  breakoutRoomId: null,
  groups: [],
  participationKind: ParticipationKind.User,
  lastActive: '2022-03-23T12:32:30Z',
  waitingState: WaitingState.Joined,
  protocolAccess: ProtocolAccess.None,
  isPresenter: false,
});

export const mockedVideoMediaDescriptor = (index: number) => ({
  participantId: mockedParticipant(index).id,
  mediaType: MediaSessionType.Video,
});

export const mockedScreenMediaDescriptor = (index: number) => ({
  participantId: mockedParticipant(index).id,
  mediaType: MediaSessionType.Screen,
});

export const eventMockedData: TimelessEvent = {
  id: uuidv4() as EventId,
  createdAt: '2022-04-06T13:57:38.793602Z' as DateTime,
  inviteStatus: InviteStatus.Accepted,
  isTimeIndependent: true,
  isFavorite: true,
  createdBy: {
    displayName: 'Test User',
    email: 'test@heinlein-video.de' as Email,
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    lastname: 'LastTest',
    title: '',
  },
  title: 'Here is a very long test title for the event',
  description: 'Here is a description for the event',
  room: {
    id: uuidv4() as RoomId,
    waitingRoom: false,
  },
  recurrencePattern: ['DUMMY'],
  type: EventType.Single,
  updatedBy: {
    displayName: 'Test User',
    email: 'test@heinlein-video.de' as Email,
    firstname: 'FirstTest',
    id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    lastname: 'LastTest',
    title: '',
  },
  updatedAt: '2022-04-06T13:57:38.793602Z' as DateTime,
  isAdhoc: false,
};
