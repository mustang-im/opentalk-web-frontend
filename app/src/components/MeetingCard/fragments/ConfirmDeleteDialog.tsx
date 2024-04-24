// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Button,
  ButtonTypeMap,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import { CloseIcon, notificationAction, notifications } from '@opentalk/common';
import { Event, EventException, EventId, EventStatus, EventType, isRecurringEvent } from '@opentalk/rest-api-rtk-query';
import { useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import {
  useDeleteEventMutation,
  useDeleteEventSharedFolderMutation,
  useUpdateEventInstanceMutation,
} from '../../../api/rest';
import { EventDeletionType, generateInstanceId } from '../../../utils/eventUtils';

interface ConfirmDeleteDialogProps {
  event: Event | EventException;
  open: boolean;
  onClose: () => void;
}

type ColorTypeMap<P = unknown> = ButtonTypeMap<P>['props']['color'];

interface ContentBasedOnEventTypeProps {
  message: string;
  title: string;
  actionButtons: {
    text: string;
    action: EventDeletionType | null;
    color: ColorTypeMap;
  }[];
}

export const ConfirmDeleteDialog = (props: ConfirmDeleteDialogProps) => {
  const { t } = useTranslation();
  const { open, event, onClose } = props;
  const { title } = event;
  const eventId = event.id as EventId;
  const [deleteSharedFolder] = useDeleteEventSharedFolderMutation();
  const [updateEventInstance] = useUpdateEventInstanceMutation();
  const [deleteEvent] = useDeleteEventMutation();
  const isFirstTryToDeleteSharedFolder = useRef(true);

  const stopPropagation = (mouseEvent: React.MouseEvent<HTMLDivElement | HTMLButtonElement | HTMLAnchorElement>) => {
    mouseEvent.stopPropagation();
  };

  const handleDeleteSharedFolder = async () => {
    if ('sharedFolder' in event) {
      try {
        await deleteSharedFolder({ eventId, forceDeletion: false }).unwrap();
      } catch (error) {
        if (isFirstTryToDeleteSharedFolder.current) {
          onClose();
          notificationAction({
            msg: t('dashboard-meeting-shared-folder-delete-error-message'),
            variant: 'error',
            actionBtnText: t('dashboard-meeting-shared-folder-error-retry-button'),
            cancelBtnText: t('dashboard-meeting-shared-folder-error-cancel-button'),
            persist: true,
            onAction: () => {
              isFirstTryToDeleteSharedFolder.current = false;
              deleteMeeting();
            },
            onCancel: () => {
              isFirstTryToDeleteSharedFolder.current = true;
              onClose();
            },
          });
          return;
        } else {
          isFirstTryToDeleteSharedFolder.current = true;
          notifications.error(t('dashboard-meeting-shared-folder-delete-retry-error-message'));
          return;
        }
      }
    }
  };

  const deleteMeeting = async () => {
    await handleDeleteSharedFolder();
    await deleteEvent(eventId);
  };

  const contentBasedOnEventType: ContentBasedOnEventTypeProps = useMemo(() => {
    switch (event.type) {
      case EventType.Recurring:
        return {
          message: t('dashboard-recurrence-meeting-card-delete-dialog-message'),
          title: t('dashboard-meeting-card-delete-dialog-title'),
          actionButtons: [
            {
              text: t('dashboard-meeting-card-delete-dialog-cancel'),
              action: null,
              color: 'primary',
            },
            {
              text: t('dashboard-recurrence-meeting-card-delete-dialog-one'),
              action: EventDeletionType.One,
              color: 'secondary',
            },
            {
              text: t('dashboard-reccurence-meeting-card-delete-dialog-all'),
              action: EventDeletionType.All,
              color: 'secondary',
            },
          ],
        };
      default:
        return {
          message: t('dashboard-meeting-card-delete-dialog-message', {
            subject: title,
          }),
          title: t('dashboard-meeting-card-delete-dialog-title'),
          actionButtons: [
            {
              text: t('dashboard-meeting-card-delete-dialog-cancel'),
              action: null,
              color: 'primary',
            },
            {
              text: t('dashboard-meeting-card-delete-dialog-ok'),
              action: EventDeletionType.All,
              color: 'secondary',
            },
          ],
        };
    }
  }, [event]);

  const handleActionButtons = async (action: EventDeletionType | null) => {
    switch (action) {
      case EventDeletionType.One:
        if (isRecurringEvent(event)) {
          await updateEventInstance({
            eventId: event.id,
            instanceId: generateInstanceId(event.startsAt),
            status: EventStatus.Cancelled,
          });
        }
        break;
      case EventDeletionType.All:
        await deleteMeeting();
        break;
    }
    onClose();
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth onMouseDown={stopPropagation} onClose={onClose}>
      <DialogTitle sx={{ textAlign: 'left' }}>{contentBasedOnEventType.title}</DialogTitle>
      <Box position="absolute" top={0} right={0}>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent style={{ textAlign: 'left' }}>
        <Typography>{contentBasedOnEventType?.message}</Typography>
      </DialogContent>
      <DialogActions>
        {contentBasedOnEventType.actionButtons.map((button, index) => (
          <Button
            onClick={() => handleActionButtons(button.action)}
            color={button.color}
            variant="contained"
            key={`${button.text}-${index}`}
          >
            {button.text}
          </Button>
        ))}
      </DialogActions>
    </Dialog>
  );
};
