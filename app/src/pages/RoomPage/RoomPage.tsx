// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { BreakoutRoomId, RoomId } from '@opentalk/common';
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import RoomLoadingView from '../../commonComponents/RoomLoadingView';
import LobbyView from '../../components/LobbyView';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { startRoom } from '../../store/commonActions';
import { ConnectionState, selectInviteId, selectRoomConnectionState } from '../../store/slices/roomSlice';
import { selectDisplayName, selectIsAuthenticated } from '../../store/slices/userSlice';

const MeetingView = React.lazy(() => import('../../components/MeetingView'));
const WaitingView = React.lazy(() => import('../../components/WaitingView'));

const RoomPage = () => {
  const dispatch = useAppDispatch();
  const { roomId, breakoutRoomId } = useParams<'roomId' | 'breakoutRoomId'>() as {
    roomId: RoomId;
    breakoutRoomId?: BreakoutRoomId;
  };

  const inviteCode = useAppSelector(selectInviteId);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const displayName = useAppSelector(selectDisplayName);
  const connectionState = useAppSelector(selectRoomConnectionState);

  const renderRoom = useMemo(() => {
    if (!isAuthenticated) {
      console.warn('meeting page - not logged in - redirect');
      return <LobbyView />;
    }
    switch (connectionState) {
      case ConnectionState.Setup:
        // try to reconnect
        dispatch(
          startRoom({
            roomId,
            breakoutRoomId: breakoutRoomId || null,
            displayName,
            inviteCode,
          })
        ).catch((e) => {
          console.error('meeting page - connecting - auth error', e);
          //TODO error notification
        });
        return <RoomLoadingView />;
      case ConnectionState.Starting:
        return <RoomLoadingView />;
      case ConnectionState.Online:
      case ConnectionState.Leaving:
        return <MeetingView />;
      case ConnectionState.ReadyToEnter:
      case ConnectionState.Waiting:
        return <WaitingView />;
      case ConnectionState.Initial:
      case ConnectionState.Left:
        return <LobbyView />;
      case ConnectionState.Reconnecting:
        dispatch(
          startRoom({
            roomId,
            breakoutRoomId: breakoutRoomId || null,
            displayName,
            inviteCode,
          })
        ).catch((e) => {
          console.error('meeting page - reconnecting error', e);
        });
        return <RoomLoadingView />;
      case ConnectionState.Failed:
        return <LobbyView />;
      case ConnectionState.Blocked:
        return <RoomLoadingView />;
      default:
        console.error('room state unknown', connectionState);
        return <LobbyView />;
    }
  }, [connectionState, breakoutRoomId, dispatch, displayName, inviteCode, roomId, isAuthenticated]);

  return <>{renderRoom}</>;
};

export default RoomPage;
