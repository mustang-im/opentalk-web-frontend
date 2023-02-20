// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Switch, Typography } from '@mui/material';
import { Seconds } from '@opentalk/common';
import { FormikValues, useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { TimerKind, startTimer, TimerStyle } from '../../../api/types/outgoing/timer';
import { TextField } from '../../../commonComponents';
import CommonFormItem from '../../../commonComponents/CommonFormItem';
import DurationField from '../../../commonComponents/DurationField';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectTimerRunning } from '../../../store/slices/timerSlice';
import { formikCustomFieldProps, formikProps, formikSwitchProps } from '../../../utils/formikUtils';

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

type DurationOption = number | string;

interface CoffeBreakState {
  texts: Texts;
  durationOptions: DurationOption[];
  defaultValue: number;
}

const useCreateCoffeeBreakForm = (timerStyle: TimerStyle) => {
  const { t } = useTranslation();
  const [state, setState] = useState<CoffeBreakState>();

  useEffect(() => {
    switch (timerStyle) {
      case TimerStyle.CoffeeBreak: {
        setState({
          texts: {
            header: t('coffee-break-header-title'),
            button: t('coffee-break-form-button-submit'),
          },
          durationOptions: [5, 10, 15, 30, 'custom'],
          defaultValue: 5,
        });
        break;
      }

      case TimerStyle.Normal: {
        setState({
          texts: {
            header: t('timer-header-title'),
            button: t('timer-form-button-submit'),
          },
          durationOptions: [0, 1, 2, 5, 'custom'],
          defaultValue: 1,
        });
        break;
      }
    }
  }, [timerStyle]);

  const getTimerForStart = useCallback(
    (values: FormikValues) => {
      return {
        kind: !values.duration ? TimerKind.Stopwatch : TimerKind.Countdown,
        style: timerStyle,
      };
    },
    [timerStyle]
  );

  return { ...state, getTimerForStart };
};

const CreateTimerForm = ({ timerStyle }: { timerStyle: TimerStyle }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isTimerRunning = useAppSelector(selectTimerRunning);
  const { texts, getTimerForStart, durationOptions, defaultValue } = useCreateCoffeeBreakForm(timerStyle);

  const validationSchema = yup.object({
    duration: yup.number().nullable(true),
  });

  const formik = useFormik({
    initialValues: { duration: 1, title: undefined, enableReadyCheck: true },
    validationSchema,
    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: (values: FormikValues) => {
      dispatch(
        startTimer.action({
          title: values.title,
          enableReadyCheck: values.enableReadyCheck,
          duration: values.duration <= 0 ? undefined : ((values.duration * 60) as Seconds),
          ...getTimerForStart(values),
        })
      );
    },
  });

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
            {...formikCustomFieldProps('duration', formik)}
            durationOptions={durationOptions}
            ButtonProps={{
              size: 'small',
            }}
            value={defaultValue}
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
