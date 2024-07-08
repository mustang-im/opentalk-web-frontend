// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Stack } from '@mui/material';
import { ErrorFormMessage, generateUniquedId } from '@opentalk/common';
import React from 'react';

interface IFormItem {
  label: string;
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

const FormItem = ({
  label,
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
  const id = props.id || generateUniquedId();
  return (
    <Stack>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <label htmlFor={id}>{label}</label>
        {React.cloneElement(control, { onChange, onBlur, name, checked: isChecked, inputProps: { id }, value })}
      </Box>
      {error && <ErrorFormMessage helperText={helperText} />}
    </Stack>
  );
};

export default FormItem;
