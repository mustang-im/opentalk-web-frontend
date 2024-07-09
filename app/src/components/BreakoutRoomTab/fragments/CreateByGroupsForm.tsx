// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid, styled, Switch as MuiSwitch } from '@mui/material';
import { FormikProps } from 'formik';
import { FormikValues } from 'formik/dist/types';
import { useTranslation } from 'react-i18next';

import { DurationField, CommonFormItem } from '../../../commonComponents';
import { formikDurationFieldProps, formikSwitchProps } from '../../../utils/formikUtils';
import { DurationFieldWrapper } from '../../DurationFieldWrapper';

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
    <Grid container direction="column" spacing={1}>
      <GridItem item xs>
        <DurationFieldWrapper>
          <DurationField {...formikDurationFieldProps(getFormName('duration'), formik, 0)} min={0} />
        </DurationFieldWrapper>
      </GridItem>
      <GridItem item xs>
        <CommonFormItem
          {...formikSwitchProps(getFormName('distribution'), formik)}
          control={<Switch color="primary" />}
          label={t('breakout-room-form-field-random-distribution')}
        />
      </GridItem>
      <GridItem item xs>
        <CommonFormItem
          {...formikSwitchProps(getFormName('includeModerators'), formik)}
          control={<Switch color="primary" />}
          label={t('breakout-room-form-field-include-moderators')}
        />
      </GridItem>
      <Grid item>
        <Button size="small" onClick={handleNext}>
          {t('breakout-room-create-button')}
        </Button>
      </Grid>
    </Grid>
  );
};

export default CreateByGroupsForm;
