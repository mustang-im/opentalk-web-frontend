// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import '@emotion/styled';
import { ThemeProvider } from '@mui/material';
import '@mui/material';
import { ftl2js } from '@opentalk/fluent_conv';
import { AuthProvider } from '@opentalk/redux-oidc';
import {
  DateTime,
  Email,
  EventId,
  EventType,
  InviteStatus,
  RoomId,
  UserId,
  TimelessEvent,
  RecurringEvent,
  SingleEvent,
  RoomInvite,
  BaseAsset,
  RecurrencePattern,
  InviteCode,
  AssetId,
  SipId,
} from '@opentalk/rest-api-rtk-query';
import {
  combineReducers,
  ConfigureStoreOptions,
  Store,
  createStore as createStoreTlk,
  configureStore as configureStoreTlk,
} from '@reduxjs/toolkit';
import { act, render as rtlRender, RenderOptions, RenderResult } from '@testing-library/react';
import fs from 'fs';
import i18n from 'i18next';
import { range } from 'lodash';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { createOpenTalkTheme } from '../assets/themes/opentalk';
import { SnackbarProvider } from '../commonComponents';
import { MediaProvider } from '../components/MediaProvider';
import { idFromDescriptor, MediaId, SubscriberStateChanged, SubscriberConfig } from '../modules/WebRTC';
import FullscreenProvider from '../provider/FullscreenProvider';
import { appReducers } from '../store';
import { AutomodState, SpeakerState } from '../store/slices/automodSlice';
import { Poll } from '../store/slices/pollSlice';
import {
  Participant,
  ProtocolAccess,
  WaitingState,
  MediaSessionType,
  ParticipantId,
  ParticipationKind,
  VideoSetting,
  AutomodSelectionStrategy,
  PollId,
  LegalVoteType,
  LegalVoteId,
} from '../types';

const automodState: AutomodState = {
  active: false,
  selectionStrategy: AutomodSelectionStrategy.Playlist,
  history: {
    ids: [],
    entities: {},
  },
  remaining: {
    ids: [],
    entities: {},
  },
  animationOnRandom: false,
  allowDoubleSelection: false,
  timeLimit: null,
  showList: false,
  speakerState: SpeakerState.Inactive,
  considerHandRaise: false,
};

export const loadLanguage = async (lng: string) => {
  const filename = 'public/locales/' + lng + '/k3k.ftl';
  await new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function (err?, data?) {
      if (err) {
        reject(err);
      }

      i18n.loadNamespaces('k3k', () => {
        const bundle = ftl2js(data ? data : '');
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

export const configureStore = (options?: ConfigureStoreOptions['preloadedState'] | undefined) => {
  const store = configureStoreTlk({
    reducer: combineReducers({ ...appReducers }),
    preloadedState: options?.initialState && { ...options.initialState },
  });

  return { store };
};

export * from '@testing-library/react';

export const render = async (ui: React.ReactElement, store?: Store, options?: RenderOptions): Promise<RenderResult> => {
  function Wrapper({ children }: { children: React.ReactElement }): React.ReactElement {
    if (store === undefined) {
      return (
        <ThemeProvider theme={createOpenTalkTheme()}>
          <I18nextProvider i18n={i18n}>
            <FullscreenProvider>
              <SnackbarProvider>{children}</SnackbarProvider>
            </FullscreenProvider>
          </I18nextProvider>
        </ThemeProvider>
      );
    }
    return (
      <ThemeProvider theme={createOpenTalkTheme()}>
        <Provider store={store}>
          <MemoryRouter>
            <AuthProvider
              configuration={{
                authority: 'http://OP',
                clientId: 'Frontend',
                redirectUri: '/',
                baseUrl: '/',
                scope: 'void',
                signOutRedirectUri: '/',
              }}
            >
              <I18nextProvider i18n={i18n}>
                <FullscreenProvider>
                  <SnackbarProvider>
                    <MediaProvider>{children}</MediaProvider>
                  </SnackbarProvider>
                </FullscreenProvider>
              </I18nextProvider>
            </AuthProvider>
          </MemoryRouter>
        </Provider>
      </ThemeProvider>
    );
  }

  let result: RenderResult = {} as RenderResult;
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

export const mockStore = (
  participantCount: number,
  options?: {
    video?: boolean;
    screen?: boolean;
    sip?: boolean;
    raiseHands?: number;
    automodActive?: boolean;
    audio?: number;
  }
) => {
  const participantsIds = range(participantCount);
  const participants = participantsIds.map((index) => {
    const handIsUp = index < (options?.raiseHands || 0);
    const participant = {
      ...mockedParticipant(index, options?.sip ? ParticipationKind.Sip : undefined),
      handIsUp,
    };
    return participant;
  });

  const subscribers: Array<SubscriberConfig & SubscriberStateChanged> = [];
  if (options?.video) {
    participants.forEach(({ id }, index) => {
      const audio = index < (options?.audio || 0);
      subscribers.push({
        participantId: id,
        mediaType: MediaSessionType.Video,
        video: true,
        audio,
        subscriberState: { audioRunning: audio, videoRunning: true, connection: 'connected' },
        videoSettings: VideoSetting.High,
      });
    });
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
    automod: {
      ...automodState,
      active: options?.automodActive,
    },
  };

  return createStore({
    initialState,
  });
};

export const mockedParticipant = (index: number, kind: ParticipationKind = ParticipationKind.User): Participant => ({
  id: `00000000-e6b4-4759-00${index}` as ParticipantId,
  displayName: `Test User Randy Mock${index}`,
  handIsUp: false,
  handUpdatedAt: '2022-03-23T12:32:30Z',
  joinedAt: '2022-03-23T12:32:30Z',
  leftAt: null,
  breakoutRoomId: null,
  groups: [],
  participationKind: kind,
  lastActive: '2022-03-23T12:32:30Z',
  waitingState: WaitingState.Joined,
  protocolAccess: ProtocolAccess.None,
  isPresenter: false,
  isSpeaking: false,
  isRoomOwner: false,
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
  showMeetingDetails: false,
};

export const mockedExpiringDateRoomInvite: RoomInvite = {
  inviteCode: 'string' as InviteCode,
  created: '2019-08-24T14:15:22Z' as DateTime,
  createdBy: {
    id: '497f6eca-6276-4993-bfeb-53cbbbba6f08' as UserId,
    email: 'user@example.com' as Email,
    title: 'string',
    firstname: 'string',
    lastname: 'string',
    displayName: 'string',
    avatarUrl: 'string',
  },
  updated: '2022-04-06T13:57:38.793602Z' as DateTime,
  updatedBy: {
    id: '497f6eca-6276-4993-bfeb-53cbbbba6f08' as UserId,
    email: 'user@example.com' as Email,
    title: 'string',
    firstname: 'string',
    lastname: 'string',
    displayName: 'string',
    avatarUrl: 'string',
  },
  room: '2fa2a266-7d97-4147-8f17-1e57105c70ea',
  active: true,
  expiration: '2022-04-06T13:57:38.793602Z' as DateTime,
};

export const mockedPermanentRoomInvite: RoomInvite = { ...mockedExpiringDateRoomInvite, expiration: null };

export const mockedRecurringEvent: RecurringEvent = {
  id: 'db61b29b-b944-422d-b20f-6ed4158aad4d' as EventId,
  createdBy: {
    id: '7224df0f-7051-42ff-9bc9-b8c5a8b39bdb' as UserId,
    email: 't1@testing.opentalk.eu' as Email,
    title: '',
    firstname: 'Test1',
    lastname: 'T1',
    displayName: 'New',
    avatarUrl: 'https://seccdn.libravatar.org/avatar/99a8042a26cef654898731e93d003349',
  },
  createdAt: '2024-03-04T14:10:12.944521Z' as DateTime,
  updatedBy: {
    id: '7224df0f-7051-42ff-9bc9-b8c5a8b39bdb' as UserId,
    email: 't1@testing.opentalk.eu' as Email,
    title: '',
    firstname: 'Test1',
    lastname: 'T1',
    displayName: 'New',
    avatarUrl: 'https://seccdn.libravatar.org/avatar/99a8042a26cef654898731e93d003349',
  },
  updatedAt: '2024-03-04T14:10:12.944521Z' as DateTime,
  title: 'Recurring Meeting',
  description: 'Recurring Meeting for test data',
  room: {
    id: '47cc8df7-b48e-4a56-87f8-92164613f74c' as RoomId,
    waitingRoom: false,
    callIn: {
      tel: '+49 30 - 577 10 231 9901',
      id: '4082652646' as SipId,
      password: '0513013745',
    },
  },
  inviteesTruncated: true,
  invitees: [],
  isTimeIndependent: false,
  isAllDay: false,
  startsAt: {
    datetime: '2024-03-04T18:30:00Z',
    timezone: 'Europe/Berlin',
  },
  endsAt: {
    datetime: '2024-03-04T19:00:00Z',
    timezone: 'Europe/Berlin',
  },
  recurrencePattern: ['RRULE:FREQ=DAILY'] as Array<RecurrencePattern>,
  isAdhoc: false,
  type: EventType.Recurring,
  inviteStatus: InviteStatus.Accepted,
  isFavorite: false,
};
export const mockedSingleEvent: SingleEvent = {
  id: 'c08743df-6de1-4446-95e3-f158ebd81fa0' as EventId,
  createdBy: {
    id: '7224df0f-7051-42ff-9bc9-b8c5a8b39bdb' as UserId,
    email: 't1@testing.opentalk.eu' as Email,
    title: '',
    firstname: 'Test1',
    lastname: 'T1',
    displayName: 'New',
    avatarUrl: 'https://seccdn.libravatar.org/avatar/99a8042a26cef654898731e93d003349',
  },
  createdAt: '2024-03-04T14:30:21.438203Z' as DateTime,
  updatedBy: {
    id: '7224df0f-7051-42ff-9bc9-b8c5a8b39bdb' as UserId,
    email: 't1@testing.opentalk.eu' as Email,
    title: '',
    firstname: 'Test1',
    lastname: 'T1',
    displayName: 'New',
    avatarUrl: 'https://seccdn.libravatar.org/avatar/99a8042a26cef654898731e93d003349',
  },
  updatedAt: '2024-03-04T14:30:21.438203Z' as DateTime,
  title: 'Single Meeting',
  description: 'Single meeting for test data',
  room: {
    id: '2f60df9e-c34e-4cfd-9dc9-e7ebb297583b' as RoomId,
    waitingRoom: false,
    callIn: {
      tel: '+49 30 - 577 10 231 9901',
      id: '0940955973' as SipId,
      password: '2320845822',
    },
  },
  inviteesTruncated: true,
  invitees: [],
  isTimeIndependent: false,
  isAllDay: false,
  startsAt: {
    datetime: '2024-03-04T15:00:00Z',
    timezone: 'Europe/Berlin',
  },
  endsAt: {
    datetime: '2024-03-04T15:30:00Z',
    timezone: 'Europe/Berlin',
  },
  recurrencePattern: [],
  isAdhoc: false,
  type: EventType.Single,
  inviteStatus: InviteStatus.Accepted,
  isFavorite: false,
};

export const mockedRoomAssets: Array<BaseAsset> = [
  {
    id: '5091eba6-f5e2-48dc-b44b-3e6b690339eb' as AssetId,
    filename: 'recording.mkv',
    namespace: 'recording',
    createdAt: '2024-04-24T09:34:29.108740Z' as DateTime,
    kind: 'recording-render',
    size: 4297704,
  },
  {
    id: 'bde00435-61c0-4b8d-8889-ce0688000c9f' as AssetId,
    filename: 'vote_protocol_2023-04-12_11-18-02-UTC.pdf',
    namespace: 'legal_vote',
    createdAt: '2023-04-12T11:18:03.207053Z' as DateTime,
    kind: 'protocol_pdf',
    size: 500000,
  },
  {
    id: '988d6b02-6920-482a-9d99-edbba918b3c4' as AssetId,
    filename: 'vote_protocol_2023-04-19_13-53-24-UTC.pdf',
    namespace: 'legal_vote',
    createdAt: '2023-04-19T13:53:25.326494Z' as DateTime,
    kind: 'protocol_pdf',
    size: 0,
  },
];

type MockSubscriberState = {
  descriptor: string;
  participantId: ParticipantId;
  audioOn: boolean;
  videoOn: boolean;
};

export const mockSubscriberState = ({ descriptor, participantId, videoOn, audioOn }: MockSubscriberState) => ({
  ids: [descriptor],
  entities: {
    [descriptor]: {
      participantId,
      mediaType: MediaSessionType.Video,
      audio: audioOn,
      video: videoOn,
      subscriberState: {
        videoRunning: videoOn,
        audioRunning: audioOn,
        connection: 'connected',
      },
      limit: 2,
    },
  },
});

export const mockPoll: Poll = {
  id: 'fake-poll-id' as PollId,
  choices: [],
  duration: 60,
  live: false,
  results: [],
  startTime: new Date().toString(),
  state: 'active',
  topic: 'Fake poll',
  voted: false,
};

export const mockLegalVote: LegalVoteType = {
  id: 'fake-poll-id' as LegalVoteId,
  duration: 60,
  startTime: new Date().toString(),
  state: 'active',
  topic: 'This is a legal vote fake description',
  votes: {
    yes: 0,
    no: 0,
    abstain: 0,
  },
  allowedParticipants: ['8342a2bf-b63e-422f-9fb8-7409ef997606' as ParticipantId],
  autoClose: false,
  createPdf: false,
  enableAbstain: true,
  kind: 'roll_call',
  votedAt: null,
  name: 'Fake legal vote',
  localStartTime: new Date().toString(),
};
