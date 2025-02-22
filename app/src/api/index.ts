// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { login } from '@opentalk/redux-oidc';
import { Namespaces, StreamingKind, StreamingStatus } from '@opentalk/rest-api-rtk-query';
import { Middleware, AnyAction, freeze } from '@reduxjs/toolkit';
import i18next from 'i18next';

import {
  notificationAction,
  notifications,
  createStackedMessages,
  setLibravatarOptions,
  notificationPersistent,
  startTimeLimitNotification,
  showConsentNotification,
} from '../commonComponents';
import { createStreamUpdatedNotification } from '../components/StreamUpdatedNotification/StreamUpdatedNotification';
import LayoutOptions from '../enums/LayoutOptions';
import i18n from '../i18n';
import localMediaContext from '../modules/Media/LocalMedia';
import localScreenContext from '../modules/Media/LocalScreen';
import {
  ConferenceRoom,
  getCurrentConferenceRoom,
  MediaDescriptor,
  MediaId,
  QualityLimit,
  shutdownConferenceContext,
  SubscriberStateChanged,
  SubscriberConfig,
  WebRtc,
} from '../modules/WebRTC';
import { StatsEvent } from '../modules/WebRTC/Statistics/ConnectionStats';
import { AppDispatch, RootState } from '../store';
import { hangUp, joinSuccess, startRoom } from '../store/commonActions';
import {
  started as automodStarted,
  stopped as automodStopped,
  remainingUpdated as automodRemainingUpdated,
  setAsInactiveSpeaker,
  setAsActiveSpeaker,
  speakerUpdated as automodSpeakerUpdated,
} from '../store/slices/automodSlice';
import * as breakoutStore from '../store/slices/breakoutSlice';
import { clearGlobalChat, received as chatReceived, setChatSettings } from '../store/slices/chatSlice';
import { selectLibravatarDefaultImage } from '../store/slices/configSlice';
import { statsUpdated as subscriberStatsUpdate } from '../store/slices/connectionStatsSlice';
import {
  started as legalVoteStarted,
  stopped as legalVoteStopped,
  updated as legalVoteUpdated,
  canceled as legalVoteCanceled,
  voted as legalVoteVoted,
  initialized as legalVoteInitialized,
} from '../store/slices/legalVoteSlice';
import * as mediaStore from '../store/slices/mediaSlice';
import { setUpstreamLimit } from '../store/slices/mediaSlice';
import {
  closed as subscriberClosed,
  removed as subscriberRemoved,
  failed as subscriberFailed,
  limit as subscriberLimit,
  mediaUpdated as subscriberMediaUpdated,
  updated as subscriberUpdate,
} from '../store/slices/mediaSubscriberSlice';
import { setMeetingNotesReadUrl, setMeetingNotesWriteUrl } from '../store/slices/meetingNotesSlice';
import {
  forceLowerHand,
  disableRaisedHands,
  enableRaisedHands,
  loweredHand,
  raisedHand,
  forceMuteDisabled,
  forceMuteEnabled,
} from '../store/slices/moderationSlice';
import {
  breakoutJoined,
  breakoutLeft,
  join as participantsJoin,
  leave as participantsLeft,
  update as participantsUpdate,
  waitingRoomJoined,
  waitingRoomLeft,
  selectParticipantsTotal,
  updatedSpeaker,
} from '../store/slices/participantsSlice';
import * as pollStore from '../store/slices/pollSlice';
import {
  enteredWaitingRoom,
  readyToEnter,
  enableWaitingRoom,
  disableWaitingRoom,
  connectionClosed,
  selectParticipantLimit,
  joinBlocked,
} from '../store/slices/roomSlice';
import { sharedFolderUpdated } from '../store/slices/sharedFolderSlice';
import { streamUpdated } from '../store/slices/streamingSlice';
import { updateParticipantsReady, timerStarted, timerStopped } from '../store/slices/timerSlice';
import { updatedCinemaLayout } from '../store/slices/uiSlice';
import { revokePresenterRole, setPresenterRole, updateRole, selectIsModerator } from '../store/slices/userSlice';
import { addWhiteboardAsset, setWhiteboardAvailable } from '../store/slices/whiteboardSlice';
import {
  BackendParticipant,
  BreakoutRoomId,
  GroupId,
  Namespaced,
  Timestamp,
  VideoSetting,
  matchBuilder,
  MeetingNotesState,
  ChatMessage,
  Participant,
  MeetingNotesAccess,
  WaitingState,
  ParticipantInOtherRoom,
  InitialChatHistory,
  ChatScope,
  AutomodSelectionStrategy,
  ParticipantId,
  Speaker,
  ForceMuteType,
} from '../types';
import { initSentryReportWithUser } from '../utils/glitchtipUtils';
import { restApi } from './rest';
import {
  breakout,
  control,
  media,
  Message as IncomingMessage,
  moderation,
  poll,
  meetingNotes,
  whiteboard,
  chat,
  timer,
  streaming,
  sharedFolder,
} from './types/incoming';
import { AutomodEventType } from './types/incoming/automod';
import { Role } from './types/incoming/control';
import { LegalVoteMessageType } from './types/incoming/legalVote';
import { Action as OutgoingActionType, automod } from './types/outgoing';
import * as outgoing from './types/outgoing';
import { ClearGlobalMessages } from './types/outgoing/chat';

/**
 * Transforms the dictionary of group chat histories into a list of groupIds and a flat list
 * chat messages with scope 'group'.
 * @param chatHistory
 * @returns {groupIds: Array<GroupId>, messages:Array<ChatMessage>}
 */

const transformChatHistory = (
  chatHistory: InitialChatHistory
): { groupIds: Array<GroupId>; messages: Array<ChatMessage> } => {
  if (Array.isArray(chatHistory) === false) {
    return { groupIds: [], messages: [] };
  }
  const groupIds: GroupId[] = chatHistory.map((e) => e.name);

  const messages = chatHistory.flatMap((e) => {
    return e.history.map(
      (m): ChatMessage => ({
        ...m,
        group: e.name,
        scope: ChatScope.Group,
      })
    );
  });

  return { groupIds, messages };
};

const mapMeetingNotesToMeetingNotesAccess = (meetingNotes?: MeetingNotesState) => {
  if (!meetingNotes) {
    return MeetingNotesAccess.None;
  }
  if (meetingNotes.readonly) {
    return MeetingNotesAccess.Read;
  }
  return MeetingNotesAccess.Write;
};

const isParticipantSpeaking = (speakers: Speaker[], participantId: ParticipantId) => {
  let isSpeaking = false;
  const speakerWithSameId = speakers.find((speaker) => participantId === speaker.participant);
  if (speakerWithSameId?.isSpeaking) {
    isSpeaking = true;
  }
  return isSpeaking;
};

const mapToUiParticipant = (
  state: RootState,
  { id, control, media, meetingNotes }: BackendParticipant,
  breakoutRoomId: BreakoutRoomId | null,
  waitingState: WaitingState,
  speakers?: Speaker[]
): Participant => ({
  id,
  groups: [],
  displayName: control.displayName,
  avatarUrl: setLibravatarOptions(control.avatarUrl, { defaultImage: selectLibravatarDefaultImage(state) }),
  handIsUp: control.handIsUp,
  joinedAt: control.joinedAt,
  leftAt: control.leftAt,
  handUpdatedAt: control.handUpdatedAt,
  breakoutRoomId: breakoutRoomId,
  participationKind: control.participationKind,
  lastActive: control.joinedAt,
  role: control.role,
  waitingState,
  meetingNotesAccess: mapMeetingNotesToMeetingNotesAccess(meetingNotes),
  isPresenter: Boolean(media?.isPresenter),
  isSpeaking: speakers ? isParticipantSpeaking(speakers, id) : false,
  isRoomOwner: control.isRoomOwner,
});

const mapBreakoutToUiParticipant = (
  state: RootState,
  { breakoutRoom, id, displayName, avatarUrl, participationKind, leftAt }: ParticipantInOtherRoom,
  joinTime: string
): Participant => ({
  id,
  groups: [],
  displayName,
  avatarUrl: setLibravatarOptions(avatarUrl, { defaultImage: selectLibravatarDefaultImage(state) }),
  handIsUp: false,
  joinedAt: joinTime,
  leftAt: leftAt,
  handUpdatedAt: undefined,
  breakoutRoomId: breakoutRoom,
  participationKind,
  lastActive: joinTime,
  waitingState: WaitingState.Joined,
  meetingNotesAccess: MeetingNotesAccess.None,
  isPresenter: false,
  isSpeaking: false,
  isRoomOwner: false,
});

const listenWebRtc = (webRtc: WebRtc, dispatch: AppDispatch) => {
  const updateHandler = (config: SubscriberConfig) => dispatch(subscriberUpdate(config));
  const statsHandler = (connectionStats: Record<MediaId, StatsEvent>) =>
    dispatch(subscriberStatsUpdate(connectionStats));
  const closeHandler = (mediaDescriptor: MediaDescriptor) => dispatch(subscriberClosed(mediaDescriptor));
  const removeHandler = (mediaDescriptor: MediaDescriptor) => dispatch(subscriberRemoved(mediaDescriptor));
  const mediaChangeHandler = (mediaChange: SubscriberStateChanged) => dispatch(subscriberMediaUpdated(mediaChange));
  const upstreamLimitHandler = (limit: VideoSetting) => dispatch(setUpstreamLimit(limit));
  const subscriberLimitHandler = (limit: QualityLimit) => dispatch(subscriberLimit(limit));

  webRtc.addEventListener('removed', removeHandler);
  webRtc.addEventListener('subscriberchanged', updateHandler);
  webRtc.addEventListener('statsupdated', statsHandler);
  webRtc.addEventListener('subscriberclosed', closeHandler);
  webRtc.addEventListener('subscriberstatechanged', mediaChangeHandler);
  webRtc.addEventListener('upstreamLimit', upstreamLimitHandler);
  webRtc.addEventListener('subscriberLimit', subscriberLimitHandler);
};

export const sendMessage = (message: Namespaced<OutgoingActionType | ClearGlobalMessages, Namespaces>) => {
  const conferenceContext = getCurrentConferenceRoom();
  if (conferenceContext === undefined) {
    throw new Error('can not send message to conferenceContext');
  }
  conferenceContext.sendMessage(message as outgoing.Message /*TODO remove conversion*/);
};

const dispatchError = (message: string) => {
  switch (message) {
    case 'vote-already_active':
      notifications.error(i18next.t('legal-vote-active-error'));
      break;
    default:
      notifications.error(message);
  }
};

/**
 * Started talking stick notification ID, reused accross different
 * event handlers.
 */
const startedId = 'handleAutomodMessage-started-id';

/**
 * Handles messages in the control namespace
 * @param {AppDispatch} dispatch  function
 * @param {ConferenceRoom} conference context of the current conference room
 * @param {control.Message} data control message content
 * @param {Timestamp} timestamp of the message
 */
const handleControlMessage = async (
  dispatch: AppDispatch,
  state: RootState,
  conference: ConferenceRoom, //TODO remove and handle stuff in the webrtc context directly
  data: control.Message,
  timestamp: Timestamp
) => {
  switch (data.message) {
    case 'join_success': {
      const participantsReady = data.participants
        .filter((participant) => participant.timer && participant.timer.readyStatus === true)
        .map((participant) => participant.id as ParticipantId);
      const { groupIds, messages: groupMessages } = transformChatHistory(data.chat.groupsHistory);
      const groups = groupIds;
      let roomHistory = data.chat.roomHistory as ChatMessage[];
      roomHistory = roomHistory.concat(groupMessages);

      let joinedParticipants: Participant[];
      joinedParticipants = data.participants.map((participant) => {
        return mapToUiParticipant(
          state,
          participant,
          data.breakout?.current || null,
          WaitingState.Joined,
          data.media?.speakers
        );
      });

      if (data.moderation?.waitingRoomEnabled && data.moderation.waitingRoomParticipants.length > 0) {
        // There can be a situation, that some participants are in both arrays (e.g. after Debriefing)
        // Therefore we should give priority to the waiting room, and remove them from the joined participants array
        const waitingParticipants = data.moderation.waitingRoomParticipants.map((waitingParticipant) => {
          const duplicateParticipantIndex = joinedParticipants.findIndex(
            (participant: Participant) => participant.id === waitingParticipant.id
          );
          if (duplicateParticipantIndex > -1) {
            joinedParticipants.splice(duplicateParticipantIndex, 1);
          }
          //TODO the backend should provide a waitingState: 'waiting' | 'approved', change when implemented
          return mapToUiParticipant(
            state,
            waitingParticipant,
            data.breakout?.current || null,
            WaitingState.Waiting,
            data.media?.speakers
          );
        });

        joinedParticipants = joinedParticipants.concat(waitingParticipants);
      }

      if (data.breakout !== undefined) {
        joinedParticipants = data.breakout.participants
          .map((participant) => mapBreakoutToUiParticipant(state, participant, timestamp))
          .concat(joinedParticipants);
      }

      const serverTimeOffset = new Date(timestamp).getTime() - new Date().getTime();
      dispatch(
        joinSuccess({
          participantId: data.id,
          avatarUrl: setLibravatarOptions(data.avatarUrl, { defaultImage: selectLibravatarDefaultImage(state) }),
          role: data.role,
          chat: {
            enabled: data.chat.enabled,
            roomHistory,
            lastSeenTimestampGlobal: data.chat.lastSeenTimestampGlobal,
            lastSeenTimestampsGroup: data.chat.lastSeenTimestampsGroup,
            lastSeenTimestampsPrivate: data.chat.lastSeenTimestampsPrivate,
          },
          groups,
          automod: data.automod,
          breakout: data.breakout,
          polls: data.polls,
          participants: joinedParticipants,
          moderation: data.moderation,
          isPresenter: data.media?.isPresenter,
          forceMute: data.media?.forceMute,
          recording: data.recording,
          serverTimeOffset,
          tariff: data.tariff,
          timer: data.timer,
          participantsReady: participantsReady,
          sharedFolder: data.sharedFolder,
          eventInfo: data.eventInfo,
          roomInfo: data.roomInfo,
          isRoomOwner: data.isRoomOwner,
        })
      );

      if (data.automod) {
        if (data.automod.config.selectionStrategy === AutomodSelectionStrategy.Playlist) {
          notificationAction({
            key: startedId,
            msg: createStackedMessages([
              i18next.t('talking-stick-started-first-line'),
              i18next.t('talking-stick-started-second-line'),
            ]),
            variant: 'info',
          });
        }
      }

      if (data.whiteboard?.status === 'initialized') {
        dispatch(setWhiteboardAvailable({ showWhiteboard: true, url: data.whiteboard.url }));
      }

      if (data.closesAt) {
        startTimeLimitNotification(data.closesAt);
      }

      //Mutes the user if microphones are disabled in conference
      if (
        data.media?.forceMute.type === ForceMuteType.Enabled &&
        !data.media.forceMute.allowList.includes(data.id) &&
        localMediaContext.isAudioRunning()
      ) {
        await localMediaContext.reconfigure({ audio: false });
      }

      localMediaContext.updateConferenceContext(conference).catch((e: Error) => {
        console.error('failed to attach localMediaContext to WebRTC room', e);
      });
      localScreenContext.updateConferenceContext(conference).catch((e: Error) => {
        console.error('failed to attach localScreenContext to WebRTC room', e);
      });

      // Notify moderator, in case he took the last position of the room and now it's full
      if (data.role === Role.Moderator) {
        const onlineParticipants = joinedParticipants.filter((participant) => {
          const hasNotLeft = participant.leftAt === null;
          const isInRoom = participant.waitingState === WaitingState.Joined;
          const isInTheSameBreakoutRoom = data.breakout?.current
            ? participant.breakoutRoomId === data.breakout?.current
            : true;
          return hasNotLeft && isInRoom && isInTheSameBreakoutRoom;
        });
        // Redux store has not been updated yet, therefore we have to add us manually
        const onlineParticipantsNumberPlusMe = onlineParticipants.length + 1;
        const participantLimit = data.tariff.quotas?.roomParticipantLimit;
        if (onlineParticipantsNumberPlusMe >= participantLimit) {
          notifications.error(i18next.t('meeting-notification-participant-limit-reached', { participantLimit }));
        }
      }

      //Show notification for active streaming target
      const activeTarget =
        data.recording &&
        Object.values(data.recording.targets).find((target) => target.status === StreamingStatus.Active);
      if (activeTarget) {
        createStreamUpdatedNotification({
          kind: activeTarget.streamingKind,
          status: activeTarget.status,
          publicUrl: activeTarget.streamingKind === StreamingKind.Livestream ? activeTarget.publicUrl : undefined,
          eventId: state.room.eventInfo?.id,
        });

        if (state.streaming.consent === undefined) {
          showConsentNotification(dispatch);
        }
      }

      break;
    }
    case 'joined': {
      dispatch(
        participantsJoin({
          participant: mapToUiParticipant(state, data, conference.roomCredentials.breakoutRoomId, WaitingState.Joined),
        })
      );

      // Notify moderator, in case a participant took the last position of the room and now it's full
      if (selectIsModerator(state)) {
        const participantLimit = selectParticipantLimit(state);
        // Redux store has not been updated yet, therefore we have to add new guest manually
        const onlineParticipantsPlusTheNewOne = selectParticipantsTotal(state) + 1;
        if (onlineParticipantsPlusTheNewOne >= participantLimit) {
          notifications.error(i18next.t('meeting-notification-participant-limit-reached', { participantLimit }));
        }
      }
      break;
    }
    case 'join_blocked':
      dispatch(joinBlocked({ reason: data.reason }));
      break;
    case 'left':
      dispatch(participantsLeft({ id: data.id, timestamp: timestamp }));
      break;
    case 'update': {
      if (data.control !== undefined) {
        dispatch(
          participantsUpdate({
            id: data.id,
            lastActive: timestamp,
            waitingState: WaitingState.Joined,
            isPresenter: Boolean(data.media?.isPresenter),
            meetingNotesAccess: mapMeetingNotesToMeetingNotesAccess(data.meetingNotes),
            ...data.control,
          })
        );
      }
      break;
    }
    case 'role_updated':
      dispatch(updateRole(data.newRole));
      if (data.newRole === Role.Moderator) {
        notifications.info(i18next.t('moderation-rights-granted'));
      } else {
        notifications.warning(i18next.t('moderation-rights-revoked'));
      }
      break;
    case 'time_limit_quota_elapsed':
      dispatch(hangUp());
      break;
    case 'hand_raised': {
      dispatch(raisedHand({ timestamp }));
      break;
    }
    case 'hand_lowered': {
      dispatch(loweredHand());
      break;
    }
    case 'room_deleted': {
      break;
    }
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown control message type: ${dataString}`);
    }
  }
};

/**
 * Handles messages in the media namespace
 * @param dispatch AppDispatch function
 * @param data mediaMsgs Message content
 */
const handleMediaMessage = async (dispatch: AppDispatch, data: media.Message, state: RootState) => {
  // TODO: Theses two are actually a control messages -- talk to the backend
  switch (data.message) {
    case 'presenter_granted':
      dispatch(setPresenterRole());
      notifications.close('control-participant-presenter-role-revoked');
      notifications.info(i18next.t('control-participant-presenter-role-granted'), {
        key: 'control-participant-presenter-role-granted',
      });
      break;
    case 'presenter_revoked':
      dispatch(revokePresenterRole());
      localScreenContext.release();
      notifications.close('control-participant-presenter-role-granted');
      notifications.warning(i18next.t('control-participant-presenter-role-revoked'), {
        key: 'control-participant-presenter-role-revoked',
      });
      break;
    case 'force_mute_enabled':
      dispatch(forceMuteEnabled({ allowList: data.allowList }));
      if (state.user.uuid !== null && !data.allowList.includes(state.user.uuid)) {
        if (localMediaContext.isAudioEnabled()) {
          await localMediaContext.reconfigure({ audio: false });
        }
        notifications.info(i18next.t('microphones-disabled-notification'));
      }
      break;
    case 'force_mute_disabled':
      dispatch(forceMuteDisabled());
      if (state.user.uuid && !state.moderation.forceMute.allowList.includes(state.user.uuid)) {
        notifications.info(i18next.t('microphones-enabled-notification'));
      }
      break;
    case 'request_mute': {
      dispatch(mediaStore.requestMute(data));
      const participants = state.participants.entities;
      if (data.force) {
        await localMediaContext.reconfigure({ audio: false });
        notifications.warning(
          i18next.t('media-received-force-mute', { origin: participants[data.issuer]?.displayName || 'admin' })
        );
      } else {
        const message = i18next.t('media-received-request-mute', {
          origin: participants[data.issuer]?.displayName || 'admin',
        });
        notificationAction({
          msg: message,
          variant: 'warning',
          actionBtnText: i18next.t('media-received-request-mute-ok'),
          onAction: () => localMediaContext.reconfigure({ audio: false }),
        });
      }
      dispatch(mediaStore.notificationShown());
      return;
    }
    case 'speaker_updated':
      dispatch(
        updatedSpeaker({ participant: data.participant, isSpeaking: data.isSpeaking, updatedAt: data.updatedAt })
      );
      return;
    case 'error': {
      const error = data.error;
      switch (error) {
        case 'invalid_end_of_candidates':
          notificationPersistent({
            msg: i18next.t('media-ice-connection-not-possible'),
            variant: 'error',
          });
          break;
        case 'invalid_request_offer':
          dispatch(subscriberFailed(data));
          break;
        // We currently don't care for these. A sepcific error handling should be added at a later point.
        case 'invalid_sdp_offer':
        case 'handle_sdp_answer':
        case 'invalid_candidate':
        case 'invalid_configure_request':
        case 'permission_denied':
          console.error(`Media Error: ${data}`);
          notifications.error(i18next.t('error-general'));
          throw new Error(`Media Error: ${error}`);
        default:
          console.error(`Media Error: ${data}`);
          throw new Error(`Media Error: ${error}`);
      }
    }
  }
};

/**
 * Handles messages in the breakout namespace
 * @param {AppDispatch} dispatch function send an event
 * @param {breakout.Message} data message content
 * @param {Timestamp} timestamp from backend of the current message
 */
const handleBreakoutMessage = (
  dispatch: AppDispatch,
  state: RootState,
  data: breakout.Message,
  timestamp: Timestamp
) => {
  switch (data.message) {
    case 'started':
      dispatch(breakoutStore.started(data));
      break;
    case 'stopped':
      dispatch(breakoutStore.stopped(data));
      break;
    case 'expired':
      dispatch(breakoutStore.expired());
      break;
    case 'joined':
      {
        const modifiedData = {
          ...data,
          avatarUrl: setLibravatarOptions(data.avatarUrl, { defaultImage: selectLibravatarDefaultImage(state) }),
        };
        dispatch(
          breakoutJoined({
            data: modifiedData,
            timestamp,
          })
        );
      }
      break;
    case 'left':
      dispatch(breakoutLeft({ id: data.id, timestamp }));
      break;
    case 'error':
      dispatchError(data.error.replace('_', '-'));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown breakout message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles messages in the automod namespace
 * @param dispatch AppDispatch function
 * @param data mediaMsgs Message content
 */
const handleAutomodMessage = (dispatch: AppDispatch, data: AutomodEventType, state: RootState) => {
  const stoppedId = 'handleAutomodMessage-stopped-id';
  const nextId = 'handleAutomodMessage-next-id';
  const currentId = 'handleAutomodMessage-current-id';
  const unmutedId = 'handleAutomodMessage-unmute-only-id';
  const MIN_RECOMMENDED_TALKING_STICK_PARTICIPANTS = 3;

  switch (data.message) {
    case 'started': {
      notifications.close(stoppedId);
      notifications.close(nextId);
      notifications.close(currentId);
      notifications.close(unmutedId);
      dispatch(automodStarted(data));

      const totalParticipants = selectParticipantsTotal(state);
      if (totalParticipants < MIN_RECOMMENDED_TALKING_STICK_PARTICIPANTS) {
        notifications.warning(i18next.t('talking-stick-participant-amount-notification'));
      }

      if (data.selectionStrategy === AutomodSelectionStrategy.Playlist) {
        notificationAction({
          key: startedId,
          msg: createStackedMessages([
            i18next.t('talking-stick-started-first-line'),
            i18next.t('talking-stick-started-second-line'),
          ]),
          variant: 'info',
        });

        if (data.issuedBy === state.user.uuid) {
          dispatch(automod.selectNext.action());
        }
      }
      break;
    }
    case 'stopped':
      notifications.close(startedId);
      notifications.close(nextId);
      notifications.close(currentId);
      notifications.close(unmutedId);
      dispatch(automodStopped());
      notificationAction({
        key: stoppedId,
        msg: i18next.t('talking-stick-finished'),
        variant: 'info',
      });
      localMediaContext.reconfigure({ audio: false }).catch((error) => {
        console.error('Failed to mute on talking stick stop:', error);
      });
      break;
    // case 'start_animation':
    //   dispatch(slotStore.initLottery({ winner: data.result, pool: data.pool }));
    //   break;
    case 'remaining_updated':
      dispatch(automodRemainingUpdated(data));
      break;
    case 'speaker_updated':
      if (data.speaker !== state.user.uuid) {
        localMediaContext.reconfigure({ audio: false });
        dispatch(setAsInactiveSpeaker());
      }
      notifications.close(nextId);
      notifications.close(currentId);
      notifications.close(unmutedId);
      if (data.remaining && data.remaining[0] && data.remaining[0] === state.user.uuid) {
        notificationAction({
          key: nextId,
          msg: i18next.t('talking-stick-next-announcement'),
          variant: 'warning',
          persist: true,
        });
      }
      if (data.speaker === state.user.uuid && state.automod.speakerState === 'inactive') {
        dispatch(setAsActiveSpeaker());
        notifications.showTalkingStickMutedNotification({
          onUnmute: async () => {
            notifications.close(currentId);
            await localMediaContext.reconfigure({ audio: true });
            notifications.showTalkingStickUnmutedNotification({
              onNext: () => {
                dispatch(automod.pass.action());
                notifications.close(unmutedId);
              },
              isLastSpeaker: Boolean(data.remaining && data.remaining.length === 0),
              key: unmutedId,
            });
          },
          onNext: () => {
            dispatch(automod.pass.action());
            notifications.close(currentId);
          },
          key: currentId,
        });
      }
      dispatch(automodSpeakerUpdated(data));
      break;
    case 'error':
      dispatchError(data.error.replace('_', '-'));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown automod message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles messages in the legal-vote namespace
 * @param dispatch AppDispatch function
 * @param data mediaMsgs Message content
 */
const handleLegalVoteMessage = (dispatch: AppDispatch, data: LegalVoteMessageType, state: RootState) => {
  switch (data.message) {
    case 'pdf_asset':
      //TODO implement pdf asset handling
      break;
    case 'started':
      dispatch(legalVoteStarted(data));
      break;
    case 'stopped':
      dispatch(legalVoteStopped(data));
      notifications.info(i18next.t('legal-vote-stopped'));
      break;
    case 'updated':
      dispatch(legalVoteUpdated(data));
      break;
    case 'canceled':
      dispatch(legalVoteCanceled(data));
      notifications.error(i18next.t('legal-vote-canceled'));
      break;
    case 'voted':
      if (data.response === 'success') {
        dispatch(legalVoteVoted(data));
      } else {
        notifications.error(i18next.t('legal-vote-error'));
      }
      break;
    case 'reported_issue': {
      // report came from others and not us, our id is not part of participants but user slice.
      if (data.participantId !== state.user.uuid) {
        const displayName = state.participants.entities[data.participantId]?.displayName || i18n.t('global-someone');
        if (data.kind) {
          notifications.warning(
            i18n.t('legal-vote-report-issue-kind-notification', {
              displayName: displayName,
              kind: data.kind,
            })
          );
        } else {
          notifications.warning(
            i18n.t('legal-vote-report-issue-description-notification', {
              displayName: displayName,
              description: data.description,
            })
          );
        }
      }
      break;
    }
    case 'error':
      dispatchError(data.error.replace('_', '-'));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown legal vote message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles messages in the poll namespace
 * @param {AppDispatch} dispatch function to fire an event
 * @param {poll.Message} data message content
 */
const handlePollVoteMessage = (dispatch: AppDispatch, data: poll.Message) => {
  switch (data.message) {
    case 'started':
      dispatch(pollStore.started(data));
      break;
    case 'live_update':
      dispatch(pollStore.liveUpdated(data));
      break;
    case 'done':
      dispatch(pollStore.done(data));
      break;
    case 'error':
      // todo error handling in BE seems to be wrong
      console.error('Poll error message', data);
      // dispatchError(data.error.replace('_', '-'));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown poll message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles messages in the moderation namespace
 * @param {AppDispatch} dispatch function to fire an event
 * @param {moderation.Message} data Message content
 */
const handleModerationMessage = (dispatch: AppDispatch, data: moderation.Message, state: RootState) => {
  switch (data.message) {
    case 'kicked':
      dispatch(hangUp());
      notifications.warning(i18next.t('meeting-notification-kicked'));
      break;
    case 'banned':
      dispatch(hangUp());
      notifications.warning(i18next.t('meeting-notification-banned'));
      break;
    case 'sent_to_waiting_room':
      dispatch(enteredWaitingRoom());
      notifications.warning(i18next.t('meeting-notification-moved-to-waiting-room'));
      //We release user media, unsubscribing from other participants' media is handled in ConferenceRoom.ts
      localMediaContext.release();
      localScreenContext.release();
      break;
    case 'waiting_room_enabled':
      dispatch(enableWaitingRoom());
      break;
    case 'waiting_room_disabled':
      dispatch(disableWaitingRoom());
      break;
    case 'joined_waiting_room':
      {
        const modifiedData = {
          ...data,
          control: {
            ...data.control,
            avatarUrl: setLibravatarOptions(data.control.avatarUrl, {
              defaultImage: selectLibravatarDefaultImage(state),
            }),
          },
        };
        dispatch(waitingRoomJoined(modifiedData));
      }
      break;
    case 'left_waiting_room':
      dispatch(waitingRoomLeft(data.id));
      break;
    case 'in_waiting_room':
      dispatch(enteredWaitingRoom());
      break;
    case 'accepted':
      dispatch(readyToEnter());
      break;
    case 'raised_hand_reset_by_moderator':
      notifications.info(i18next.t('reset-handraises-notification'));
      dispatch(forceLowerHand());
      break;
    case 'raise_hands_disabled':
      notifications.info(i18next.t('turn-handraises-off-notification'));
      dispatch(forceLowerHand());
      dispatch(disableRaisedHands());
      break;
    case 'raise_hands_enabled':
      notifications.info(i18next.t('turn-handraises-on-notification'));
      dispatch(enableRaisedHands());
      break;
    case 'debriefing_started':
      notifications.info(i18next.t('debriefing-started-notification'));
      break;
    case 'session_ended':
      notifications.info(
        i18next.t(
          state.user.role === Role.Moderator
            ? 'debriefing-session-ended-for-all-notification'
            : 'debriefing-session-ended-notification'
        )
      );
      dispatch(hangUp());
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown moderation message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles meetingNotes messages
 *
 * It takes a dispatch function and a meetingNotes message, and dispatches an action based on the message
 * @param {AppDispatch} dispatch - this is the dispatch function from the redux store.
 * @param data - meetingNotes.IncomingMeetingNotes
 */
const handleMeetingNotesMessage = (
  dispatch: AppDispatch,
  data: meetingNotes.IncomingMeetingNotes,
  state: RootState
) => {
  switch (data.message) {
    case 'pdf_asset':
      notifications.info(i18next.t('meeting-notes-upload-pdf-message'));
      break;
    case 'write_url':
      if (state.user.meetingNotesAccess === MeetingNotesAccess.None) {
        const message = i18next.t(
          state.user.role === Role.Moderator
            ? 'meeting-notes-created-all-notification'
            : 'meeting-notes-created-notification'
        );
        notificationAction({
          msg: message,
          variant: 'info',
          actionBtnText: i18next.t('meeting-notes-new-meeting-notes-message-button'),
          onAction: () => dispatch(updatedCinemaLayout(LayoutOptions.MeetingNotes)),
        });
      }
      dispatch(setMeetingNotesWriteUrl(data.url.toString()));
      break;
    case 'read_url':
      if (state.user.meetingNotesAccess === MeetingNotesAccess.None) {
        const message = i18next.t(
          state.user.role === Role.Moderator
            ? 'meeting-notes-created-all-notification'
            : 'meeting-notes-created-notification'
        );
        notificationAction({
          msg: message,
          variant: 'info',
          actionBtnText: i18next.t('meeting-notes-new-meeting-notes-message-button'),
          onAction: () => dispatch(updatedCinemaLayout(LayoutOptions.MeetingNotes)),
        });
      }
      dispatch(setMeetingNotesReadUrl(data.url.toString()));
      break;
    case 'error':
      dispatchError(data.error.replace('_', '-'));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown meeting notes message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles timer messages
 *
 * It takes a dispatch function and a protocol message, and dispatches an action based on the message
 * @param {AppDispatch} dispatch - this is the dispatch function from the redux store.
 * @param {timer.Message} data Message content
 */
const handleTimerMessage = (dispatch: AppDispatch, data: timer.Message) => {
  switch (data.message) {
    case 'started':
      dispatch(timerStarted(data));
      break;
    case 'stopped':
      dispatch(timerStopped(data));
      break;
    case 'updated_ready_status':
      dispatch(updateParticipantsReady(data));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown timer message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handles timer messages
 *
 * It takes a dispatch function and a protocol message, and dispatches an action based on the message
 * @param {AppDispatch} dispatch - this is the dispatch function from the redux store.
 * @param {timer.Message} data Message content
 */
const handleWhiteboardMessage = (dispatch: AppDispatch, data: whiteboard.Message) => {
  switch (data.message) {
    case 'space_url':
      dispatch(setWhiteboardAvailable({ showWhiteboard: true, url: data.url }));
      break;
    case 'pdf_asset':
      dispatch(addWhiteboardAsset({ asset: { assetId: data.assetId, filename: data.filename } }));
      notificationAction({
        msg: i18next.t('whiteboard-new-pdf-message'),
        variant: 'info',
      });

      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown timer message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

const handleChatMessage = (dispatch: AppDispatch, data: chat.ChatMessage, timestamp: Timestamp, state: RootState) => {
  switch (data.message) {
    case 'chat_enabled':
    case 'chat_disabled': {
      const enabled = data.message === 'chat_enabled';
      notifications.info(i18next.t(`chat-${enabled ? 'enabled' : 'disabled'}-message`));
      dispatch(setChatSettings({ id: data.id, timestamp, enabled }));
      break;
    }
    case 'message_sent': {
      const chatMessage = data;
      if (chatMessage.scope === ChatScope.Private && chatMessage.target === state.user.uuid) {
        data.target = data.source;
        notifications.info(i18next.t('chat-new-private-message'));
      }
      if (chatMessage.scope === ChatScope.Group && data.source !== state.user.uuid) {
        notifications.info(i18next.t('chat-new-group-message'));
      }
      dispatch(chatReceived({ timestamp, ...data }));
      break;
    }
    case 'history_cleared':
      dispatch(clearGlobalChat());
      notifications.info(i18next.t('chat-delete-global-messages-success'));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown chat message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

const handleStreamingMessage = (dispatch: AppDispatch, data: streaming.Message, state: RootState) => {
  switch (data.message) {
    case 'stream_updated': {
      dispatch(streamUpdated(data));

      const streamTarget = state.streaming.streams.entities[data.targetId];
      if (streamTarget) {
        const publicUrl =
          streamTarget.streamingKind === StreamingKind.Livestream && streamTarget.publicUrl
            ? streamTarget.publicUrl
            : undefined;
        //Add notification handler based on status
        createStreamUpdatedNotification({
          kind: streamTarget.streamingKind,
          status: data.status,
          publicUrl,
          eventId: state.room.eventInfo?.id,
        });
      }
      if (data.status === StreamingStatus.Active && state.streaming.consent === undefined) {
        showConsentNotification(dispatch);
      }
      break;
    }
    case 'recorder_error': {
      if (data.error === 'timeout') {
        notifications.error(i18next.t('livestream-start-error', { error: data.error }));
      }
      break;
    }
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown recording message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

const handleSharedFolderMessage = (dispatch: AppDispatch, data: sharedFolder.Message) => {
  switch (data.message) {
    case 'updated':
      dispatch(sharedFolderUpdated({ read: data.read, readWrite: data.readWrite }));
      break;
    default: {
      const dataString = JSON.stringify(data, null, 2);
      console.error(`Unknown shared_folder message type: ${dataString}`);
      throw new Error(`Unknown message type: ${dataString}`);
    }
  }
};

/**
 * Handle incoming websocket messages, sent from the signaling server
 *
 * @param {AppDispatch} dispatch
 * @param conference context of the current conference room
 * @returns (MessageEvent) => void
 * anonymous function that dispatches redux actions based on the Signaling API incoming message
 */
const onMessage =
  (dispatch: AppDispatch, getState: () => RootState, conference: ConferenceRoom) => (message: IncomingMessage) => {
    switch (message.namespace) {
      case 'control':
        handleControlMessage(dispatch, getState(), conference, message.payload, message.timestamp);
        break;
      case 'breakout':
        handleBreakoutMessage(dispatch, getState(), message.payload, message.timestamp);
        break;
      case 'media':
        handleMediaMessage(dispatch, message.payload, getState()).catch((e) => {
          console.error('Error in handleMediaMessage:', e);
        });
        break;
      case 'automod':
        handleAutomodMessage(dispatch, message.payload, getState());
        break;
      case 'legal_vote':
        handleLegalVoteMessage(dispatch, message.payload, getState());
        break;
      case 'moderation':
        handleModerationMessage(dispatch, message.payload, getState());
        break;
      case 'meeting_notes':
        handleMeetingNotesMessage(dispatch, message.payload, getState());
        break;
      case 'polls':
        handlePollVoteMessage(dispatch, message.payload);
        break;
      case 'chat':
        handleChatMessage(dispatch, message.payload, message.timestamp, getState());
        break;
      case 'timer':
        handleTimerMessage(dispatch, message.payload);
        break;
      case 'whiteboard':
        handleWhiteboardMessage(dispatch, message.payload);
        break;
      case 'recording':
        handleStreamingMessage(dispatch, message.payload, getState());
        break;
      case 'shared_folder':
        handleSharedFolderMessage(dispatch, message.payload);
        break;
      default: {
        const dataString = JSON.stringify(message, null, 2);
        throw new Error(`Unknown message type: ${dataString}`);
      }
    }
  };

/**
 * Our Signaling API Middleware
 *
 * This middleware creates the SignalingAPI instance and forwards actions meant for the signaling backend to the websocket.
 * It also dispatches redux actions based on incoming signaling packets.
 *
 * @param {MiddlewareAPI<AppDispatch, RootState>>} storeApi The redux store
 * @returns {anonymous function} Middleware Reducer
 */
export const apiMiddleware: Middleware = ({
  dispatch,
  getState,
}: {
  dispatch: AppDispatch;
  getState: () => RootState;
}) => {
  // matchBuilder acts similar to the builder for reducers and allows us to avoid a lot of if statements.
  const actionsMap = matchBuilder<RootState>((builder) => {
    builder
      .addCase(login.fulfilled, () => {
        dispatch(restApi.endpoints.getMe.initiate()).then((user) => {
          user.data &&
            i18n.language !== user.data?.language &&
            user.data?.language.length > 0 &&
            i18n.changeLanguage(user.data?.language);
          if (user.data) {
            initSentryReportWithUser({ name: user.data.displayName, email: user.data.email, lang: user.data.language });
          }
        });
      })
      .addCase(
        startRoom.fulfilled,
        (
          state,
          {
            payload: { conferenceContext },
            meta: {
              arg: { displayName },
            },
          }
        ) => {
          const connectedHandler = () => conferenceContext.join(displayName);
          const messageHandler = onMessage(dispatch, getState, conferenceContext);

          const shutdownHandler = ({ error }: { error?: number }) => {
            dispatch(connectionClosed({ errorCode: error }));
            conferenceContext.removeEventListener('message', messageHandler);
            conferenceContext.removeEventListener('shutdown', shutdownHandler);
            conferenceContext.removeEventListener('connected', connectedHandler);
          };

          conferenceContext.addEventListener('message', messageHandler);
          conferenceContext.addEventListener('shutdown', shutdownHandler);

          listenWebRtc(conferenceContext.webRtc, dispatch);
          conferenceContext.addEventListener('connected', connectedHandler);
        }
      )
      .addCase(startRoom.pending, () => {
        const conferenceContext = getCurrentConferenceRoom();
        if (conferenceContext !== undefined) {
          console.info('switching room -- webRTC was running, shutting down');
          shutdownConferenceContext();
        }
      })
      .addCase(hangUp.pending, () => {
        dispatch(legalVoteInitialized());
      })
      .addModule((builder) => outgoing.automod.handler(builder, dispatch))
      .addModule((builder) => outgoing.chat.handler(builder, dispatch))
      .addModule((builder) => outgoing.breakout.handler(builder, dispatch))
      .addModule((builder) => outgoing.control.handler(builder, dispatch))
      .addModule((builder) => outgoing.legalVote.handler(builder, dispatch))
      .addModule((builder) => outgoing.poll.handler(builder, dispatch))
      .addModule((builder) => outgoing.media.handler(builder, dispatch))
      .addModule((builder) => outgoing.meetingNotes.handler(builder, dispatch))
      .addModule((builder) => outgoing.moderation.handler(builder, dispatch))
      .addModule((builder) => outgoing.timer.handler(builder, dispatch))
      .addModule((builder) => outgoing.whiteboard.handler(builder, dispatch))
      .addModule((builder) => outgoing.recording.handler(builder, dispatch));
  });

  return (next) => (action: AnyAction) => {
    const caseHandler = actionsMap[action.type];
    if (caseHandler) {
      caseHandler(freeze(getState(), true), action);
    }
    return next(action);
  };
};
