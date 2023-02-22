// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  ListItemButton,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText,
  Typography,
  Grid,
  styled,
} from '@mui/material';
import { useDateFormat } from '@opentalk/common';
import { isEmpty } from 'lodash';
import React from 'react';

import { useAppSelector } from '../../../hooks';
import { ChatProps } from '../../../store/slices/chatSlice';
import { selectParticipantById } from '../../../store/slices/participantsSlice';
import ParticipantAvatar from '../../ParticipantAvatar';

const ListItemContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  '&:hover': {
    background: theme.palette.secondary.light,
  },
}));

const ListItemAvatar = styled(MuiListItemAvatar)(({ theme }) => ({
  minWidth: 'initial',
  marginRight: theme.spacing(1),
}));

const TimeTypography = styled(Typography)({
  color: '#7b9ca9',
});

interface IScopedChatItemProps {
  chat: ChatProps;
  onClick: (arg: string) => void;
}

const ChatOverviewItem = ({ chat, onClick }: IScopedChatItemProps) => {
  const participant = useAppSelector(selectParticipantById(chat.id));
  const date = new Date(chat.lastMessage?.timestamp) ?? Date.now;
  const formattedTime = useDateFormat(date, 'time');
  const getDisplayName = () => (isEmpty(participant) ? chat.id : participant?.displayName);

  const renderPrimaryText = () => (
    <Grid container direction={'row'} spacing={1}>
      <Grid item zeroMinWidth xs>
        <Typography variant={'body1'} color={'textPrimary'} noWrap>
          {getDisplayName()}
        </Typography>
      </Grid>
      <Grid item>
        <TimeTypography variant={'caption'}>{formattedTime}</TimeTypography>
      </Grid>
    </Grid>
  );

  const renderSecondaryText = () => (
    <Typography variant={'body1'} noWrap>
      {chat.lastMessage?.content || ''}
    </Typography>
  );

  return (
    <ListItemContainer>
      <ListItemButton onClick={() => onClick(chat.id)} disableGutters>
        <ListItemAvatar>
          <ParticipantAvatar src={participant?.avatarUrl}>{getDisplayName()}</ParticipantAvatar>
        </ListItemAvatar>
        <ListItemText primary={renderPrimaryText()} secondary={renderSecondaryText()} />
      </ListItemButton>
    </ListItemContainer>
  );
};

export default ChatOverviewItem;
