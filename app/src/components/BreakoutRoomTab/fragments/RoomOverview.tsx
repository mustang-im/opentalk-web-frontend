// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button as MuiButton, Grid, styled, Box, Typography } from '@mui/material';
import { BreakoutRoomId, RoomId } from '@opentalk/common';
import { ClockIcon } from '@opentalk/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { stop } from '../../../api/types/outgoing/breakout';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { startRoom } from '../../../store/commonActions';
import { selectCombinedParticipantsAndUserInCoference } from '../../../store/selectors';
import { selectAllBreakoutRooms, selectExpiredDate } from '../../../store/slices/breakoutSlice';
import { selectRoomId, selectRoomPassword } from '../../../store/slices/roomSlice';
import { selectDisplayName, selectOurUuid } from '../../../store/slices/userSlice';
import RoomOverviewListItem from './RoomOverviewListItem';

const StyledClockIcon = styled(ClockIcon)(({ theme }) => ({
  verticalAlign: 'middle',
  marginRight: theme.spacing(1),
  fill: theme.palette.secondary.contrastText,
}));

const Button = styled(MuiButton)(({ theme }) => ({
  color: theme.palette.error.contrastText,
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    opacity: 0.8,
    backgroundColor: theme.palette.error.main,
  },
}));

const ListContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 29em)',
  overflow: 'auto',
});

const RoomOverview = () => {
  const [timeLeft, setTimeLeft] = useState<{ minutes: number; seconds: number } | null>(null);
  const participants = useAppSelector(selectCombinedParticipantsAndUserInCoference);
  const expires = useAppSelector(selectExpiredDate);
  const roomId = useAppSelector(selectRoomId);
  const roomPassword = useAppSelector(selectRoomPassword);
  const displayName = useAppSelector(selectDisplayName);
  const ourUuid = useAppSelector(selectOurUuid);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breakoutRooms = useAppSelector(selectAllBreakoutRooms);
  const calculateTimeLeft = (expiredDate: Date) => {
    const distance = expiredDate.getTime() - new Date().getTime();
    return {
      minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((distance % (1000 * 60)) / 1000),
    };
  };

  useEffect(() => {
    if (expires !== undefined && expires !== null) {
      const expiredDate = new Date(expires);
      setTimeLeft(calculateTimeLeft(expiredDate));
      const timer = setInterval(() => {
        const remainingTime = calculateTimeLeft(expiredDate);
        if (remainingTime.minutes > 0) {
          setTimeLeft(remainingTime);
        } else if (remainingTime.seconds > 0) {
          setTimeLeft(remainingTime);
        } else {
          setTimeLeft({ minutes: 0, seconds: 0 });
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [expires]);

  const stopBreakoutRoom = () => {
    dispatch(stop.action());
  };

  const renderDurationText = () => {
    if (expires !== null && expires !== undefined) {
      if (timeLeft !== null && timeLeft.minutes > 0) {
        return `${timeLeft.minutes} min`;
      }
      if (timeLeft !== null && timeLeft.seconds !== undefined) {
        return `${timeLeft.seconds}s`;
      }
    }
    return t('breakout-room-room-overview-no-duration');
  };

  const navigateToBreakoutRoom = (breakoutRoom: BreakoutRoomId) => {
    dispatch(
      startRoom({
        roomId: roomId as RoomId,
        password: roomPassword,
        breakoutRoomId: breakoutRoom,
        displayName,
        inviteCode: undefined,
      })
    ).then(() => navigate(`/room/${roomId}/${breakoutRoom}`));
  };

  const renderAccordions = () => {
    return breakoutRooms.map((breakout) => {
      const participantsInCurrentBreakout = participants
        .filter((participant) => participant.breakoutRoomId === breakout.id && !participant.leftAt)
        .sort((a, b) => (b.id === ourUuid ? 1 : 0)); //// push the current user in his breakout room on top of the list

      return (
        <RoomOverviewListItem
          groupedParticipants={participantsInCurrentBreakout}
          breakoutRoomId={breakout.id}
          joinRoom={(breakoutRoom) => navigateToBreakoutRoom(breakoutRoom as BreakoutRoomId)}
          key={breakout.id}
        />
      );
    });
  };

  return (
    <Box display={'flex'} flex={1} justifyContent={'space-between'} flexDirection={'column'}>
      <Grid container spacing={2} direction={'column'}>
        <Grid item>
          <Typography variant={'h6'} gutterBottom>
            {t('breakout-room-room-overview-title')}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant={'body2'} color={'primary'}>
            <StyledClockIcon />
            {renderDurationText()}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item direction={'column'} flex={1}>
        <Typography variant={'body2'} noWrap>
          {t('breakout-room-room-overview-participant-list')}
        </Typography>
        <ListContainer>{renderAccordions()}</ListContainer>
      </Grid>
      <Grid item>
        <Button color={'primary'} variant={'contained'} onClick={stopBreakoutRoom}>
          {t('breakout-room-room-overview-button-close')}
        </Button>
      </Grid>
    </Box>
  );
};

export default RoomOverview;
