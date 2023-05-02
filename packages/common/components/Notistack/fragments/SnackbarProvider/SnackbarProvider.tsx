// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { SnackbarKey, SnackbarProvider as SnackbarProviderDefault } from 'notistack';
import React from 'react';

import { CloseIcon } from '../../../../assets/icons';
import IconButtonDefault from '../../../IconButton';
import { notifications } from '../utils';

const IconButton = styled(IconButtonDefault)(({ theme }) => ({
  marginRight: theme.spacing(2),
  padding: 0,
  color: theme.palette.common.white,
}));

const useStyles = makeStyles(() => ({
  containerRoot: {
    '&&': {
      top: '60px',
    },
    '&& > div': {
      width: '30vw',
      minWidth: '400px',
    },
  },
  root: {
    width: '100%',

    '& .notistack-MuiContent': {
      flexWrap: 'nowrap',
      "& #notistack-snackbar": {
        alignItems: "flex-start"
      }
    },
  },
}));

// TODO: // suggesting export, we are just reuising de name as default...
export const SnackbarProvider = ({ children }: { children: React.ReactNode }) => {
  const classes = useStyles();
  const onClickDismiss = (key: SnackbarKey) => {
    notifications.close(key);
  };

  return (
    <SnackbarProviderDefault
      classes={{
        containerRoot: classes.containerRoot,
        root: classes.root,
      }}
      dense
      maxSnack={3}
      preventDuplicate
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      action={(snackbarKey: SnackbarKey) => (
        <IconButton onClick={() => onClickDismiss(snackbarKey)}>
          <CloseIcon />
        </IconButton>
      )}
    >
      {children}
    </SnackbarProviderDefault>
  );
};
