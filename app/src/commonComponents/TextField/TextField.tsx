// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputBase, InputBaseProps, TextFieldProps } from '@mui/material';
import { generateUniquedId } from '@opentalk/common';
import { FormWrapper, FormProps } from '@opentalk/common';
import React from 'react';

type ComposedTextFieldProps = TextFieldProps & InputBaseProps & FormProps;

export const ObservedInput = React.forwardRef(({ error, ...props }: InputBaseProps, ref: React.Ref<unknown>) => {
  return (
    <InputBase
      ref={ref}
      {...props}
      error={error}
      onKeyDown={(event) => {
        // prevent keys from triggering global shortcuts.
        event.stopPropagation();
        props.onKeyDown && props.onKeyDown(event);
      }}
      onKeyUp={(event) => {
        event.stopPropagation();
        props.onKeyUp && props.onKeyUp(event);
      }}
    />
  );
});

ObservedInput.displayName = 'ObservedInput';

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
