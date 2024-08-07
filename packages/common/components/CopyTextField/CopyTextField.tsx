// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, CircularProgress, styled } from '@mui/material';
import React, { forwardRef } from 'react';

import { CopyIcon } from '../../assets/icons';
import CommonTextField from '../CommonTextField';
import { AdornmentIconButton } from '../IconButtons';
import { notifications } from '../Notistack';

export interface LinkFieldProps {
  label: string;
  checked?: boolean;
  value?: string | URL;
  onClick?: () => void;
  notificationText: string;
  isLoading?: boolean;
  ariaLabel?: string;
}

const SpinnerAdornment = styled(InputAdornment)(({ theme }) => ({
  right: theme.typography.pxToRem(2),
}));

const LoadingSpinner = styled(CircularProgress)(({ theme }) => ({
  padding: theme.spacing(1),
  justifySelf: 'center',
  right: 5,
}));

const CopyTextField = forwardRef<HTMLInputElement, LinkFieldProps>(
  ({ label, checked, value, onClick, ariaLabel, isLoading, notificationText, ...remainingProps }, ref) => {
    const handleClick = () => {
      if (value) {
        navigator.clipboard.writeText(value.toString()).then(() => {
          notifications.success(notificationText);
          if (onClick) {
            onClick();
          }
        });
      }
    };

    const renderEndAdornment = () => {
      if (isLoading) {
        return (
          <SpinnerAdornment position="end">
            <LoadingSpinner />
          </SpinnerAdornment>
        );
      }

      return (
        <InputAdornment position="end">
          <AdornmentIconButton aria-label={ariaLabel} onClick={handleClick} edge="end" disabled={!value} parentDisabled>
            <CopyIcon />
          </AdornmentIconButton>
        </InputAdornment>
      );
    };

    return (
      <CommonTextField
        ref={ref}
        {...remainingProps}
        label={label}
        fullWidth
        value={value ? value.toString() : '-'}
        disabled
        InputProps={{ endAdornment: renderEndAdornment(), checked: checked }}
      />
    );
  }
);

export default CopyTextField;
