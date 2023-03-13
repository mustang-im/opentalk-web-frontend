// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid, styled, Switch, Typography, Tooltip } from '@mui/material';
import { Seconds, BackIcon, notifications } from '@opentalk/common';
import { formikDurationFieldProps, formikProps, formikSwitchProps, DurationField } from '@opentalk/common';
import { FormikValues, Formik } from 'formik';
import i18next from 'i18next';
import { isEmpty } from 'lodash';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { start } from '../../../api/types/outgoing/poll';
import CommonFormItem from '../../../commonComponents/CommonFormItem';
import TextField from '../../../commonComponents/TextField';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectParticipantsTotal } from '../../../store/slices/participantsSlice';
import { PollFormValues, savePollFormValues } from '../../../store/slices/pollSlice';
import AnswersFormElement from './AnswersFormElement';

interface ICreatePollForm {
  onClose: () => void;
  initialValues?: PollFormValues;
}

const defaultInitialValues: PollFormValues = {
  choices: [],
  topic: '',
  duration: 1,
  live: false,
};

const GridContainer = styled(Grid)({
  flex: 1,
  maxWidth: '100%',
});

const Form = styled('form')({
  display: 'flex',
  flex: 1,
});

const Title = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const validationSchema = yup.object({
  topic: yup
    .string()
    .trim()
    .max(500, i18next.t('poll-form-input-error-max', { max: 500 }))
    .required(i18next.t('legal-vote-input-topic-required')),
  duration: yup.number().positive().nullable(true).typeError(i18next.t('poll-form-input-error-number')),
  choices: yup
    .array()
    .of(yup.string().trim().required(i18next.t('poll-form-input-error-choice')))
    .min(2, i18next.t('poll-form-input-error-choices'))
    .required(i18next.t('poll-form-input-error-choices')),
});

const CreatePollForm = ({ initialValues = defaultInitialValues, onClose }: ICreatePollForm) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const totalParticipants = useAppSelector(selectParticipantsTotal);
  const saveFormValues = useCallback(
    (values: PollFormValues) => {
      if (isEmpty(values.topic)) {
        notifications.error(t('poll-save-form-error'));
      } else {
        dispatch(savePollFormValues(values));
        notifications.success(t('poll-save-form-success'));
      }
    },
    [dispatch, t]
  );
  const onSubmit = (values: FormikValues) => {
    if (totalParticipants < 2) {
      return notifications.warning(t('poll-save-form-warning'));
    }
    dispatch(
      start.action({
        topic: values.topic,
        duration: (values.duration * 60) as Seconds,
        live: values.live,
        choices: values.choices,
      })
    );
    onClose();
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validateOnBlur={false}
      validateOnChange={false}
      validationSchema={validationSchema}
    >
      {(formik) => (
        <Form onSubmit={formik.handleSubmit}>
          <GridContainer container alignContent={'space-between'}>
            <Grid item zeroMinWidth>
              <Grid container>
                <Grid item>
                  <Button variant={'text'} onClick={onClose} startIcon={<BackIcon />}>
                    {t('poll-button-back')}
                  </Button>
                  <Title variant={'h2'}>
                    {initialValues?.id !== undefined ? t('poll-header-title-update') : t('poll-header-title-create')}
                  </Title>
                </Grid>
                <Grid item xs={12} zeroMinWidth>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <DurationField
                        {...formikDurationFieldProps('duration', formik)}
                        durationOptions={[1, 2, 5, 'custom']}
                        ButtonProps={{
                          size: 'small',
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CommonFormItem
                        {...formikSwitchProps('live', formik)}
                        control={
                          <Tooltip title={`${t('poll-form-switch-live-tooltip')}`}>
                            <Switch color="primary" />
                          </Tooltip>
                        }
                        label={t('poll-form-switch-live')}
                        labelPlacement="start"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        {...formikProps('topic', formik)}
                        placeholder={t('poll-input-topic-placeholder')}
                        fullWidth
                        minRows={4}
                        maxRows={6}
                        multiline
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <AnswersFormElement name={'choices'} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs mt={2}>
              <Grid container justifyContent={'space-between'} spacing={2}>
                <Grid item xs={6}>
                  <Button type="button" onClick={() => saveFormValues(formik.values)}>
                    {t('poll-form-button-save')}
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button type="submit">{t('poll-form-button-submit')}</Button>
                </Grid>
              </Grid>
            </Grid>
          </GridContainer>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePollForm;
