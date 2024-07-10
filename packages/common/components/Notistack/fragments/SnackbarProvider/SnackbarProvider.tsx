// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, GlobalStyles, Theme } from '@mui/material';
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

export interface SnackbarProviderProps extends SnackbarProviderPropsDefault {
  children: React.ReactNode;
}

const getSnackbarContainerRootClass = (theme: Theme) => ({
  top: '60px !important',
  '& > div': {
    width: '100%',
    minWidth: '280px',
    [theme.breakpoints.up('sm')]: {
      width: '30vw',
    },
  },
});

const getSnackbarRootClass = () => ({
  width: '100%',
  '& > .notistack-MuiContent': {
    flexWrap: 'nowrap',
    '& >  #notistack-snackbar': {
      alignItems: 'flex-start',
    },
  },
});

export const SnackbarProvider = (props: SnackbarProviderProps) => {
  const onClickDismiss = (key: SnackbarKey) => {
    notifications.close(key);
  };
  const { children, Components, domRoot } = props;
  const { t } = useTranslation();

  return (
    <>
      {/* 
          The only found possibility till now to customize snackbar container of Notistack is to use the `classes` API.
          Therefor we need to generate custom CSS classes and apply them to the `SnackbarProvider`.
          Using GlobalStyles seems to be a better alternative, than creating an external *.css file.
          But maybe there is a better way to do it?
      */}
      <GlobalStyles
        styles={(theme: Theme) => ({
          '.SnackbarContainerRoot': getSnackbarContainerRootClass(theme),
          '.SnackbarRoot': getSnackbarRootClass(),
        })}
      />
      <SnackbarProviderDefault
        classes={{
          containerRoot: 'SnackbarContainerRoot',
          root: 'SnackbarRoot',
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
        Components={{ ...getNotistackComponents(Components) }}
        domRoot={domRoot}
      >
        {children}
      </SnackbarProviderDefault>
    </>
  );
};
