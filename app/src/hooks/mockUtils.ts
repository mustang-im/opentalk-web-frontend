// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useEffect } from 'react';
import { v4 } from 'uuid';

import store from '../store';
import { updated as subscriberUpdate } from '../store/slices/mediaSubscriberSlice';
import { join } from '../store/slices/participantsSlice';
import {
  GroupId,
  MediaSessionType,
  ParticipantId,
  ParticipationKind,
  VideoSetting,
  MeetingNotesAccess,
  WaitingState,
} from '../types';
import { getRandomNumber } from '../utils/numberUtils';

export const useMockUsers = (users: number) => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      Array(users)
        .fill(null)
        .forEach(() => {
          const id = v4() as ParticipantId;
          store.dispatch(
            join({
              participant: {
                id,
                groups: ['Gruppe1' as GroupId],
                displayName: `Randy Mock with a real long name ${getRandomNumber(1000)}`,
                handIsUp: false,
                joinedAt: new Date().toISOString(),
                leftAt: null,
                handUpdatedAt: '',
                breakoutRoomId: null,
                participationKind: ParticipationKind.User,
                lastActive: new Date().toISOString(),
                meetingNotesAccess: MeetingNotesAccess.None,
                isPresenter: false,
                waitingState: WaitingState.Joined,
                isSpeaking: false,
                isRoomOwner: false,
              },
            })
          );
          store.dispatch(
            subscriberUpdate({
              participantId: id,
              audio: false,
              video: false,
              videoSettings: VideoSetting.Low,
              mediaType: MediaSessionType.Video,
            })
          );
        });
    }
  }, [users]);
};
