// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  ListItem as MuiListItem,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  Typography,
  Grid,
} from '@mui/material';
import {
  MicOffIcon,
  MicOnIcon,
  RaiseHandOnIcon,
  ShareScreenOnIcon,
  MoreIcon,
  MediaSessionType,
  ParticipationKind,
} from '@opentalk/common';
import i18next from 'i18next';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Role } from '../../../api/types/incoming/control';
import { grantModeratorRole, revokeModeratorRole } from '../../../api/types/outgoing/control';
import { grantPresenterRole, revokePresenterRole } from '../../../api/types/outgoing/media';
import { banParticipant, kickParticipant, enableWaitingRoom } from '../../../api/types/outgoing/moderation';
import IconButton from '../../../commonComponents/IconButton';
import ChatScope from '../../../enums/ChatScope';
import SortOption from '../../../enums/SortOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { Participant } from '../../../store/slices/participantsSlice';
import { chatConversationStateSet, selectParticipantsSortOption } from '../../../store/slices/uiSlice';
import { selectIsModerator, selectOurUuid } from '../../../store/slices/userSlice';
import notifications from '../../../utils/snackBarUtils';
import ParticipantAvatar from '../../ParticipantAvatar';
import MenuPopover, { IMenuOptionItem } from './MenuPopover';

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
  cursor: 'pointer',
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

const IconsContainer = styled(Grid)({
  '& svg': {
    width: '0.6em',
    height: '0.6em',
  },
});

const JoinedText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

type ParticipantRowProps = {
  participant: Participant;
};

const ParticipantListItem = ({ participant }: ParticipantRowProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const sortType = useAppSelector(selectParticipantsSortOption);
  const isModerator = useAppSelector(selectIsModerator);
  const { t } = useTranslation();
  const isSipParticipant = participant.participationKind === ParticipationKind.Sip;
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const ownId = useAppSelector(selectOurUuid);

  const subscriberVideo = useAppSelector(
    selectSubscriberById({
      participantId: participant.id,
      mediaType: MediaSessionType.Video,
    })
  );

  const subscriberScreen = useAppSelector(
    selectSubscriberById({
      participantId: participant.id,
      mediaType: MediaSessionType.Screen,
    })
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemoval = () => {
    if (participant.participationKind === 'user') {
      dispatch(banParticipant.action({ target: participant.id }));
      notifications.info(t('meeting-notification-user-was-banned', { user: participant.displayName }));
      return;
    }
    if (participant.participationKind === 'guest') {
      dispatch(kickParticipant.action({ target: participant.id }));
      dispatch(enableWaitingRoom.action());
      notifications.info(t('meeting-notification-user-was-kicked', { user: participant.displayName }));
      return;
    }
    setAnchorEl(undefined);
    notifications.error(t('dashboard-meeting-notification-error'));
  };

  const handleModerationRight = () => {
    participant?.role === Role.Moderator
      ? dispatch(revokeModeratorRole.action({ target: participant.id }))
      : dispatch(grantModeratorRole.action({ target: participant.id }));
    setAnchorEl(undefined);
  };

  const handlePresenterRoleRight = () => {
    participant.presenterRole?.isPresenter
      ? dispatch(revokePresenterRole.action({ participantIds: [participant.id] }))
      : dispatch(grantPresenterRole.action({ participantIds: [participant.id] }));
  };

  const moderatorRights = () => {
    switch (participant.role) {
      case Role.Moderator:
        return [
          {
            i18nKey: 'participant-menu-revoke-moderator',
            action: handleModerationRight,
          },
        ];
      case Role.User:
        return [
          {
            i18nKey: 'participant-menu-grant-moderator',
            action: handleModerationRight,
          },
          {
            i18nKey: participant.presenterRole?.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
        ];
      case Role.Guest:
        return [
          {
            i18nKey: participant.presenterRole?.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
        ];
      default:
        return [];
    }
  };

  const participantMenuOptionItems: IMenuOptionItem[] = [
    {
      i18nKey: 'participant-menu-send-message',
      action: () =>
        dispatch(
          chatConversationStateSet({
            scope: ChatScope.Private,
            targetId: participant.id,
          })
        ),
    },
  ];

  const moderatorMenuOptionItems: IMenuOptionItem[] = [
    ...participantMenuOptionItems,
    {
      i18nKey: 'participant-menu-remove-participant',
      action: handleRemoval,
    },
    ...moderatorRights(),
  ];

  const renderIcon = useCallback(() => {
    const isScreenShareEnabled = subscriberScreen?.video || false;
    const isAudioEnabled = subscriberVideo?.audio || false;

    if (participant.handIsUp) {
      return <RaiseHandOnIcon />;
    } else if (isScreenShareEnabled) {
      return <ShareScreenOnIcon />;
    } else if (isAudioEnabled) {
      return <MicOnIcon />;
    }
    return <MicOffIcon />;
  }, [participant, subscriberVideo, subscriberScreen]);

  const renderMenu = () => (
    <>
      <IconButton aria-label="open participant more menu" onClick={handleClick}>
        <MoreIcon className={'more-icon'} />
      </IconButton>
      <MenuPopover
        open={open}
        setAnchorEl={setAnchorEl}
        anchorEl={anchorEl}
        options={isModerator ? moderatorMenuOptionItems : participantMenuOptionItems}
      />
    </>
  );

  const getTimestamp = (time: string) =>
    new Date(time).toLocaleTimeString(i18next.language, {
      hour: '2-digit',
      minute: '2-digit',
    });

  const getContextText = () => {
    switch (sortType) {
      case SortOption.RaisedHandFirst:
        if (participant.handIsUp) {
          return t('participant-hand-raise-text', {
            handUpdated: participant?.handUpdatedAt ? getTimestamp(participant?.handUpdatedAt) : '',
          });
        }
        return '';
      case SortOption.LastActive:
        return t('participant-last-active-text', {
          lastActive: participant?.lastActive ? getTimestamp(participant?.lastActive) : '',
        });
      default:
        return t('participant-joined-text', { joinedTime: getTimestamp(participant?.joinedAt) });
    }
  };

  return (
    <ListItem>
      <Grid container spacing={2} direction={'row'} wrap={'nowrap'}>
        <Grid item>
          <ListItemAvatar>
            <Avatar src={participant?.avatarUrl} alt={participant?.displayName} isSipParticipant={isSipParticipant}>
              {participant?.displayName}
            </Avatar>
          </ListItemAvatar>
        </Grid>
        <Grid item xs zeroMinWidth>
          <ListItemText
            primary={
              <Typography variant={'body1'} noWrap>
                {participant?.displayName}
              </Typography>
            }
            secondary={<JoinedText variant={'caption'}>{getContextText()}</JoinedText>}
          />
        </Grid>
        {participant.id !== ownId && <Grid item>{renderMenu()}</Grid>}
        <IconsContainer item>{renderIcon()}</IconsContainer>
      </Grid>
    </ListItem>
  );
};

export default ParticipantListItem;
