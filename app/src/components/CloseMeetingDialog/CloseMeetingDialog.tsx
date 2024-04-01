// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Button,
  Radio,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  RadioGroup,
  Typography,
  FormLabel,
} from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import { notifications } from '@opentalk/common';
import { DateTimeWithTimezone, Event, EventType, RoomId, EventStatus } from '@opentalk/rest-api-rtk-query';
import { EventInstanceId } from '@opentalk/rest-api-rtk-query/src/types/event';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

import { useUpdateEventInstanceMutation } from '../../api/rest';
import { useAppDispatch } from '../../hooks';
import { useFullscreenContext } from '../../hooks/useFullscreenContext';
import { hangUp } from '../../store/commonActions';
import { deleteRoomMetaData } from '../../store/slices/internalSlice';

export interface CloseMeetingDialogProps {
  open: boolean;
  onClose: () => void;
  container: HTMLElement | null;
  eventData?: Event;
}

enum DeletionType {
  One = 'one',
  All = 'all',
}

/**
 * Generates an instanceId by using todays date combined
 * with the starting time of the event. Takes into account the
 * current timezone of the user clicking the End Call button.
 * @param startTime
 * @returns a string formatted as a valid instanceId
 */
export const generateInstanceId = (startTime: DateTimeWithTimezone): EventInstanceId => {
  const formatTimeString = (number: number) => String(number).padStart(2, '0');

  const startDate = new Date(startTime.datetime);
  const now = new Date();

  const hours = formatTimeString(startDate.getUTCHours());
  const minutes = formatTimeString(startDate.getUTCMinutes());
  const seconds = formatTimeString(startDate.getUTCSeconds());
  const month = formatTimeString(now.getUTCMonth() + 1);
  const day = formatTimeString(now.getUTCDate());
  const year = now.getUTCFullYear();

  const timeString = `${hours}${minutes}${seconds}Z`;
  const dateString = `${year}${month}${day}T`;

  return `${dateString}${timeString}` as EventInstanceId;
};

export const CloseMeetingDialog = ({ open, onClose, eventData }: CloseMeetingDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { roomId } = useParams<'roomId'>() as {
    roomId: RoomId;
  };
  const [updateEventInstance] = useUpdateEventInstanceMutation();

  const [disableLeaveAndDeleteButton, setDisableLeaveAndDeleteButton] = useState(true);
  const [deletionMode, setDeletionMode] = useState<DeletionType | null>(null);

  const handleCheckbox = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDisableLeaveAndDeleteButton(!event.target.checked);
  }, []);

  const handleDeletionModeChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setDeletionMode((event.target as HTMLInputElement).value as DeletionType);
    setDisableLeaveAndDeleteButton(!event.target.checked);
  }, []);

  const handleHangUp = useCallback(() => dispatch(hangUp()), [dispatch]);

  const handleLeaveButton = async () => {
    try {
      switch (eventData?.type) {
        case EventType.Single:
          await dispatch(deleteRoomMetaData(roomId));
          break;
        case EventType.Recurring:
          if (deletionMode === 'one') {
            updateEventInstance({
              eventId: eventData.id,
              instanceId: generateInstanceId(eventData.startsAt),
              status: EventStatus.Cancelled,
            });
          } else if (deletionMode === 'all') {
            await dispatch(deleteRoomMetaData(roomId));
          }
          break;
      }
      handleHangUp();
      notifications.success(t('meeting-delete-successfully-deleted'));
      navigate('/dashboard');
    } catch (e) {
      console.error('error on delete room meta data: %s', JSON.stringify(e));
      notifications.error(t('meeting-delete-metadata-submit-error'));
    }
  };

  const singleConfigurationForm = () => (
    <DialogContent>
      <Typography>{t(`meeting-delete-metadata-dialog-message`)}</Typography>
      <Grid mt={1}>
        <FormControlLabel
          control={<Checkbox checked={!disableLeaveAndDeleteButton} onChange={handleCheckbox} />}
          label={t(`meeting-delete-metadata-dialog-checkbox`)}
          labelPlacement={'end'}
        />
      </Grid>
    </DialogContent>
  );
  const recurringConfigurationForm = () => (
    <DialogContent>
      <Typography>{t(`meeting-delete-recurring-metadata-dialog-message`)}</Typography>
      <Grid mt={1}>
        <FormControl>
          <FormLabel></FormLabel>
          <RadioGroup onChange={handleDeletionModeChange}>
            <FormControlLabel
              value={DeletionType.One}
              control={<Radio />}
              label={t('meeting-delete-recurring-dialog-radio-single')}
            />
            <FormControlLabel
              value={DeletionType.All}
              control={<Radio />}
              label={t('meeting-delete-recurring-dialog-radio-all')}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
    </DialogContent>
  );

  const getConfigurationForm = () => {
    switch (eventData?.type) {
      case EventType.Single:
        return singleConfigurationForm();
      case EventType.Recurring:
        return recurringConfigurationForm();
    }
  };

  const handleFullscreen = useFullscreenContext();

  useEffect(() => {
    handleFullscreen.setHasActiveOverlay(true);

    return () => {
      handleFullscreen.setHasActiveOverlay(false);
    };
  }, []);

  return (
    <>
      <Dialog open={open} maxWidth="sm" fullWidth container={handleFullscreen.rootElement}>
        <DialogTitle sx={{ textAlign: 'left' }}>{t('meeting-delete-metadata-dialog-title')}</DialogTitle>

        <Box position="absolute" top={0} right={0}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {getConfigurationForm()}

        <DialogActions>
          <Button onClick={handleLeaveButton} color="error" variant="contained" disabled={disableLeaveAndDeleteButton}>
            {t('meeting-delete-metadata-button-leave-and-delete')}
          </Button>
          <Button onClick={handleHangUp} color="primary" variant="contained">
            {t('meeting-delete-metadata-button-leave-without-delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CloseMeetingDialog;
