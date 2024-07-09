// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormControl as MuiFormControl, FormControlLabel as MuiFormControlLabel, styled } from '@mui/material';
import React from 'react';

import { ErrorFormMessage } from '../../../commonComponents';
import { generateUniqueId } from '../../../utils/stringUtils';

interface IFormItem {
  label: string;
  labelPlacement: 'end' | 'start' | 'top' | 'bottom';
  control: React.ReactElement;
  name: string;
  onChange: {
    (e: React.ChangeEvent<unknown>): void;
    <T_1 = string | React.ChangeEvent<unknown>>(
      field: T_1
    ): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
  };
  onBlur: {
    (e: React.FocusEvent<unknown>): void;
    <T = unknown>(fieldOrEvent: T): T extends string ? (e: unknown) => void : void;
  };
  error?: boolean;
  helperText?: string;
  value?: unknown;
  checked?: boolean;
  id?: string;
}

const FormControlLabel = styled(MuiFormControlLabel)({
  flex: 1,
  justifyContent: 'space-between',
  marginLeft: 0,
  marginRight: 0,
  '& .MuiTypography-root': {
    fontWeight: 400,
  },
});

const FormControl = styled(MuiFormControl)<{ component: string }>({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  border: 'none',
  padding: 0,
});

const FormItem = ({
  label,
  labelPlacement,
  error,
  helperText,
  control,
  value,
  onChange,
  onBlur,
  name,
  checked,
  ...props
}: IFormItem) => {
  const isChecked = checked === undefined ? undefined : checked;
  const id = props.id || generateUniqueId();
  return (
    <FormControl error={error ? error : undefined} component="fieldset">
      <FormControlLabel
        control={React.cloneElement(control, { onChange, onBlur, name, checked: isChecked, inputProps: { id } })}
        label={label}
        labelPlacement={labelPlacement}
        value={value}
      />
      {error && <ErrorFormMessage helperText={helperText} />}
    </FormControl>
  );
};

export default FormItem;
