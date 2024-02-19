// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';
import { generateUniquedId } from '@opentalk/common';
import { FormWrapper } from '@opentalk/common';
import { formikDateTimePickerProps } from '@opentalk/common';
import { FormikProps } from 'formik';
import { useTranslation } from 'react-i18next';

import DateTimePicker from '../../DateTimePicker';
import { CreateOrUpdateMeetingFormikValues } from '../CreateOrUpdateMeetingForm';

type DashboardDateTimePickerProps = {
  id?: string;
  onChange(date: Date): void;
  formik: FormikProps<CreateOrUpdateMeetingFormikValues>;
  type: 'start' | 'end';
};

export const DashboardDateTimePicker = (props: DashboardDateTimePickerProps) => {
  const id = props.id || generateUniquedId();
  const { t } = useTranslation();

  return (
    <FormWrapper label={t(`dashboard-meeting-date-${props.type}`)} fullWidth htmlFor={id}>
      <Stack spacing={2}>
        <DateTimePicker
          {...formikDateTimePickerProps(`${props.type}Date`, {
            ...props.formik,
            handleChange: props.onChange as never,
          })}
          id={id}
        />
      </Stack>
    </FormWrapper>
  );
};
