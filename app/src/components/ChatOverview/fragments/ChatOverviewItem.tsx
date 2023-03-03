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
import { TargetId, useDateFormat } from '@opentalk/common';
import { isEmpty } from 'lodash';
import { useEffect, useState } from 'react';

import ChatScope from '../../../enums/ChatScope';
import { useAppSelector } from '../../../hooks';
import { selectUnreadMessagesByTargetIdCount } from '../../../store/selectors';
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
  const lastSeenTimestampCount = useAppSelector(selectUnreadMessagesByTargetIdCount(chat.id as TargetId));
  const [fontWeight, setFontWeigth] = useState('normal');

  useEffect(() => {
    if (chat.scope === ChatScope.Private || chat.scope === ChatScope.Group) {
      if (lastSeenTimestampCount > 0) {
        setFontWeigth('bold');
      } else {
        setFontWeigth('normal');
      }
    }
  }, [chat, lastSeenTimestampCount]);

  const renderPrimaryText = () => (
    <Grid container direction={'row'} spacing={1}>
      <Grid item zeroMinWidth xs>
        <Typography fontWeight={fontWeight} variant={'body1'} color={'textPrimary'} noWrap>
          {getDisplayName()}
        </Typography>
      </Grid>
      <Grid item>
        <TimeTypography variant={'caption'} fontWeight={fontWeight}>
          {formattedTime}
        </TimeTypography>
      </Grid>
    </Grid>
  );

  const renderSecondaryText = () => (
    <Typography fontWeight={fontWeight} variant={'body1'} noWrap>
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
