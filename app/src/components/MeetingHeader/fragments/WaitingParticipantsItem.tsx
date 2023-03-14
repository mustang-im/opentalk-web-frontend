// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  ListItem as MuiListItem,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { notifications, useDateFormat } from '@opentalk/common';
import React, { useCallback, useEffect } from 'react';
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

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 'initial',
});

const ListItem = styled(MuiListItem)(({ theme }) => ({
  padding: theme.spacing(1, 1, 1, 0),
  '& .more-icon': {
    color: 'transparent',
  },
  ':hover': {
    opacity: 0.8,
    '& .more-icon': {
      color: theme.palette.primary.contrastText,
    },
  },
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

  const renderWaitingState = () => {
    switch (participant.waitingState) {
      case WaitingState.Waiting:
        return (
          <Button sx={{ whiteSpace: 'nowrap' }} variant="text" onClick={handleAccept}>
            {t('participant-menu-accept-participant')}
          </Button>
        );
      case WaitingState.Approved:
        return (
          <Button sx={{ whiteSpace: 'nowrap' }} variant="text" disabled>
            {t('participant-menu-accepted-participant')}
          </Button>
        );
    }
  };
  return (
    <ListItem button={false}>
      <Stack spacing={2} direction={'row'} justifyContent={'center'} alignItems={'center'}>
        <ListItemAvatar>
          <Avatar src={participant.avatarUrl} alt={participant.displayName}>
            {participant.displayName}
          </Avatar>
        </ListItemAvatar>
        <Stack>
          <ListItemText
            primary={
              <Typography variant={'body1'} noWrap>
                {participant.displayName}
              </Typography>
            }
            secondary={
              <JoinedText sx={{ whiteSpace: 'nowrap' }} variant={'caption'}>
                {t('participant-joined-text', { joinedTime: formattedTime })}
              </JoinedText>
            }
          />
        </Stack>
        <Stack>{renderWaitingState()}</Stack>
      </Stack>
    </ListItem>
  );
};

export default WaitingParticipantItem;
