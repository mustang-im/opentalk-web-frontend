// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  ListItem as MuiListItem,
  ListItemAvatar,
  ListItemText as MuiListItemText,
  styled,
  Typography,
} from '@mui/material';
import { notifications, useDateFormat } from '@opentalk/common';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { acceptParticipantFromWaitingRoomToRoom } from '../../../api/types/outgoing/moderation';
import { useAppDispatch } from '../../../hooks';
import { approveToEnter, Participant, WaitingState } from '../../../store/slices/participantsSlice';
import ParticipantAvatar from '../../ParticipantAvatar';

const Avatar = styled(ParticipantAvatar)({
  width: '2.25rem',
  height: '2.25rem',
  fontSize: '0.75rem',
});

const ListItem = styled(MuiListItem)(({ theme }) => ({
  padding: theme.spacing(1, 1, 0, 0),
}));

const ListItemText = styled(MuiListItemText)({
  '& p': {
    fontWeight: 400,
    lineHeight: 1,
  },
});

const JoinedText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

type ParticipantRowProps = {
  participant: Participant;
  approveAllWaiting?: boolean;
  handleApproveAll?: () => void;
};

const WaitingParticipantItem = ({ participant, approveAllWaiting, handleApproveAll }: ParticipantRowProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const timestamp = new Date(participant?.joinedAt) ?? Date.now;
  const formattedTime = useDateFormat(timestamp, 'time');

  const handleAccept = useCallback(() => {
    if (participant.waitingState === WaitingState.Waiting) {
      dispatch(acceptParticipantFromWaitingRoomToRoom.action({ target: participant.id }));
      dispatch(approveToEnter(participant.id));
      notifications.info(t('meeting-notification-user-was-accepted', { user: participant.displayName }));
    }
  }, [dispatch, participant, t]);

  useEffect(() => {
    if (approveAllWaiting) {
      handleAccept();
      if (handleApproveAll) {
        handleApproveAll();
      }
    }
  }, [approveAllWaiting, handleAccept, handleApproveAll]);

  const ParticipantWaitingState = useMemo(() => {
    switch (participant.waitingState) {
      case WaitingState.Waiting:
        return (
          <Button variant="text" onClick={handleAccept}>
            {t('participant-menu-accept-participant')}
          </Button>
        );
      case WaitingState.Approved:
        return (
          <Button variant="text" disabled>
            {t('participant-menu-accepted-participant')}
          </Button>
        );
      default:
        return null;
    }
  }, [participant.waitingState, handleAccept, t]);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar src={participant.avatarUrl} alt={participant.displayName}>
          {participant.displayName}
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography variant={'body1'}>{participant.displayName}</Typography>}
        secondary={
          <JoinedText variant={'caption'}>{t('participant-joined-text', { joinedTime: formattedTime })}</JoinedText>
        }
      />
      {ParticipantWaitingState}
    </ListItem>
  );
};

export default WaitingParticipantItem;
