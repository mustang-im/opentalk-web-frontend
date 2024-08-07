// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  ListItem as MuiListItem,
  ListItemAvatar as MuiListItemAvatar,
  ListItemText as MuiListItemText,
  Typography,
  Box,
  Badge,
  ThemeProvider,
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
  ChatScope,
  PhoneIcon,
  TelephoneStrokeIcon,
  IconButton,
  ModeratorIcon,
} from '@opentalk/common';
import { notifications, Participant, ProtocolAccess, SortOption, ParticipantAvatar } from '@opentalk/common';
import { format } from 'date-fns';
import { isEmpty } from 'lodash';
import React, { CSSProperties, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { batch } from 'react-redux';

import { Role } from '../../../api/types/incoming/control';
import { grantModeratorRole, revokeModeratorRole } from '../../../api/types/outgoing/control';
import { grantPresenterRole, requestMute, revokePresenterRole } from '../../../api/types/outgoing/media';
import {
  banParticipant,
  kickParticipant,
  enableWaitingRoom,
  sendParticipantToWaitingRoom,
} from '../../../api/types/outgoing/moderation';
import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectAudioEnabled, selectShareScreenEnabled } from '../../../store/slices/mediaSlice';
import { selectSubscriberStateById } from '../../../store/slices/mediaSubscriberSlice';
import { selectHandUp } from '../../../store/slices/moderationSlice';
import { chatConversationStateSet, selectParticipantsSortOption } from '../../../store/slices/uiSlice';
import { selectIsModerator, selectOurUuid, selectUserProtocolAccess } from '../../../store/slices/userSlice';
import MenuPopover, { IMenuOptionItem } from './MenuPopover';
import RenameParticipantDialog from './RenameParticipantDialog';

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

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, 30%)',
    background: theme.palette.text.disabled,
    width: '100%',
  },
  '& .MuiSvgIcon-root': {
    width: '20px',
  },
}));

const MicOffIconStyled = styled(MicOffIcon)({
  opacity: '0.5',
});

const PhoneOffIconStyled = styled(TelephoneStrokeIcon)({
  opacity: '0.5',
});

const ListItemText = styled(MuiListItemText)(({ theme }) => ({
  padding: theme.spacing(0, 1),
  '& p': {
    fontWeight: 400,
    lineHeight: 1,
  },
}));

const IconsContainer = styled(Box)({
  alignItems: 'center',
  display: 'flex',
  '& svg': {
    width: '0.8em',
    height: '0.8em',
  },
});

const JoinedText = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

type ParticipantRowProps = {
  data: Participant[];
  index: number;
  style: CSSProperties;
};

const ParticipantListItem = ({ data, index, style }: ParticipantRowProps) => {
  const participant = data[index];
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement>();
  const sortType = useAppSelector(selectParticipantsSortOption);
  const isCurrentUserModerator = useAppSelector(selectIsModerator);
  const { t } = useTranslation();
  const isSipParticipant = participant.participationKind === ParticipationKind.Sip;
  const dispatch = useAppDispatch();
  const open = Boolean(anchorEl);
  const ownId = useAppSelector(selectOurUuid);
  const ownAudioEnabled = useAppSelector(selectAudioEnabled);
  const ownScreenShareEnabled = useAppSelector(selectShareScreenEnabled);
  const userProtocolAccess = useAppSelector(selectUserProtocolAccess);
  const ownHandRaised = useAppSelector(selectHandUp);
  const [openRenameDialog, setOpenRenameDialog] = useState(false);

  const closePopover = () => {
    setAnchorEl(undefined);
  };

  const { active: audioActive } = useAppSelector(
    selectSubscriberStateById(
      {
        participantId: participant.id,
        mediaType: MediaSessionType.Video,
      },
      'audio'
    )
  );

  const { active: screenShareActive } = useAppSelector(
    selectSubscriberStateById(
      {
        participantId: participant.id,
        mediaType: MediaSessionType.Screen,
      },
      'video'
    )
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleRemoval = () => {
    switch (participant.participationKind) {
      case ParticipationKind.User:
        dispatch(banParticipant.action({ target: participant.id }));
        notifications.info(t('meeting-notification-user-was-banned', { user: participant.displayName }));
        break;
      case ParticipationKind.Guest:
        batch(() => {
          dispatch(kickParticipant.action({ target: participant.id }));
          dispatch(enableWaitingRoom.action());
        });
        notifications.info(t('meeting-notification-user-was-kicked', { user: participant.displayName }));
        break;
      case ParticipationKind.Sip:
        dispatch(kickParticipant.action({ target: participant.id }));
        notifications.info(t('meeting-notification-user-was-kicked', { user: participant.displayName }));
        break;
      default:
        notifications.error(t('dashboard-meeting-notification-error'));
    }
    closePopover();
  };

  const handleMoveToWaitingRoom = () => {
    closePopover();
    if (participant.participationKind) {
      dispatch(sendParticipantToWaitingRoom.action({ target: participant.id }));
      notifications.info(t('meeting-notification-user-moved-to-waiting-room'));
      return;
    }

    notifications.error(t('dashboard-meeting-notification-error'));
  };

  const handleModerationRight = () => {
    participant?.role === Role.Moderator
      ? dispatch(revokeModeratorRole.action({ target: participant.id }))
      : dispatch(grantModeratorRole.action({ target: participant.id }));
    closePopover();
  };

  const handlePresenterRoleRight = () => {
    participant.isPresenter
      ? dispatch(revokePresenterRole.action({ participantIds: [participant.id] }))
      : dispatch(grantPresenterRole.action({ participantIds: [participant.id] }));
  };

  const handleMuting = () => {
    dispatch(requestMute.action({ targets: [participant.id], force: true }));
  };

  const handleRenameParticipantDialog = () => {
    setOpenRenameDialog(!openRenameDialog);
    setAnchorEl(undefined);
  };

  const muteOption = audioActive && {
    i18nKey: 'participant-menu-mute',
    action: handleMuting,
    disabled: !audioActive, // In case we want to show option always, but want to disable it.
  };

  const moderatorRights = (): IMenuOptionItem[] => {
    let options: (IMenuOptionItem | false)[] = [];
    switch (participant.role) {
      case Role.Moderator:
        options = [
          {
            i18nKey: 'participant-menu-revoke-moderator',
            action: handleModerationRight,
            disabled: participant.isRoomOwner,
          },
          muteOption,
        ];
        break;
      case Role.User:
        options = [
          {
            i18nKey: 'participant-menu-grant-moderator',
            action: handleModerationRight,
          },
          {
            i18nKey: participant.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
          muteOption,
        ];
        break;
      case Role.Guest:
        options = [
          {
            i18nKey: 'participant-menu-rename',
            action: handleRenameParticipantDialog,
          },
          {
            i18nKey: participant.isPresenter ? 'revoke-presenter-role' : 'grant-presenter-role',
            action: handlePresenterRoleRight,
          },
          muteOption,
        ];
        break;
      default:
        options = [];
    }

    return options.filter(Boolean) as IMenuOptionItem[]; // Remove conditionally excluded menu options.
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
      disabled: participant.isRoomOwner,
    },
    {
      i18nKey: 'participant-menu-move-to-waiting-room',
      action: handleMoveToWaitingRoom,
      disabled: participant.isRoomOwner,
    },
    ...moderatorRights(),
  ];

  const renderIcon = useCallback(() => {
    const isParticipantMe = participant.id === ownId;
    const isHandRaised = isParticipantMe ? ownHandRaised : participant.handIsUp;
    const isScreenShareEnabled = isParticipantMe ? ownScreenShareEnabled : screenShareActive;
    const isAudioEnabled = isParticipantMe ? ownAudioEnabled : audioActive;

    if (isHandRaised) {
      return <RaiseHandOnIcon />;
    } else if (isScreenShareEnabled) {
      return <ShareScreenOnIcon />;
    } else if (isAudioEnabled) {
      return isSipParticipant ? <PhoneIcon /> : <MicOnIcon data-testid="MicOn" />;
    }
    return isSipParticipant ? <PhoneOffIconStyled /> : <MicOffIconStyled data-testid="MicOff" />;
  }, [
    participant.handIsUp,
    participant.id,
    isSipParticipant,
    audioActive,
    screenShareActive,
    ownAudioEnabled,
    ownScreenShareEnabled,
    ownHandRaised,
  ]);

  const renderMenu = () => (
    <>
      <IconButton aria-label="open participant more menu" onClick={handleClick}>
        <MoreIcon className="more-icon" />
      </IconButton>
      {open && (
        <MenuPopover
          open={true}
          setAnchorEl={setAnchorEl}
          anchorEl={anchorEl}
          options={isCurrentUserModerator ? moderatorMenuOptionItems : participantMenuOptionItems}
        />
      )}
    </>
  );

  const getContextText = () => {
    switch (sortType) {
      case SortOption.RaisedHandFirst: {
        const handUpTimestamp =
          participant && !isEmpty(participant.handUpdatedAt)
            ? new Date(participant.handUpdatedAt as string)
            : new Date();
        const formattedHandUpTime = format(handUpTimestamp, 'HH:mm');
        const joinedTimestamp =
          participant && !isEmpty(participant.joinedAt) ? new Date(participant.joinedAt as string) : new Date();
        const formattedJoinedTime = format(joinedTimestamp, 'HH:mm');
        if (participant?.handUpdatedAt && participant.handIsUp) {
          return t('participant-hand-raise-text', { handUpdated: formattedHandUpTime });
        }
        return t('participant-joined-text', { joinedTime: formattedJoinedTime });
      }
      case SortOption.LastActive: {
        const lastActiveTimestamp =
          participant && !isEmpty(participant.lastActive) ? new Date(participant.lastActive as string) : new Date();
        const formattedLastActiveTime = format(lastActiveTimestamp, 'HH:mm');
        return t('participant-last-active-text', { lastActive: formattedLastActiveTime });
      }
      default: {
        const joinedTimestamp =
          participant && !isEmpty(participant.joinedAt) ? new Date(participant.joinedAt as string) : new Date();
        const formattedJoinedTime = format(joinedTimestamp, 'HH:mm');
        return t('participant-joined-text', { joinedTime: formattedJoinedTime });
      }
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

  const renderAvatar = useCallback(() => {
    const isParticipantGuest = participant.role === Role.Guest;
    const isParticipantModerator = participant.role === Role.Moderator;
    const renderWithBadge = isParticipantGuest || isParticipantModerator;

    if (renderWithBadge) {
      return (
        <StyledBadge badgeContent={isParticipantGuest ? t('guest-label') : <ModeratorIcon color="primary" />}>
          <Avatar src={participant?.avatarUrl} alt={participant?.displayName} isSipParticipant={isSipParticipant}>
            {participant?.displayName}
          </Avatar>
        </StyledBadge>
      );
    }

    return (
      <Avatar src={participant?.avatarUrl} alt={participant?.displayName} isSipParticipant={isSipParticipant}>
        {participant?.displayName}
      </Avatar>
    );
  }, [participant.role]);

  return (
    <ListItem style={style}>
      <Box display="flex" flexWrap="nowrap" alignItems="center" width="100%">
        <ListItemAvatar>{renderAvatar()}</ListItemAvatar>
        <ListItemText
          primary={
            <Typography variant="body1" noWrap translate="no" mb={0.5}>
              {participant?.displayName}
            </Typography>
          }
          secondary={
            <JoinedText variant="caption" translate="no">
              {getContextText()}
            </JoinedText>
          }
        />

        {participant.id !== ownId && renderMenu()}
        {isProtocolEditor(participant) && (
          <IconsContainer>
            <ProtocolIcon />
          </IconsContainer>
        )}
        <IconsContainer>{renderIcon()}</IconsContainer>
      </Box>
      <ThemeProvider theme={createOpenTalkTheme('light')}>
        <RenameParticipantDialog
          open={openRenameDialog}
          onClose={handleRenameParticipantDialog}
          participant={participant}
        />
      </ThemeProvider>
    </ListItem>
  );
};

export default ParticipantListItem;
