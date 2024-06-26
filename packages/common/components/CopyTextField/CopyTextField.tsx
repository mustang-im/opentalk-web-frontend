// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, CircularProgress, styled } from '@mui/material';
import React from 'react';

import { CopyIcon } from '../../assets/icons';
import { AdornmentIconButton } from '../IconButtons';
import { notifications } from '../Notistack';
import { TextField } from '../TextField';

interface LinkFieldProps {
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

const CopyTextField = ({ label, checked, value, onClick, ariaLabel, isLoading, notificationText }: LinkFieldProps) => {
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

  return (
    <TextField
      label={label}
      fullWidth
      checked={checked}
      value={value ? value.toString() : '-'}
      disabled
      endAdornment={
        isLoading ? (
          <SpinnerAdornment position="end">
            <LoadingSpinner />
          </SpinnerAdornment>
        ) : (
          <InputAdornment position="end">
            <AdornmentIconButton
              aria-label={ariaLabel}
              onClick={handleClick}
              edge="end"
              disabled={!value}
              parentDisabled
            >
              <CopyIcon />
            </AdornmentIconButton>
          </InputAdornment>
        )
      }
    />
  );
};

export default CopyTextField;
