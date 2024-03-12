// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

/* eslint-disable jsx-a11y/no-autofocus */
import { Stack, Typography } from '@mui/material';
import { FormikProps } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '../../../commonComponents/TextField';
import { formikProps } from '../../../utils/formikUtils';

interface UserFeedbackFormFieldsProps<Values> {
  formik: FormikProps<Values>;
}

function UserFeedbackFormFields<Values>({ formik }: UserFeedbackFormFieldsProps<Values>) {
  const { t } = useTranslation();

  return (
    <Stack spacing={2}>
      <Typography>{t('glitchtip-crash-report-subtitle')}</Typography>
      <TextField {...formikProps('name', formik)} placeholder={t('glitchtip-crash-report-labelName')} autoFocus />
      <TextField {...formikProps('email', formik)} placeholder={t('glitchtip-crash-report-labelEmail')} />
      <TextField
        {...formikProps('comments', formik)}
        placeholder={t('glitchtip-crash-report-labelComments')}
        minRows={4}
        maxRows={6}
        multiline
      />
    </Stack>
  );
}

export default UserFeedbackFormFields;
