// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Switch, Typography } from '@mui/material';
import { Seconds } from '@opentalk/common';
import { FormikValues, useFormik } from 'formik';
import React from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { startTimer } from '../../../api/types/outgoing/timer';
import { TextField } from '../../../commonComponents';
import CommonFormItem from '../../../commonComponents/CommonFormItem';
import DurationField from '../../../commonComponents/DurationField';
import { useAppDispatch } from '../../../hooks';
import { formikCustomFieldProps, formikProps, formikSwitchProps } from '../../../utils/formikUtils';

const Form = styled('form')({
  display: 'flex',
  flex: 1,
});

const Title = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const CreateTimerForm = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const validationSchema = yup.object({
    //TODO: Change to .positive() (which also accepts 0) after DurationField changes. Also Change dispatched duration conditional logic (line 43) to match.
    duration: yup.number().nullable(true),
  });

  const formik = useFormik({
    initialValues: { duration: 1, title: undefined, enableReadyCheck: true },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values: FormikValues, { resetForm, setErrors, setTouched }) => {
      dispatch(
        startTimer.action({
          title: values.title,
          enableReadyCheck: values.enableReadyCheck,
          duration: values.duration <= 0 ? undefined : ((values.duration * 60) as Seconds),
        })
      );
      setErrors({});
      setTouched({});
      resetForm();
    },
  });

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Stack justifyContent={'space-between'} sx={{ height: '100%', width: '100%' }}>
        <Stack alignItems={'flex-start'} sx={{ width: '100%' }} spacing={2}>
          <Title variant={'h2'}>{t('timer-header-title')}</Title>
          <Typography>{t('global-duration')}</Typography>
          <DurationField
            {...formikCustomFieldProps('duration', formik)}
            durationOptions={[0, 1, 2, 5, 'custom']}
            ButtonProps={{
              size: 'small',
            }}
          />
          <TextField {...formikProps('title', formik)} placeholder={t('global-title')} fullWidth />
          <Stack sx={{ width: '100%' }} spacing={1}>
            <CommonFormItem
              {...formikSwitchProps('enableReadyCheck', formik)}
              control={<Switch color="primary" />}
              label={t('timer-form-ready-to-continue')}
              labelPlacement="start"
            />
          </Stack>
        </Stack>

        <Button type="submit">{t('timer-form-button-submit')}</Button>
      </Stack>
    </Form>
  );
};

export default CreateTimerForm;
