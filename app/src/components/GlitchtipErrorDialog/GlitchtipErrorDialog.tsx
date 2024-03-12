// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle as MuiDialogTitle,
  Paper,
  Stack,
  styled,
  ThemeProvider,
  Typography,
} from '@mui/material';
import { IconButton } from '@opentalk/common';
import { useFormik } from 'formik';
import { pick } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { CloseIcon } from '../../../../packages/common';
import { createOpenTalkTheme } from '../../assets/themes/opentalk';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { selectGlitchtipConfig, selectIsGlitchtipConfigured } from '../../store/slices/configSlice';
import { selectErrorDialogEvent, selectShowErrorDialog, setShowErrorDialog } from '../../store/slices/uiSlice';
import UserFeedbackFormFields from './fragments/UserFeedbackFormFields';

const DialogTitle = styled(MuiDialogTitle)({
  display: 'inline-flex',
  justifyContent: 'space-between',
  alignContent: 'center',
});

const StacktracePaper = styled(Paper)(({ theme }) => ({
  maxHeight: '100px',
  overflowY: 'auto',
  padding: theme.spacing(1),
}));

const GlitchtipErrorDialog = () => {
  const [dataHasBeenSent, setDataHasBeenSent] = useState(false);
  const showErrorDialog = useAppSelector(selectShowErrorDialog);
  const glitchtipConfig = useAppSelector(selectGlitchtipConfig);
  const activeErrorReporting = useAppSelector(selectIsGlitchtipConfigured);
  const event = useAppSelector(selectErrorDialogEvent);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  if (!activeErrorReporting) {
    return null;
  }

  const validationSchema = yup.lazy(({ email, name, comments }) => {
    if (Boolean(email) || Boolean(name) || Boolean(comments)) {
      return yup.object({
        email: yup
          .string()
          .trim()
          .email(t('field-error-email'))
          .required(t('field-error-required', { fieldName: t('glitchtip-crash-report-labelEmail') })),
        name: yup
          .string()
          .trim()
          .required(t('field-error-required', { fieldName: t('glitchtip-crash-report-labelName') })),
        comments: yup
          .string()
          .trim()
          .required(t('field-error-required', { fieldName: t('glitchtip-crash-report-labelComments') })),
      });
    }
    return yup.mixed().notRequired();
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      name: '',
      comments: '',
    },
    validationSchema: validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async ({ email, name, comments }) => {
      const url = new URL(glitchtipConfig?.dsn || '');

      const sdk = {
        name: 'sentry.javascript.browser',
        version: '7.60.0',
      };

      if (event) {
        await fetch(
          `${url.origin}/api${url.pathname}/envelope/?sentry_key=${url.username}&sentry_version=7&sentry_client=${sdk.name}/${sdk.version}`,
          {
            method: 'POST',
            body: `${JSON.stringify({
              ...pick(event, ['event_id', 'sent_at']),
              sdk,
              trace: event.sdkProcessingMetadata?.dynamicSamplingContext,
            })}
                    ${JSON.stringify({ type: 'event' })}
                    ${JSON.stringify(event)}`,
          }
        );

        if (Boolean(email) || Boolean(name) || Boolean(comments)) {
          const formData = new FormData();
          formData.append('name', name);
          formData.append('email', email);
          formData.append('comments', comments);
          await fetch(`${url.origin}/api/embed/error-page/?dsn=${glitchtipConfig?.dsn}&eventId=${event.event_id}`, {
            method: 'POST',
            body: formData,
          });
        }
        setDataHasBeenSent(true);
      }
    },
  });

  const handleCloseDialog = () => {
    dispatch(setShowErrorDialog({ showErrorDialog: false, event: undefined }));
  };

  const renderEventInfos = () =>
    event && (
      <>
        <Typography>{`${t('glitchtip-crash-report-error-subtitle')}:`}</Typography>
        <StacktracePaper elevation={7}>
          {event.exception?.values?.map(({ value, stacktrace }, index) => (
            <Stack spacing={1} key={index}>
              <Typography color={'error'}>{value}</Typography>
              {stacktrace?.frames?.map(({ filename, function: func, lineno, colno }, index) => (
                <Typography
                  key={index}
                  variant={'caption'}
                >{`${filename} in ${func} at line ${lineno}:${colno}`}</Typography>
              ))}
            </Stack>
          ))}
        </StacktracePaper>
      </>
    );

  const renderFormContent = () => (
    <>
      <DialogTitle>
        {t('glitchtip-crash-report-title')}
        <IconButton aria-label="close-button" onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          {renderEventInfos()}
          <UserFeedbackFormFields formik={formik} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant={'outlined'} color={'secondary'} onClick={handleCloseDialog}>
          {t('glitchtip-crash-report-labelAbort')}
        </Button>
        <Button color={'primary'} type={'submit'}>
          {t('glitchtip-crash-report-labelSubmit')}
        </Button>
      </DialogActions>
    </>
  );

  const renderDataHasSentContent = () => (
    <>
      <DialogTitle>
        {t('glitchtip-crash-report-send-successful-title')}
        <IconButton aria-label="close-button" onClick={handleCloseDialog}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>{t('glitchtip-crash-report-successMessage')}</DialogContent>
      <DialogActions>
        <Button color={'primary'} onClick={handleCloseDialog}>
          {t('glitchtip-crash-report-labelClose')}
        </Button>
      </DialogActions>
    </>
  );

  return (
    <ThemeProvider theme={createOpenTalkTheme('light')}>
      <Dialog
        TransitionProps={{
          onExited: () => setDataHasBeenSent(false),
        }}
        open={showErrorDialog}
        onBackdropClick={handleCloseDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          component: 'form',
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            formik.handleSubmit(event);
          },
        }}
        fullWidth
        maxWidth={'md'}
      >
        {dataHasBeenSent ? renderDataHasSentContent() : renderFormContent()}
      </Dialog>
    </ThemeProvider>
  );
};

export default GlitchtipErrorDialog;
