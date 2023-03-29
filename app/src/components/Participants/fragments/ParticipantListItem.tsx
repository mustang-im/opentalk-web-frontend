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
  ProtocolIcon,
  MediaSessionType,
  ParticipationKind,
  useDateFormat,
} from '@opentalk/common';
import { notifications } from '@opentalk/common';
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
import { selectAudioEnabled, selectShareScreenEnabled } from '../../../store/slices/mediaSlice';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { Participant, ProtocolAccess } from '../../../store/slices/participantsSlice';
import { chatConversationStateSet, selectParticipantsSortOption } from '../../../store/slices/uiSlice';
import { selectIsModerator, selectOurUuid, selectUserProtocolAccess } from '../../../store/slices/userSlice';
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
  const ownAudioEnabled = useAppSelector(selectAudioEnabled);
  const ownScreenShareEnabled = useAppSelector(selectShareScreenEnabled);
  const userProtocolAccess = useAppSelector(selectUserProtocolAccess);

  const joinedTimestamp = new Date(participant?.joinedAt ?? new Date());
  const formattedJoinedTime = useDateFormat(joinedTimestamp, 'time');
  const lastActiveTimestamp = new Date(participant?.lastActive ?? new Date());
  const formattedLastActiveTime = useDateFormat(lastActiveTimestamp, 'time');
  const handUpTimestamp = new Date(participant?.handUpdatedAt ?? new Date());
  const formattedHandUpTime = useDateFormat(handUpTimestamp, 'time');

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
    if (participant.participationKind === ParticipationKind.User) {
      dispatch(banParticipant.action({ target: participant.id }));
      notifications.info(t('meeting-notification-user-was-banned', { user: participant.displayName }));
      return;
    }
    if (participant.participationKind === ParticipationKind.Guest) {
      dispatch(kickParticipant.action({ target: participant.id }));
      dispatch(enableWaitingRoom.action());
      notifications.info(t('meeting-notification-user-was-kicked', { user: participant.displayName }));
      return;
    }
    if (participant.participationKind === ParticipationKind.Sip) {
      dispatch(kickParticipant.action({ target: participant.id }));
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
    participant.isPresenter
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
            i18nKey: participant.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
        ];
      case Role.Guest:
        return [
          {
            i18nKey: participant.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
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
    const isParticipantMe = participant.id === ownId;
    const isParticipantScreenShareEnabled = subscriberScreen?.video || false;
    const isParticipantAudioEnabled = subscriberVideo?.audio || false;

    const isScreenShareEnabled = isParticipantMe ? ownScreenShareEnabled : isParticipantScreenShareEnabled;
    const isAudioEnabled = isParticipantMe ? ownAudioEnabled : isParticipantAudioEnabled;

    if (participant.handIsUp) {
      return <RaiseHandOnIcon />;
    } else if (isScreenShareEnabled) {
      return <ShareScreenOnIcon />;
    } else if (isAudioEnabled) {
      return <MicOnIcon />;
    }
    return <MicOffIcon />;
  }, [participant, subscriberVideo, subscriberScreen, ownAudioEnabled, ownScreenShareEnabled]);

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

  const getContextText = () => {
    switch (sortType) {
      case SortOption.RaisedHandFirst:
        return t('participant-hand-raise-text', { handUpdated: formattedHandUpTime });
      case SortOption.LastActive:
        return t('participant-last-active-text', { lastActive: formattedLastActiveTime });
      default:
        return t('participant-joined-text', { joinedTime: formattedJoinedTime });
    }
  };

  const isProtocolEditor = (participant: Participant) => {
    if (participant.id === ownId && userProtocolAccess === ProtocolAccess.Write) {
      return true;
    }
    if (participant.protocolAccess && participant.protocolAccess === ProtocolAccess.Write) {
      return true;
    }
    return false;
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
        {isProtocolEditor(participant) && (
          <Grid item alignContent={'flex-end'}>
            <ProtocolIcon />
          </Grid>
        )}
        <IconsContainer item>{renderIcon()}</IconsContainer>
      </Grid>
    </ListItem>
  );
};

export default ParticipantListItem;
