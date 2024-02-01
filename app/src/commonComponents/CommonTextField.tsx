// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { TextField, TextFieldProps } from '@mui/material';
import React from 'react';

export const CommonTextField = (props: TextFieldProps) => {
  return (
    <TextField
      {...props}
      onFocus={(event) => {
        props.onFocus && props.onFocus(event);
      }}
      onBlur={(event) => {
        props.onBlur && props.onBlur(event);
      }}
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
};
