// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Switch, Typography } from '@mui/material';
import { formikDurationFieldProps, formikProps, formikSwitchProps, DurationField } from '@opentalk/common';
import { DurationValueOptions } from '@opentalk/common/components/DurationField';
import { FormikValues, useFormik } from 'formik';
import { useCallback, useEffect, useMemo } from 'react';
import { TFunction, useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { TimerKind, startTimer, TimerStyle } from '../../../api/types/outgoing/timer';
import { TextField } from '../../../commonComponents';
import CommonFormItem from '../../../commonComponents/CommonFormItem';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectTimerRunning } from '../../../store/slices/timerSlice';

const Form = styled('form')({
  display: 'flex',
  flex: 1,
});

const Title = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

interface Texts {
  header: string;
  button: string;
}

interface TimerState {
  texts: Texts;
  durationOptions: Array<DurationValueOptions>;
  defaultValue: number;
}

const getTimerState = (timerStyle: TimerStyle, t: TFunction<'translation', undefined>): TimerState => {
  if (timerStyle === TimerStyle.CoffeeBreak) {
    return {
      texts: {
        header: t('coffee-break-header-title'),
        button: t('coffee-break-form-button-submit'),
      },
      durationOptions: [5, 10, 15, 30, 'custom'],
      defaultValue: 5,
    };
  } else {
    return {
      texts: {
        header: t('timer-header-title'),
        button: t('timer-form-button-submit'),
      },
      durationOptions: [null, 1, 2, 5, 'custom'],
      defaultValue: 1,
    };
  }
};

const CreateTimerForm = ({ timerStyle }: { timerStyle: TimerStyle }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isTimerRunning = useAppSelector(selectTimerRunning);

  const { texts, durationOptions, defaultValue } = useMemo(() => getTimerState(timerStyle, t), [timerStyle, t]);

  const getTimerForStart = useCallback(
    (values: FormikValues) => {
      return {
        kind: !values.duration ? TimerKind.Stopwatch : TimerKind.Countdown,
        style: timerStyle,
      };
    },
    [timerStyle]
  );

  const validationSchema = yup.object({
    duration: yup.number().nullable(true),
  });

  const formik = useFormik({
    initialValues: { duration: defaultValue, title: undefined, enableReadyCheck: true },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values: FormikValues) => {
      dispatch(
        startTimer.action({
          title: values.title,
          enableReadyCheck: values.enableReadyCheck,
          duration: values.duration ? values.duration * 60 : values.duration,
          ...getTimerForStart(values),
        })
      );
    },
  });

  useEffect(() => {
    if (defaultValue) {
      formik.setValues({ ...formik.values, duration: defaultValue });
    }
  }, [defaultValue]);

  const cleanForm = useCallback(() => {
    const { setErrors, setTouched, resetForm } = formik;
    setErrors({});
    setTouched({});
    resetForm();
  }, []);

  useEffect(() => {
    if (isTimerRunning) {
      cleanForm();
    }
    return () => {
      cleanForm();
    };
  }, [isTimerRunning]);

  return (
    <Form onSubmit={formik.handleSubmit}>
      <Stack justifyContent={'space-between'} sx={{ height: '100%', width: '100%' }}>
        <Stack alignItems={'flex-start'} sx={{ width: '100%' }} spacing={2}>
          <Title variant={'h2'}>{texts?.header}</Title>

          <Typography>{t('global-duration')}</Typography>

          <DurationField
            {...formikDurationFieldProps('duration', formik, defaultValue)}
            durationOptions={durationOptions}
            ButtonProps={{
              size: 'small',
            }}
          />

          {timerStyle === TimerStyle.Normal && (
            <>
              <TextField {...formikProps('title', formik)} placeholder={t('global-title')} fullWidth />
              <Stack sx={{ width: '100%' }} spacing={1}>
                <CommonFormItem
                  {...formikSwitchProps('enableReadyCheck', formik)}
                  control={<Switch color="primary" />}
                  label={t('timer-form-ready-to-continue')}
                  labelPlacement="start"
                />
              </Stack>
            </>
          )}
        </Stack>

        <Button type="submit">{texts?.button}</Button>
      </Stack>
    </Form>
  );
};

export default CreateTimerForm;
