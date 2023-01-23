// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid, styled, Switch as MuiSwitch } from '@mui/material';
import { FormikProps } from 'formik';
import { FormikValues } from 'formik/dist/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

import CommonFormItem from '../../../commonComponents/CommonFormItem';
import DurationField from '../../../commonComponents/DurationField';
import { formikCustomFieldProps, formikSwitchProps } from '../../../utils/formikUtils';

const GridItem = styled(Grid)({
  display: 'inline-flex',
});

const Switch = styled(MuiSwitch)(({ theme }) => ({
  marginRight: theme.spacing(-1),
}));

interface ICreateByGroupsFormProps {
  formik: FormikProps<FormikValues>;
  handleNext: () => void;
  formName: string;
}

const CreateByGroupsForm = ({ formik, handleNext, formName }: ICreateByGroupsFormProps) => {
  const { t } = useTranslation();

  const getFormName = (name: string) => (formName ? `${formName}.${name}` : name);

  return (
    <Grid container direction={'column'} spacing={1}>
      <GridItem item xs>
        <DurationField {...formikCustomFieldProps(getFormName('duration'), formik)} />
      </GridItem>
      <GridItem item xs>
        <CommonFormItem
          {...formikSwitchProps(getFormName('distribution'), formik)}
          control={<Switch color="primary" />}
          label={t('breakout-room-form-field-random-distribution')}
          labelPlacement="start"
        />
      </GridItem>
      <GridItem item xs>
        <CommonFormItem
          {...formikSwitchProps(getFormName('includeModerators'), formik)}
          control={<Switch color="primary" />}
          label={t('breakout-room-form-field-include-moderators')}
          labelPlacement="start"
        />
      </GridItem>
      <Grid item>
        <Button size={'small'} onClick={handleNext}>
          {t('breakout-room-create-button')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateByGroupsForm;
