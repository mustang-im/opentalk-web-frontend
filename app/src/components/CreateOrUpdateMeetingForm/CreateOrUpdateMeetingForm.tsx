// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  Collapse,
  FormControlLabel,
  Grid,
  MenuItem,
  Stack,
  styled,
  Switch,
  Typography,
  Tooltip,
} from '@mui/material';
import { ForwardIcon } from '@opentalk/common';
import { CreateEventPayload, Event, isTimelessEvent, UpdateEventPayload, DateTime } from '@opentalk/rest-api-rtk-query';
import { addDays, addMinutes, format, formatRFC3339, isBefore, isEqual } from 'date-fns';
import { useFormik } from 'formik';
import { FormikValues } from 'formik/dist/types';
import { get, isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import {
  useCreateEventMutation,
  useCreateRoomInviteMutation,
  useLazyGetEventsQuery,
  useUpdateEventMutation,
} from '../../api/rest';
import { FormWrapper, LimitedTextField, Select } from '../../commonComponents';
import { formikCustomFieldProps, formikMinimalProps, formikProps } from '../../utils/formikUtils';
import getReferrerRouterState from '../../utils/getReferrerRouterState';
import roundToNearest30 from '../../utils/roundToNearest30';
import roundToUpper30 from '../../utils/roundToUpper30';
import notifications from '../../utils/snackBarUtils';
import { isInvalidDate } from '../../utils/typeGardUtils';
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog';
import TimePickers from './fragment/TimePickers';

interface CreateOrUpdateMeetingFormProps {
  existingEvent?: Event;
  onForwardButtonClick?: () => void;
}

const enum IntervalEnum {
  NONE = '-',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BI-WEEKLY',
  MONTHLY = 'MONTHLY',
}

const Form = styled('form')({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const DEFAULT_MINUTES_DIFFERENCE = 30;
const GAP = 5;
const MAX_CHARACTERS_TITLE = 255;
const MAX_CHARACTERS_PASSWORD = 255;
const MAX_CHARACTERS_DESCRIPTION = 4096;

const defaultStartDate = roundToUpper30();
const defaultEndDate = addMinutes(defaultStartDate, DEFAULT_MINUTES_DIFFERENCE);

const CreateOrUpdateMeetingForm = ({ existingEvent, onForwardButtonClick }: CreateOrUpdateMeetingFormProps) => {
  const { t } = useTranslation();
  const [createEvent, { isLoading: createEventIsLoading }] = useCreateEventMutation();
  const [updateEvent, { isLoading: updateEventIsLoading }] = useUpdateEventMutation();
  const [checkForEvents] = useLazyGetEventsQuery();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [createRoomInvite] = useCreateRoomInviteMutation();
  const navigate = useNavigate();

  const validationSchema = yup.object({
    title: yup
      .string()
      .trim()
      .max(MAX_CHARACTERS_TITLE, t('form-validation-max-characters', { maxCharacters: MAX_CHARACTERS_TITLE }))
      .required(t('field-error-required', { fieldName: t('dashboard-meeting-textfield-title') })),
    password: yup
      .string()
      .trim()
      .max(MAX_CHARACTERS_PASSWORD, t('form-validation-max-characters', { maxCharacters: MAX_CHARACTERS_PASSWORD })),
    description: yup
      .string()
      .trim()
      .max(
        MAX_CHARACTERS_DESCRIPTION,
        t('form-validation-max-characters', { maxCharacters: MAX_CHARACTERS_DESCRIPTION })
      ),
    startDate: yup
      .string()
      .test('is required', t('meeting-required-start-date'), function (startDate) {
        if (!startDate || startDate.trim() === '') {
          return false;
        }
        return true;
      })
      .test('is valid', t('meeting-invalid-start-date'), function (startDate) {
        return !isInvalidDate(new Date(startDate as string));
      })
      .test('is in the future', t('dashboard-meeting-date-field-error-future'), function (startDate) {
        if (this.parent.isScheduled && startDate && new Date(startDate) < new Date()) {
          return false;
        }
        return true;
      })
      .test('is before end date', t('dashboard-meeting-date-field-error-duration'), function (startDate) {
        if (this.parent.isScheduled && startDate) {
          return startDate < this.parent.endDate;
        }
        return true;
      }),
    endDate: yup
      .string()
      .required(t('dashboard-meeting-date-field-error-invalid-value'))
      .test('is required', t('meeting-required-end-date'), function (endDate) {
        if (!endDate || endDate.trim() === '') {
          return false;
        }
        return true;
      })
      .test('is valid', t('meeting-invalid-end-date'), function (endDate) {
        return !isInvalidDate(new Date(endDate as string));
      })
      .test('if after start date', t('dashboard-meeting-date-field-error-duration'), function (endDate) {
        if (this.parent.isScheduled && endDate) {
          return endDate > this.parent.startDate;
        }
        return true;
      }),
    isAdhoc: yup.boolean().optional(),
  });

  const mapRruleToInterval = (timeIndependent: boolean, interval: string): string | undefined => {
    if (timeIndependent || interval === IntervalEnum.NONE) return undefined;
    const date = new Date(formik.values.startDate);
    const end = addDays(date, 180);

    if (interval === IntervalEnum.BIWEEKLY) {
      return 'RRULE:FREQ=WEEKLY;INTERVAL=2;UNTIL=' + format(end, "yyyyMMdd'T'HHmmss'Z'");
    }
    return `RRULE:FREQ=${interval};UNTIL=` + format(end, "yyyyMMdd'T'HHmmss'Z'");
  };

  const mapIntervalToRule = (rule: string) => {
    if (rule.indexOf('FREQ=DAILY') > 0) {
      return IntervalEnum.DAILY;
    }
    if (rule.indexOf('FREQ=WEEKLY') > 0 && rule.indexOf('INTERVAL=2') > 0) {
      return IntervalEnum.BIWEEKLY;
    }
    if (rule.indexOf('FREQ=WEEKLY') > 0) {
      return IntervalEnum.WEEKLY;
    }
    if (rule.indexOf('FREQ=MONTHLY') > 0) {
      return IntervalEnum.MONTHLY;
    }
    return IntervalEnum.NONE;
  };

  const intervals = [
    {
      label: t('dashboard-meeting-recurrence-none'),
      value: IntervalEnum.NONE,
    },
    { label: t('dashboard-meeting-recurrence-daily'), value: IntervalEnum.DAILY },
    { label: t('dashboard-meeting-recurrence-weekly'), value: IntervalEnum.WEEKLY },
    { label: t('dashboard-meeting-recurrence-bi-weekly'), value: IntervalEnum.BIWEEKLY },
    { label: t('dashboard-meeting-recurrence-monthly'), value: IntervalEnum.MONTHLY },
  ];

  const formik = useFormik({
    initialValues: {
      title: existingEvent?.title,
      description: existingEvent?.description || '',
      waitingRoom: existingEvent?.room.waitingRoom || false,
      password: existingEvent?.room.password?.trim() || undefined,
      isScheduled: !existingEvent?.isTimeIndependent,
      startDate:
        (existingEvent && !isTimelessEvent(existingEvent) && existingEvent.startsAt?.datetime) ||
        formatRFC3339(defaultStartDate),
      endDate:
        (existingEvent && !isTimelessEvent(existingEvent) && existingEvent.endsAt?.datetime) ||
        formatRFC3339(defaultEndDate),
      recurrencePattern:
        existingEvent && existingEvent.recurrencePattern?.length > 0
          ? mapIntervalToRule(existingEvent.recurrencePattern[0])
          : IntervalEnum.NONE,
      isAdhoc: existingEvent && Boolean(existingEvent.isAdhoc),
    },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (existingEvent) {
        await handleUpdateEvent(values);
      } else {
        await handleCreateEvent(values);
      }
    },
  });

  const onChangeStartDate = async (date: Date | null) => {
    if (!date) {
      await formik.setFieldValue('startDate', '');
      await formik.validateField('startDate');
      return;
    }

    if (isInvalidDate(date)) {
      await formik.setFieldValue('startDate', String(date));
      await formik.validateField('startDate');
      return;
    }

    await formik.setValues((values) => ({
      ...values,
      startDate: date.toISOString(),
      endDate: roundToUpper30(date).toISOString(),
    }));
    await formik.validateField('startDate');
  };

  const onChangeEndDate = async (endDate: Date | null) => {
    if (!endDate) {
      await formik.setFieldValue('endDate', '');
      await formik.validateField('endDate');
      return;
    }

    if (isInvalidDate(endDate)) {
      await formik.setFieldValue('endDate', String(endDate));
      await formik.validateField('endDate');
      return;
    }

    const startDate = new Date(get(formik.values, 'startDate', ''));
    if ((endDate && isBefore(endDate, startDate)) || (endDate && isEqual(startDate, endDate))) {
      endDate.setMinutes(endDate.getMinutes() - (DEFAULT_MINUTES_DIFFERENCE + GAP)); // correct end date by substracting 30m + gap (to cover the case when dates are equals and help rounding latter on)
      let newStartDate = roundToNearest30(new Date(endDate.setMinutes(endDate.getMinutes() - GAP))); // round to nearest30 - gap to apply 5 min diff
      if (isBefore(newStartDate, new Date()) || isEqual(newStartDate, new Date())) {
        newStartDate = new Date();
        await formik.setFieldValue('startDate', newStartDate.toISOString());
      }
    }
    await formik.setFieldValue('endDate', endDate.toISOString());
    await formik.validateField('endDate');
  };

  const createPayload = (values: FormikValues): CreateEventPayload | UpdateEventPayload => {
    const pattern: string | undefined = mapRruleToInterval(!values.isScheduled, values.recurrencePattern);
    let payload: CreateEventPayload | UpdateEventPayload = {
      title: values.title.trim() || '',
      description: values.description.trim() || '',
      waitingRoom: values.waitingRoom,
      password: values.password?.trim() !== '' ? values.password?.trim() : null,
      isTimeIndependent: !values.isScheduled,
      recurrencePattern: pattern ? [pattern] : [],
      isAdhoc: values.isAdhoc || false,
    };

    if (values.isScheduled) {
      payload = {
        ...payload,
        startsAt: {
          datetime: formatRFC3339(new Date(values.startDate)),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        endsAt: {
          datetime: formatRFC3339(new Date(values.endDate)),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
        isAllDay: false,
      };
    }

    return payload;
  };

  const handleCreateEvent = async (values: FormikValues) => {
    const payload = createPayload(values) as CreateEventPayload;
    try {
      const event = await createEvent(payload).unwrap();
      await createRoomInvite({ id: event.room.id }).unwrap();
      notifications.success(t('dashboard-meeting-notification-success-create', { event: event.title }));
      navigate(`/dashboard/meetings/update/${event.id}/1`, { state: { ...getReferrerRouterState(window.location) } });
    } catch (err) {
      notifications.error(t('dashboard-meeting-notification-error'));
    }
  };

  const handleUpdateEvent = async (values: FormikValues) => {
    const payload = createPayload(values) as UpdateEventPayload;
    try {
      if (existingEvent) {
        const event = await updateEvent({
          eventId: existingEvent.id,
          ...payload,
        }).unwrap();
        notifications.success(t('dashboard-meeting-notification-success-edit', { event: event.title }));
      }
    } catch (err) {
      notifications.error(t('dashboard-meeting-notification-error'));
    }
  };

  const handleConfirmSameTimeEvents = () => {
    setShowConfirmDialog(false);
    formik.handleSubmit();
  };

  const checkForExistingEvents = async () => {
    if (formik.values.isScheduled) {
      const existingMeetings = await checkForEvents({
        perPage: 1,
        timeMin: formik.values.startDate as DateTime,
        timeMax: formik.values.endDate as DateTime,
      });

      if (!isEmpty(existingMeetings?.data?.data)) {
        return setShowConfirmDialog(true);
      }
    }

    formik.handleSubmit();
  };

  return (
    <>
      <Form onSubmit={formik.handleSubmit}>
        <Stack spacing={2}>
          <LimitedTextField
            {...formikProps('title', formik)}
            label={t('dashboard-meeting-textfield-title')}
            placeholder={t('dashboard-meeting-textfield-title-placeholder')}
            fullWidth
            maxCharacters={MAX_CHARACTERS_TITLE}
          />

          <LimitedTextField
            {...formikProps('description', formik)}
            label={t('dashboard-meeting-textfield-details')}
            fullWidth
            variant="standard"
            multiline
            maxRows={5}
            placeholder={t('dashboard-meeting-textfield-details-placeholder')}
            maxCharacters={MAX_CHARACTERS_DESCRIPTION}
          />

          <LimitedTextField
            {...formikProps('password', formik)}
            label={t('dashboard-direct-meeting-password-label')}
            fullWidth
            placeholder={t('dashboard-direct-meeting-password-placeholder')}
            maxCharacters={MAX_CHARACTERS_PASSWORD}
          />

          <Stack>
            <Typography pb={1.3}> {t('dashboard-meeting-date-and-time')}</Typography>
            <Tooltip title={t('dashboard-meeting-time-independent-tooltip') || ''}>
              <FormControlLabel
                checked={formik.values.isScheduled}
                control={<Switch {...formikMinimalProps('isScheduled', formik)} />}
                label={t(`dashboard-meeting-time-independent-${formik.values.isScheduled ? 'no' : 'yes'}`)}
                sx={{ margin: 0, gap: 1, verticalAlign: 'baseline', width: 'max-content' }}
              />
            </Tooltip>
          </Stack>

          <Collapse orientation="vertical" in={formik.values.isScheduled} unmountOnExit mountOnEnter>
            <Grid container columnSpacing={{ xs: 2, sm: 5 }}>
              <Grid item xs={12} sm={6}>
                <FormWrapper label={t('dashboard-meeting-date-from')} fullWidth>
                  <TimePickers
                    {...formikCustomFieldProps('startDate', { ...formik, handleChange: onChangeStartDate as never })}
                  />
                </FormWrapper>
              </Grid>
              <Grid item xs={12} sm={6} mt={{ xs: 2, sm: 0 }}>
                <FormWrapper label={t('dashboard-meeting-date-to')} fullWidth>
                  <TimePickers
                    {...formikCustomFieldProps('endDate', { ...formik, handleChange: onChangeEndDate as never })}
                  />
                </FormWrapper>
              </Grid>

              <Grid item xs={12} sm={12} mt={2}>
                <Select {...formikProps('recurrencePattern', formik)}>
                  {intervals.map((entry) => (
                    <MenuItem key={entry.value} value={entry.value}>
                      {entry.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Collapse>

          <Stack>
            <Typography pb={1.3}>{t('waiting-room-participant-label')}</Typography>
            <FormControlLabel
              checked={formik.values.waitingRoom}
              control={<Switch {...formikMinimalProps('waitingRoom', formik)} />}
              label={t(`dashboard-meeting-switch-${formik.values.waitingRoom ? 'enabled' : 'disabled'}`)}
              sx={{ margin: 0, gap: 1, verticalAlign: 'baseline', width: 'max-content' }}
            />
          </Stack>
        </Stack>
        <Grid container item justifyContent={'space-between'} spacing={2}>
          <Grid item xs={12} sm={'auto'}>
            {existingEvent && (
              <Button variant={'text'} color={'secondary'} endIcon={<ForwardIcon />} onClick={onForwardButtonClick}>
                {t('dashboard-meeting-to-step', { step: 2 })}
              </Button>
            )}
          </Grid>
          <Grid container item xs={12} sm={'auto'} spacing={3} flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
            {!existingEvent && (
              <Grid item>
                <Button component={Link} to={'/dashboard/'} variant={'outlined'} color={'secondary'} fullWidth>
                  {t('dashboard-direct-meeting-button-cancel')}
                </Button>
              </Grid>
            )}
            <Grid item>
              <Button
                onClick={checkForExistingEvents}
                fullWidth
                disabled={createEventIsLoading || updateEventIsLoading}
              >
                {t(`global-save${existingEvent ? '-changes' : ''}`)}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Form>
      <ConfirmDialog
        open={showConfirmDialog}
        onConfirm={handleConfirmSameTimeEvents}
        onCancel={() => setShowConfirmDialog(false)}
        title={t('dashboard-create-meeting-dialog-title')}
        message={t('dashboard-create-meeting-dialog-message')}
        submitButtonText={t('dashboard-create-meeting-dialog-ok')}
        cancelButtonText={t('dashboard-create-meeting-dialog-cancel')}
      />
    </>
  );
};

export default CreateOrUpdateMeetingForm;
