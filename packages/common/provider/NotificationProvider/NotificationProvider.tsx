// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Theme } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SnackbarKey, SnackbarProvider } from '@opentalk/notistack';
import React from 'react';

import { CloseIcon, DoneIcon, ErrorIcon, WarningIcon } from '../../assets/icons';
import IconButton from '../../components/IconButton';
import notifications, { SnackbarUtilsConfigurator } from '../../utils/snackBarUtils';
import { SnackbarUIContextProvider } from '../SnackbarUIProvider/SnackbarUIProvider';

/* TODO

The current state of Notistack doesn't allow to style the snackbars via emotion.
This implementation styles the snackbars using the legacy makeStyles API and should be refactored!

*/

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 0,
  color: theme.palette.common.white,
}));

const useStyles = makeStyles((theme: Theme) => ({
  containerRoot: {
    '&&': {
      top: '0 !important',
      maxWidth: '100%',
    },
  },

  root: {
    marginTop: -3,
    width: '100vw',

    '& .SnackbarItem-message': {
      padding: 0,
      fontWeight: 500,
      '& .MuiSvgIcon-root': {
        height: theme.typography.pxToRem(16),
        width: theme.typography.pxToRem(16),
        marginRight: theme.spacing(3),
        fill: theme.palette.common.white,
        // override for inline style of info svg
        marginInlineEnd: `${theme.spacing(3)} !important`,
      },
    },

    '& .SnackbarContent-root': {
      fontSize: '1rem',
      display: 'flex',
      borderRadius: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0px 3px 10px rgba(32, 67, 79, 0.2)',
      padding: theme.spacing(2, 5),
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1, 2),
      },

      '& .SnackbarItem-action': {
        marginRight: 0,
      },
      [theme.breakpoints.down('md')]: {
        fontSize: theme.typography.pxToRem(12),
      },
    },

    '& .SnackbarItem-variantWarning': { backgroundColor: theme.palette.warning.main },
    '& .SnackbarItem-variantError': { backgroundColor: theme.palette.error.main },
    '& .SnackbarItem-variantSuccess': { backgroundColor: theme.palette.success.main },
    '& .SnackbarItem-variantInfo': { backgroundColor: theme.palette.info.main },
  },
}));

const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  const onClickDismiss = (key: SnackbarKey) => {
    notifications.close(key);
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      dense
      preventDuplicate
      classes={{
        root: classes.root,
        containerRoot: classes.containerRoot,
      }}
      iconVariant={{
        success: <DoneIcon />,
        error: <ErrorIcon />,
        warning: <WarningIcon />,
      }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      action={(key) => (
        <StyledIconButton onClick={() => onClickDismiss(key)}>
          <CloseIcon />
        </StyledIconButton>
      )}
    >
      {(snackbars = []) => (
        <>
          <SnackbarUtilsConfigurator />
          <SnackbarUIContextProvider value={{ snackbars }}>{children}</SnackbarUIContextProvider>
          {snackbars}
        </>
      )}
    </SnackbarProvider>
  );
};

export default NotificationProvider;
