// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputBase, InputBaseProps, TextFieldProps } from '@mui/material';
import React, { forwardRef, KeyboardEvent } from 'react';

import { generateUniquedId } from '../../utils';
import { FormWrapper, FormProps } from '../FormWrapper/FormWrapper';

type ComposedTextFieldProps = TextFieldProps & InputBaseProps & FormProps;

export const ObservedInput = forwardRef<HTMLInputElement, InputBaseProps>(({ error, ...props }, ref) => {
  const handlePropagation = (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key !== 'Escape') {
      event.stopPropagation();
    }
  };
  return <InputBase ref={ref} {...props} error={error} onKeyDown={handlePropagation} onKeyUp={handlePropagation} />;
});

const TextField = React.forwardRef<HTMLInputElement, ComposedTextFieldProps>(
  ({ label, error, helperText, fullWidth, ...props }, ref) => {
    const id = props.id || generateUniquedId();

    return (
      <FormWrapper label={label} helperText={helperText} error={error} fullWidth={fullWidth} htmlFor={id}>
        <ObservedInput {...props} ref={ref} error={error} id={id} />
      </FormWrapper>
    );
  }
);

export default TextField;
