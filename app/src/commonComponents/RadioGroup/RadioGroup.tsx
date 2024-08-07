// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RadioGroup as MuiRadioGroup, RadioGroupProps as MuiRadioGroupProps } from '@mui/material';
import { FormWrapper, FormProps } from '@opentalk/common';

type RadioGroupProps = MuiRadioGroupProps &
  FormProps & {
    setFieldValue?: (field: string, value: string, shouldValidate?: boolean) => void;
  };

const RadioGroup = ({ children, setFieldValue, name, error, helperText, id, ...props }: RadioGroupProps) => (
  <FormWrapper error={error} helperText={helperText} {...props} fullWidth htmlFor={id}>
    <MuiRadioGroup
      {...props}
      id={id}
      onChange={(_, value) => setFieldValue && name && setFieldValue(name, value, true)}
      data-testid="radioGroupTest"
    >
      {children}
    </MuiRadioGroup>
  </FormWrapper>
);

export default RadioGroup;
