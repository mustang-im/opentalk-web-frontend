// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionType, VideoSetting } from '@opentalk/common';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';
import { media } from '../../api/types/incoming';
import {
  idFromDescriptor,
  MediaDescriptor,
  QualityLimit,
  SubscriberConfig,
  SubscriberStateChanged,
} from '../../modules/WebRTC';
import { SubscriberState } from '../../modules/WebRTC/SubscriberConnection';
import { hangUp } from '../commonActions';
import { leave } from './participantsSlice';

interface State extends SubscriberConfig {
  subscriberState: SubscriberState;
  limit: VideoSetting;
  error?: media.MediaError;
}

export const mediaSubscriberAdapter = createEntityAdapter<State>({
  selectId: idFromDescriptor,
});

export const mediaSubscriberSlice = createSlice({
  name: 'subscribers',
  initialState: mediaSubscriberAdapter.getInitialState(),
  reducers: {
    added: (state, { payload }: PayloadAction<SubscriberConfig>) => {
      mediaSubscriberAdapter.addOne(state, {
        ...payload,
        subscriberState: { audioRunning: false, videoRunning: false, connection: 'new' },
        limit: VideoSetting.High,
      });
    },
    updated: (state, { payload }: PayloadAction<SubscriberConfig>) => {
      const { video, videoSettings, audio } = payload;
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: { video, videoSettings, audio },
      });
    },
    failed: (state, { payload }: PayloadAction<media.MediaError>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: payload.source,
        changes: {
          error: payload,
          subscriberState: { audioRunning: false, videoRunning: false, connection: 'failed' },
        },
      });
    },
    closed: (state, { payload }: PayloadAction<MediaDescriptor>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: {
          subscriberState: { audioRunning: false, videoRunning: false, connection: 'closed' },
          limit: VideoSetting.High,
        },
      });
    },
    mediaUpdated: (state, { payload }: PayloadAction<SubscriberStateChanged>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: { subscriberState: payload.subscriberState },
      });
    },
    limit: (state, { payload }: PayloadAction<QualityLimit>) => {
      mediaSubscriberAdapter.updateOne(state, {
        id: idFromDescriptor(payload),
        changes: { limit: payload.limit },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(leave, (state, { payload: { id } }) => {
      mediaSubscriberAdapter.removeMany(state, [
        idFromDescriptor({ participantId: id, mediaType: MediaSessionType.Screen }),
        idFromDescriptor({ participantId: id, mediaType: MediaSessionType.Video }),
      ]);
    });
    builder.addCase(hangUp.pending, (state) => {
      mediaSubscriberAdapter.removeAll(state);
    });
  },
});

export const { updated, mediaUpdated, closed, added, limit, failed } = mediaSubscriberSlice.actions;

export const mediaSubscribersSelectors = mediaSubscriberAdapter.getSelectors<RootState>((state) => state.subscribers);
export const selectUnmutedSubscribers = (state: RootState) =>
  mediaSubscribersSelectors
    .selectAll(state)
    .filter(({ audio, mediaType }) => audio && mediaType === MediaSessionType.Video);
export const selectAllSubscribers = (state: RootState) => mediaSubscribersSelectors.selectAll(state);
export const selectSubscriberById = (descriptor: MediaDescriptor) => (state: RootState) =>
  mediaSubscribersSelectors.selectById(state, idFromDescriptor(descriptor));

export const selectIsSubscriberOnlineByDescriptor = (descriptor: MediaDescriptor) => (state: RootState) => {
  const subscriber = mediaSubscribersSelectors.selectById(state, idFromDescriptor(descriptor));
  const mediaConnectionState = subscriber?.subscriberState?.connection;
  return mediaConnectionState !== undefined && mediaConnectionState !== 'new' && mediaConnectionState !== 'closed';
};

export const actions = mediaSubscriberSlice.actions;

export default mediaSubscriberSlice.reducer;
