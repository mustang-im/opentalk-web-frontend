// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  styled,
  Typography,
  ThemeProvider,
  Divider as MuiDivider,
  MenuList,
  ListItemIcon,
  Stack,
  Box,
} from '@mui/material';
import {
  ErrorIcon,
  AddUserIcon,
  TimerIcon,
  RaiseHandOffIcon,
  RaiseHandOnIcon,
  CloseIcon,
  DoneIcon,
  TrashIcon,
  RecordingsIcon,
  notifications,
  notificationAction,
  notificationPersistent,
  ParticipantAvatar,
  LiveIcon,
  BackendModules,
  StreamingStatus,
  MicOffIcon,
  MicOnIcon,
} from '@opentalk/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { enableChat, disableChat, clearGlobalChatMessages } from '../../../api/types/outgoing/chat';
import { disableMicrophones, enableMicrophones } from '../../../api/types/outgoing/media';
import {
  disableRaiseHands,
  disableWaitingRoom,
  enableRaiseHands,
  enableWaitingRoom,
} from '../../../api/types/outgoing/moderation';
import { sendStartStreamSignal, sendStopStreamSignal } from '../../../api/types/outgoing/streaming';
import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useEnabledModules } from '../../../hooks/enabledModules';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import { selectChatEnabledState } from '../../../store/slices/chatSlice';
import { selectMicrophonesEnabled, selectRaiseHandsEnabled } from '../../../store/slices/moderationSlice';
import { selectWaitingRoomState } from '../../../store/slices/roomSlice';
import {
  selectActiveStreamIds,
  selectInactiveStreamIds,
  selectRecordingTarget,
} from '../../../store/slices/streamingSlice';
import { selectIsModerator, selectDisplayName, selectAvatarUrl, selectOurUuid } from '../../../store/slices/userSlice';
import { isDevMode } from '../../../utils/devMode';
import InviteGuestDialog from './InviteGuestDialog';
import { ToolbarMenuProps, ToolbarMenuItem, ToolbarMenu } from './ToolbarMenuUtils';

interface MenuEntry {
  label: string;
  action: (e: React.MouseEvent) => void;
  icon: React.ReactNode;
}

const MoreMenu = ({ anchorEl, onClose, open }: ToolbarMenuProps) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { t } = useTranslation();
  const isModerator = useAppSelector(selectIsModerator);
  const participantId = useAppSelector(selectOurUuid);
  const displayName = useAppSelector(selectDisplayName);
  const avatarUrl = useAppSelector(selectAvatarUrl);
  const isWaitingRoomActive = useAppSelector(selectWaitingRoomState);
  const hasHandraisesEnabled = useAppSelector(selectRaiseHandsEnabled);
  const hasMicrophonesEnabled = useAppSelector(selectMicrophonesEnabled);
  const isChatEnabled = useAppSelector(selectChatEnabledState);
  const dispatch = useAppDispatch();
  const recording = useAppSelector(selectRecordingTarget);
  const activeStreamIds = useAppSelector(selectActiveStreamIds);
  const inactiveStreamIds = useAppSelector(selectInactiveStreamIds);
  const enabledModules = useEnabledModules();
  const hasRecordingFeatureOn = enabledModules.has(BackendModules.Recording);
  const fullscreenHandle = useFullscreenContext();

  const toggleWaitingRoomItem = isWaitingRoomActive
    ? {
        label: 'more-menu-disable-waiting-room',
        action: () => {
          onClose();
          dispatch(disableWaitingRoom.action());
          notifications.info(t('waiting-room-disabled-message'));
        },
        icon: <TimerIcon />,
      }
    : {
        label: 'more-menu-enable-waiting-room',
        action: () => {
          onClose();
          dispatch(enableWaitingRoom.action());
          notifications.info(t('waiting-room-enabled-message'));
        },
        icon: <TimerIcon />,
      };

  const toggleHandraises = hasHandraisesEnabled
    ? {
        label: 'more-menu-turn-handraises-off',
        action: () => {
          onClose();
          dispatch(disableRaiseHands.action());
        },
        icon: <RaiseHandOffIcon />,
      }
    : {
        label: 'more-menu-turn-handraises-on',
        action: () => {
          onClose();
          dispatch(enableRaiseHands.action());
        },
        icon: <RaiseHandOnIcon />,
      };

  const toggleMicrophones = hasMicrophonesEnabled
    ? {
        label: 'more-menu-disable-microphones',
        action: () => {
          if (participantId) {
            onClose();
            //From product - only moderator that disables the microphones can unmute
            dispatch(disableMicrophones.action({ allowList: [participantId] }));
          }
        },
        icon: <MicOffIcon />,
      }
    : {
        label: 'more-menu-enable-microphones',
        action: () => {
          onClose();
          dispatch(enableMicrophones.action());
        },
        icon: <MicOnIcon />,
      };

  const toggleChatItem = isChatEnabled
    ? {
        label: 'more-menu-disable-chat',
        action: () => {
          onClose();
          dispatch(disableChat.action());
        },
        icon: <CloseIcon />,
      }
    : {
        label: 'more-menu-enable-chat',
        action: () => {
          onClose();
          dispatch(enableChat.action());
        },
        icon: <DoneIcon />,
      };

  const deleteGlobalChatItem = {
    label: 'more-menu-delete-global-chat',
    icon: <TrashIcon />,
    action: () => {
      onClose();
      dispatch(clearGlobalChatMessages.action());
    },
  };

  const moderatorMenuItems = [
    {
      label: 'more-menu-create-invite',
      action: () => {
        onClose();
        setShowInviteModal(true);
      },
      icon: <AddUserIcon />,
    },
    toggleWaitingRoomItem,
    toggleHandraises,
    toggleMicrophones,
    toggleChatItem,
    deleteGlobalChatItem,
  ];

  //Exclude start/stop recording when errored/unavailable until we have designs/approach for how to handle errored and unavailable streams
  const isValidRecordingTarget =
    recording && recording.status !== StreamingStatus.Error && recording.status !== StreamingStatus.Unavailable;

  if (hasRecordingFeatureOn && isValidRecordingTarget) {
    switch (recording.status) {
      case StreamingStatus.Active:
        moderatorMenuItems.push({
          label: 'more-menu-stop-recording',
          action: () => {
            dispatch(sendStopStreamSignal.action({ targetIds: [recording.targetId] }));
            onClose();
          },
          icon: <RecordingsIcon />,
        });
        break;
      case StreamingStatus.Inactive:
        moderatorMenuItems.push({
          label: 'more-menu-start-recording',
          action: () => {
            dispatch(sendStartStreamSignal.action({ targetIds: [recording.targetId] }));
            onClose();
          },
          icon: <RecordingsIcon />,
        });
        break;
    }
  }

  if (activeStreamIds.length > 0) {
    moderatorMenuItems.push({
      label: 'more-menu-stop-streaming',
      action: () => {
        dispatch(sendStopStreamSignal.action({ targetIds: activeStreamIds }));
        onClose();
      },
      icon: <LiveIcon />,
    });
  } else if (inactiveStreamIds.length > 0) {
    moderatorMenuItems.push({
      label: 'more-menu-start-streaming',
      action: () => {
        dispatch(sendStartStreamSignal.action({ targetIds: inactiveStreamIds }));
        onClose();
      },
      icon: <LiveIcon />,
    });
  }

  const devMenuItems = [
    {
      label: 'Show Binary Action',
      action: () =>
        notifications.binaryAction('Hello World', {
          primaryBtnText: 'Primary',
          secondaryBtnText: 'Secondary',
          onPrimary: () => alert('Primary button clicked'),
          onSecondary: () => alert('Secondary button clicked'),
          persist: true,
          type: 'error',
        }),
      icon: <ErrorIcon />,
    },
    {
      label: 'Show Test Error',
      action: () => notifications.error(`Test error context: ${new Error('Test Error')}`),
      icon: <ErrorIcon />,
    },
    {
      label: 'Show Test Warning',
      action: () => notifications.warning(`Ooops...you just triggered a warning.`),
      icon: <ErrorIcon />,
    },
    {
      label: 'Show Test Success',
      action: () => notifications.info(`This is an info message.`),
      icon: <ErrorIcon />,
    },
    {
      label: 'Show Test Info',
      action: () => notifications.success(`You just triggered this notification. Success!`),
      icon: <ErrorIcon />,
    },
    {
      label: 'Action Cancel Btn Success',
      action: () =>
        notificationAction({
          msg: `You just triggered this notification. Success!`,
          variant: 'success',
          cancelBtnText: 'Dismiss',
          onCancel: () => alert('Callback fnc to handle click, Action Cancel Btn Success'),
          SnackbarProps: {
            role: 'alert',
            'aria-label': 'You just triggered this notification. Success!',
          },
        }),
      icon: <ErrorIcon />,
    },
    {
      label: 'Action Warning',
      action: () =>
        notificationAction({
          msg: 'Ooops...you just triggered a warning.',
          variant: 'warning',
          actionBtnText: 'Next',
          cancelBtnText: 'Dismiss',
          onAction: () => alert('Callback fnc to handle click, User Agree'),
          onCancel: () => alert('Callback fnc to handle click, User Dismissed'),
          SnackbarProps: {
            role: 'alert',
            'aria-label': 'Ooops...you just triggered a warning.',
          },
        }),
      icon: <ErrorIcon />,
    },
    {
      label: 'Persistent error',
      action: () => notificationPersistent({ msg: "This is an error that won't go away", variant: 'error' }),
      icon: <ErrorIcon />,
    },
    {
      label: 'Test Kill Signaling',
      action: () => {
        const windowRef = window as Window;
        windowRef.debugKillSignaling();
      },
      icon: <ErrorIcon />,
    },
    {
      label: 'Test Glitchtip Integration',
      action: function glitchtipTriggerFunction() {
        throw new Error('Hello Glitchtip');
      },
      icon: <ErrorIcon />,
    },
  ];

  const renderMenuItems = (menuEntries: Array<MenuEntry>) => (
    <MenuList>
      {menuEntries.map(({ label, action, icon }) => (
        <ToolbarMenuItem key={label} onClick={action}>
          <ListItemIcon>{icon}</ListItemIcon>
          <Typography variant="inherit" noWrap>
            {t(label)}
          </Typography>
        </ToolbarMenuItem>
      ))}
    </MenuList>
  );

  const MenuTitleContainer = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    padding: theme.spacing(1, 2, 0, 1),
    justifyContent: 'space-between',
  }));

  const MenuTitle = styled(Typography)(({ theme }) => ({
    fontSize: theme.typography.pxToRem(14),
    fontWeight: 'initial',
  }));

  const Avatar = styled(ParticipantAvatar)({
    transform: 'scale(0.5)',
  });

  const Divider = styled(MuiDivider)({
    marginTop: 0,
  });

  useEffect(() => {
    fullscreenHandle.setHasActiveOverlay(open);

    return () => {
      fullscreenHandle.setHasActiveOverlay(false);
    };
  }, []);

  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <ToolbarMenu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: -4,
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        data-testid="moreMenu"
        container={fullscreenHandle.rootElement}
        PaperProps={{
          'aria-label': t('toolbar-button-more-tooltip-title'),
        }}
      >
        <MenuTitleContainer direction="row" spacing={2}>
          <Box display="flex" alignItems="center">
            <Avatar src={avatarUrl}>{displayName}</Avatar>
            <MenuTitle translate="no">{displayName}</MenuTitle>
          </Box>
          <small>{window.config.version?.product || t('dev-version')}</small>
        </MenuTitleContainer>
        <Divider />
        {isModerator && renderMenuItems(moderatorMenuItems)}
        {isDevMode() && renderMenuItems(devMenuItems)}
      </ToolbarMenu>
      <InviteGuestDialog open={showInviteModal} onClose={() => setShowInviteModal(false)} />
    </ThemeProvider>
  );
};

export default MoreMenu;
