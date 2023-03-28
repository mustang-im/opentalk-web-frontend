// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionType, VideoSetting } from '@opentalk/common';
import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { RootState } from '..';
import { media } from '../../api/types/incoming';
import {
  MediaDescriptor,
  SubscriberConfig,
  idFromDescriptor,
  SubscriberStateChanged,
  QualityLimit,
} from '../../modules/WebRTC';
import { SubscriberState } from '../../modules/WebRTC/SubscriberConnection';

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
      mediaSubscriberAdapter.removeOne(state, idFromDescriptor(payload));
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

export const actions = mediaSubscriberSlice.actions;

export default mediaSubscriberSlice.reducer;
