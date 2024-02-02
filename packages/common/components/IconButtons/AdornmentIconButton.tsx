// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { IconButtonProps } from '@mui/material';
import React from 'react';

import IconButton from './IconButton';

interface StyledButtonProps {
  parentHasFocus?: boolean;
  parentDisabled?: boolean;
}
type AdornmentIconButtonProps = IconButtonProps & StyledButtonProps;
/**
 * IconButton Component to be used when used as adornment for InputFields
 */
const stylePropNames = ['parentHasFocus', 'parentDisabled'];
const StyledIconButton = styled(IconButton, {
  shouldForwardProp: (prop: string) => !stylePropNames.includes(prop),
})<StyledButtonProps>(({ theme, parentHasFocus = false, parentDisabled = false }) => {
  let focusColor = parentDisabled ? theme.palette.secondary.light : theme.palette.background.light;
  let nonFocusColor = parentDisabled ? theme.palette.background.light : theme.palette.secondary.light;

  if (theme.palette.mode === 'light') {
    focusColor = parentDisabled ? theme.palette.background.light : theme.palette.secondary.lighter;
    nonFocusColor = parentDisabled ? theme.palette.secondary.lighter : theme.palette.background.light;
  }

  return {
    ':hover': { backgroundColor: parentHasFocus ? focusColor : nonFocusColor },
  };
});
const AdornmentIconButton = React.forwardRef<HTMLButtonElement, AdornmentIconButtonProps>(
  (props: AdornmentIconButtonProps, ref) => (
    <StyledIconButton ref={ref} variant="adornment" {...props}>
      {props.children}
    </StyledIconButton>
  )
);

export default AdornmentIconButton;
