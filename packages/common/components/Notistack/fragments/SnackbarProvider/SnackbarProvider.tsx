// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { makeStyles } from '@mui/styles';
import {
  SnackbarKey,
  SnackbarProvider as SnackbarProviderDefault,
  SnackbarProviderProps as SnackbarProviderPropsDefault,
} from 'notistack';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CloseIcon } from '../../../../assets/icons';
import { IconButton } from '../../../IconButtons';
import { notifications } from '../utils';
import { getNotistackComponents } from '../variations';

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  padding: 0,
  color: theme.palette.common.white,
}));

const useStyles = makeStyles((theme) => ({
  containerRoot: {
    '&&': {
      top: '60px',
    },
    '&& > div': {
      width: '100%',
      minWidth: '280px',
      [theme.breakpoints.up('sm')]: {
        width: '30vw',
      },
    },
  },
  root: {
    width: '100%',

    '& .notistack-MuiContent': {
      flexWrap: 'nowrap',
      '& #notistack-snackbar': {
        alignItems: 'flex-start',
      },
    },
  },
}));

export interface SnackbarProviderProps extends SnackbarProviderPropsDefault {
  children: React.ReactNode;
}

// TODO: // suggesting export, we are just reuising de name as default...
export const SnackbarProvider = (props: SnackbarProviderProps) => {
  const classes = useStyles();
  const onClickDismiss = (key: SnackbarKey) => {
    notifications.close(key);
  };
  const { children, Components, domRoot } = props;
  const { t } = useTranslation();

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
        <StyledIconButton aria-label={t('global-close')} onClick={() => onClickDismiss(snackbarKey)}>
          <CloseIcon />
        </StyledIconButton>
      )}
      Components={getNotistackComponents(Components)}
      domRoot={domRoot}
    >
      {children}
    </SnackbarProviderDefault>
  );
};
