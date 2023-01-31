// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import DateFnsAdapter from '@date-io/date-fns';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton as MuiIconButton,
  Paper,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { CloseIcon, MeetingsIcon, notifications } from '@opentalk/common';
import { DateTime, RoomId } from '@opentalk/rest-api-rtk-query';
import { useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { useCreateRoomInviteMutation } from '../../../api/rest';
import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { FormWrapper } from '../../../commonComponents';
import { useAppSelector } from '../../../hooks';
import { selectBaseUrl } from '../../../store/slices/configSlice';
import { selectRoomId } from '../../../store/slices/roomSlice';
import CustomDateTimePicker from './CustomDateTimePicker';

const theme = createOpenTalkTheme();

const IconButton = styled(MuiIconButton)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(1),
  right: theme.spacing(1),
}));

interface DialogTitleProps {
  id: string;
  children: React.ReactNode;
  onClose?: () => void;
}

const InviteDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle {...other}>
      <Typography style={{ color: theme.palette.secondary.dark }}>{children}</Typography>
      {onClose && (
        <IconButton aria-label="close-button" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      )}
    </DialogTitle>
  );
};

const InviteGuestDialog = (props: Omit<DialogProps, 'children'>) => {
  const dateFns = new DateFnsAdapter();
  const { t } = useTranslation();
  const baseUrl = useAppSelector(selectBaseUrl);
  const roomId = useAppSelector(selectRoomId);
  const [createGuestLink, { data, reset, isSuccess }] = useCreateRoomInviteMutation();
  const inviteLink = isSuccess && data ? `${baseUrl}/invite/${data.inviteCode}` : null;

  const endOfToday = dateFns.endOfDay(new Date());
  const minDate = dateFns.addMinutes(new Date(), 5);

  const validationSchema = yup.object({
    expirationDate: yup.date().nullable().min(minDate, t('dialog-invite-guest-expiration-date-error')),
  });

  const formik = useFormik({
    initialValues: {
      expirationDate: endOfToday,
    },
    validationSchema,
    onSubmit: (values) => submit(values.expirationDate),
  });

  const resetValues = () => {
    reset();
    formik.resetForm();
  };

  const onClose = () => {
    props.onClose && props.onClose({}, 'escapeKeyDown');
    resetValues();
  };

  const submit = async (expirationDate: Date | null) => {
    const id = roomId as unknown;

    createGuestLink({
      id: id as RoomId,
      expiration: expirationDate ? (expirationDate.toISOString() as DateTime) : undefined,
    })
      .unwrap()
      .catch((e) => {
        console.error(`failed to fetch invite. RoomId: ${id}, ExpirationDate: ${expirationDate}`, JSON.stringify(e));
        notifications.error(t('error-general'));
      });
  };

  const copyToClipboard = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink);
      notifications.success(t('global-copy-link-success'));
    }
  };

  return (
    <Dialog {...props} fullWidth maxWidth={'xs'} PaperComponent={Paper} aria-labelledby="dialog-invite-guest-title">
      <InviteDialogTitle id="dialog-invite-guest-title" onClose={onClose}>
        {t('dialog-invite-guest-title')}
      </InviteDialogTitle>
      {inviteLink ? (
        <Stack>
          <DialogContent>
            <Typography style={{ color: theme.palette.secondary.dark }} gutterBottom>
              {inviteLink}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={copyToClipboard} color="primary">
              {t('dialog-invite-guest-button-copy')}
            </Button>
          </DialogActions>
        </Stack>
      ) : (
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <FormWrapper
              label={t('dialog-invite-guest-expiration-date')}
              error={Boolean(formik.errors.expirationDate)}
              helperText={formik.errors.expirationDate ? t(`${formik.errors.expirationDate}`) : ''}
              stacked
            >
              <CustomDateTimePicker
                ampm={false}
                clearable
                disablePast
                clearText={t('dialog-invite-guest-no-expiration')}
                inputFormat="dd.MM.yyyy HH:mm"
                mask="__.__.____ __:__"
                value={formik.values.expirationDate}
                onChange={(selectedDate: Date | null) => formik.setFieldValue('expirationDate', selectedDate)}
                allowSameDateSelection
                dateRangeIcon={<MeetingsIcon />}
                placeholder={t('dialog-invite-guest-no-expiration')}
                minDateTime={minDate}
              />
            </FormWrapper>
          </DialogContent>
          <DialogActions>
            <Button type={'submit'} color="primary">
              {t('dialog-invite-guest-button-submit')}
            </Button>
          </DialogActions>
        </form>
      )}
    </Dialog>
  );
};

export default InviteGuestDialog;
