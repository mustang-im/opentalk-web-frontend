// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';
import {
  SnackbarContent,
  CustomContentProps,
  closeSnackbar,
} from 'notistack';
import type {
  SnackbarKey,
} from 'notistack';
import {
  Box,
  Typography,
  IconButton,
  Button,
  styled,
} from '@mui/material';
import {
  CloseIcon,
} from '../../../../assets/icons';
import {
  useTranslation,
} from 'react-i18next';
import type {
  AdditionalButtonAttributes,
} from '../utils';

const AlertBox = styled(Box, { shouldForwardProp: (prop: string) => !['type'].includes(prop) })(({ theme, type = 'info' }) => ({
  color: theme.palette[type].contrastText,
  backgroundColor: theme.palette[type].main,
  borderRadius: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  flexWrap: 'nowrap',
  width: '100%',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 0.5, 2, 2),
}));

const CustomButton = styled(Button)(({ theme, color, variant }) => {
  if (variant === 'contained') {
    if (['info', 'warning', 'error', 'success'].includes(color)) {
      return {
        backgroundColor: theme.palette[color].dark,
        color: theme.palette[color].contrastText
      };
    }
  }

  return {};
});

export interface BinaryActionNotificationProps extends CustomContentProps {
  type: 'info' | 'warning' | 'error' | 'success';
  primaryBtnText: string;
  secondaryBtnText: string;
  onPrimary?: (props: { id: SnackbarKey }) => void;
  onSecondary?: (props: { id: SnackbarKey }) => void;
  primaryBtnProps?: AdditionalButtonAttributes;
  secondaryBtnProps?: AdditionalButtonAttributes;
  closable?: boolean;
}

const BinaryActionNotification = React.forwardRef<HTMLDivElement, BinaryActionNotificationProps>(({
  id,
  message,
  primaryBtnText,
  secondaryBtnText,
  onPrimary,
  onSecondary,
  primaryBtnProps = {},
  secondaryBtnProps = {},
  type = 'info',
  closable = true,
  ...snackbarContentProps
}, ref) => {
  const { t } = useTranslation();

  function proxyPrimaryClickEvent() {
    if (onPrimary) {
      onPrimary({ id });
    }
  }

  function proxySecondaryClickEvent() {
    if (onSecondary) {
      onSecondary({ id });
    }
  }

  return (
    <SnackbarContent ref={ref} role='alertdialog' {...snackbarContentProps}>
      <AlertBox type={type}>
        <Box display='flex' gap={1} flex={1}>
          <Box display='flex' flexDirection='column' flex={1}>
            <Typography component='p' pt={1.5}>
              {message}
            </Typography>
          </Box>
          {closable && (
            <Box alignSelf='end'>
              <IconButton aria-label={t('global-close')} onClick={() => closeSnackbar(id)}>
                <CloseIcon />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box display='flex' alignSelf='end' gap={1} pr={2}>
          {typeof onSecondary === 'function' && (
            <CustomButton variant='contained' color='secondary' {...secondaryBtnProps} data-id="binary-action-secondary" type='button' onClick={proxySecondaryClickEvent} focusRipple>
              {secondaryBtnText}
            </CustomButton>
          )}
          {typeof onPrimary === 'function' && (
            <CustomButton variant='contained' color='primary' {...primaryBtnProps} data-id="binary-action-primary" type='button' onClick={proxyPrimaryClickEvent} focusRipple>
              {primaryBtnText}
            </CustomButton>
          )}
        </Box>
      </AlertBox>
    </SnackbarContent>
  )
});

export default BinaryActionNotification;
