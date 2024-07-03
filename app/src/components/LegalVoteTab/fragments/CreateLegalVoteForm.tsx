// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Switch, Button, Grid, Typography, Box, Tooltip, Stack, Select, MenuItem } from '@mui/material';
import {
  BackIcon,
  CommonFormItem,
  DurationField,
  TextField,
  formikDurationFieldProps,
  getCurrentTimezone,
} from '@opentalk/common';
import { notifications, formikProps, formikSwitchProps, LegalVoteFormValues } from '@opentalk/common';
import { Form as FormikForm } from 'formik';
import { Step, FormikWizard } from 'formik-wizard-form';
import { FormikValues } from 'formik/dist/types';
import { isEmpty } from 'lodash';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import { start } from '../../../api/types/outgoing/legalVote';
import { saveLegalVoteFormValues, selectLegalVoteId } from '../../../store/slices/legalVoteSlice';
import ParticipantSelector, { AllowedParticipant } from './ParticipantSelector';

interface ICreateLegalVoteFormProps {
  initialValues?: LegalVoteFormValues;
  onClose: () => void;
  isCoffeeBreakActive: boolean;
}

const defaultInitialValues = {
  duration: 1,
  enableAbstain: true,
  autoClose: false,
  name: '',
  topic: '',
  allowedParticipants: [],
  subtitle: '',
  createPdf: true,
  kind: 'roll_call',
} as LegalVoteFormValues;

const Form = styled(FormikForm)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
  width: '100%',
});

const legalVoteOptions = ['roll_call', 'live_roll_call', 'pseudonymous'];

const CreateLegalVoteForm = ({
  initialValues = defaultInitialValues,
  onClose,
  isCoffeeBreakActive,
}: ICreateLegalVoteFormProps) => {
  const { t } = useTranslation();
  const legalVoteId = useRef(useSelector(selectLegalVoteId));
  const dispatch = useDispatch();

  const validationSchema = yup.object({
    name: yup
      .string()
      .trim()
      .max(150, t('legal-vote-form-input-error-max', { maxCharacters: 150 }))
      .required(t('legal-vote-input-title-required')),
    subtitle: yup
      .string()
      .trim()
      .max(255, t('legal-vote-form-input-error-max', { maxCharacters: 255 })),
    topic: yup
      .string()
      .trim()
      .max(500, t('legal-vote-form-input-error-max', { maxCharacters: 500 })),
    duration: yup.number().min(0).nullable(true).typeError(t('legal-vote-form-input-error-number')),
    createPdf: yup.bool(),
    kind: yup.string().oneOf(legalVoteOptions),
  });

  const saveFormValues = useCallback(
    (legalVoteFormValues: LegalVoteFormValues) => {
      if (isEmpty(legalVoteFormValues.topic) || isEmpty(legalVoteFormValues.name)) {
        notifications.error(t('legal-vote-save-form-error'));
      } else {
        dispatch(
          saveLegalVoteFormValues({
            id: legalVoteId.current,
            ...legalVoteFormValues,
          })
        );
        notifications.success(t('legal-vote-save-form-success'));
      }
    },
    [dispatch, t]
  );

  const participantValidationSchema = useMemo(() => {
    return yup.object({
      allowedParticipants: yup
        .array()
        .min(2, t('legal-vote-input-assignments-required'))
        .required(t('legal-vote-input-assignments-required')),
    });
  }, [t]);

  const steps: Step[] = React.useMemo(
    () => [
      {
        validationSchema: validationSchema,
        component: (formik) => (
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="body2">{t('legal-vote-form-duration')}</Typography>
                <DurationField
                  {...formikDurationFieldProps('duration', formik)}
                  durationOptions={[null, 1, 2, 5, 'custom']}
                  setFieldValue={formik.setFieldValue}
                  ButtonProps={{
                    size: 'small',
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <CommonFormItem
                {...formikSwitchProps('enableAbstain', formik)}
                control={<Switch color="primary" />}
                label={t('legal-vote-form-allow-abstain')}
                labelPlacement="start"
              />
            </Grid>
            <Grid item xs={12}>
              <CommonFormItem
                {...formikSwitchProps('autoClose', formik)}
                control={
                  <Tooltip title={`${t('legal-vote-form-auto-stop-tooltip')}`}>
                    <Switch color="primary" />
                  </Tooltip>
                }
                label={t('legal-vote-form-auto-stop')}
                labelPlacement="start"
              />
            </Grid>
            <Grid item xs={12}>
              <Select {...formikSwitchProps('kind', formik)} defaultValue={formik.initialValues['kind']} id="vote-kind">
                {legalVoteOptions.map((kind) => (
                  <MenuItem key={kind} value={kind}>
                    {t(`legal-vote-${kind}`)}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...formikProps('name', formik)}
                placeholder={t('legal-vote-input-name-placeholder')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...formikProps('subtitle', formik)}
                placeholder={t('legal-vote-input-subtitle-placeholder')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...formikProps('topic', formik)}
                minRows={4}
                maxRows={6}
                multiline
                placeholder={t('legal-vote-input-topic-placeholder')}
                fullWidth
              />
            </Grid>
          </Grid>
        ),
      },
      {
        component: () => <ParticipantSelector name="allowedParticipants" />,
        validationSchema: participantValidationSchema,
      },
    ],
    [t]
  );

  const onSubmit = (values: FormikValues) => {
    const allowedParticipants = values.allowedParticipants as AllowedParticipant[];
    dispatch(
      start.action({
        name: values.name,
        topic: values.topic,
        subtitle: values.subtitle,
        enableAbstain: values.enableAbstain,
        autoClose: values.autoClose,
        duration: values.duration ? values.duration * 60 : values.duration,
        allowedParticipants: Array.isArray(allowedParticipants)
          ? allowedParticipants.map((allowedParticipant) => allowedParticipant.id)
          : [],
        createPdf: values.createPdf,
        kind: values.kind,
        timezone: getCurrentTimezone(),
      })
    );
    onClose();
  };

  const renderButtons = (
    isLastStep: boolean,
    values: FormikValues,
    handleNext: React.MouseEventHandler<HTMLButtonElement> | undefined
  ) => (
    <Box display="flex" justifyContent="space-between" gap={2}>
      {!isLastStep && (
        <Button type="button" onClick={() => saveFormValues(values as LegalVoteFormValues)} fullWidth>
          {t('legal-vote-form-button-save')}
        </Button>
      )}

      <Button type="button" disabled={isCoffeeBreakActive} onClick={handleNext} fullWidth>
        {isLastStep ? t('poll-participant-list-button-start') : t('legal-vote-form-button-continue')}
      </Button>
    </Box>
  );

  return (
    <FormikWizard
      enableReinitialize={true}
      initialValues={initialValues}
      validateOnNext
      activeStepIndex={0}
      onSubmit={onSubmit}
      steps={steps}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ renderComponent, handlePrev, handleNext, values, currentStepIndex, isLastStep }) => {
        return (
          <Stack flex={1} overflow="hidden" spacing={1}>
            <Stack flex={1} spacing={1} overflow="hidden">
              <Stack alignItems="flex-start" spacing={1}>
                <Button
                  variant="text"
                  onClick={currentStepIndex && currentStepIndex > 0 ? handlePrev : onClose}
                  startIcon={<BackIcon />}
                  size="small"
                >
                  {t('legal-vote-button-back')}
                </Button>
                <Typography variant="h2">
                  {initialValues?.id !== undefined
                    ? t('legal-vote-header-title-update')
                    : t('legal-vote-header-title-create')}
                </Typography>
              </Stack>

              <Form>{renderComponent()}</Form>
            </Stack>

            {renderButtons(isLastStep, values, handleNext)}
          </Stack>
        );
      }}
    </FormikWizard>
  );
};

export default CreateLegalVoteForm;
