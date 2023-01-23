// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled, Switch } from '@mui/material';
import { useFormikContext } from 'formik';
import { get } from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CommonFormItem from '../../../commonComponents/CommonFormItem';
import DurationField from '../../../commonComponents/DurationField';
import TextField from '../../../commonComponents/TextField';
import { useAppSelector } from '../../../hooks';
import { selectParticipantsTotal } from '../../../store/slices/participantsSlice';
import { formikCustomFieldProps, formikProps, formikSwitchProps } from '../../../utils/formikUtils';
import TextWithDivider from '../../TextWithDivider';

const CreateButton = styled(Button)({
  alignSelf: 'flex-start',
});

const DurationFieldAligned = styled(DurationField)({
  alignSelf: 'flex-start',
});

const NumberInput = styled(TextField)(({ theme }) => ({
  maxWidth: '4rem',
  '& input': {
    paddingRight: theme.spacing(0),
    textAlign: 'center',
  },
}));

interface ICreateByParticipantsFormProps {
  handleNext: () => void;
  formName?: string;
}

const CreateByParticipantsForm = ({ handleNext, formName }: ICreateByParticipantsFormProps) => {
  const { t } = useTranslation();
  const participantsTotal = useAppSelector(selectParticipantsTotal);
  const { ...formik } = useFormikContext();

  const getFormName = (name: string) => (formName ? `${formName}.${name}` : name);
  const participantsPerRoom = get(formik.values, getFormName('participantsPerRoom'));
  const rooms = Math.max(2, Math.floor(participantsTotal / participantsPerRoom));
  const maxParticipantsPerRoom = Math.max(2, Math.floor(participantsTotal / 2));

  return (
    <Stack spacing={2} direction="column" justifyContent="flex-start">
      <DurationFieldAligned
        {...formikCustomFieldProps(getFormName('duration'), formik)}
        ButtonProps={{
          size: 'small',
        }}
      />
      <CommonFormItem
        {...formikProps(getFormName('participantsPerRoom'), formik)}
        label={t('breakout-room-form-field-participants-per-room')}
        labelPlacement="start"
        control={<NumberInput type={'number'} inputProps={{ min: 2, max: maxParticipantsPerRoom }} />}
      />
      <CommonFormItem
        {...formikSwitchProps(getFormName('distribution'), formik)}
        control={<Switch color="primary" />}
        label={t('breakout-room-form-field-random-distribution')}
        labelPlacement="start"
      />
      <CommonFormItem
        {...formikSwitchProps(getFormName('includeModerators'), formik)}
        control={<Switch color="primary" />}
        label={t('breakout-room-form-field-include-moderators')}
        labelPlacement="start"
      />
      <TextWithDivider variant={'caption'}>
        {t('breakout-room-rooms-created-by-participants', { rooms })}
      </TextWithDivider>
      <CreateButton size={'small'} onClick={handleNext}>
        {t('breakout-room-create-button')}
      </CreateButton>
    </Stack>
  );
};

export default CreateByParticipantsForm;
