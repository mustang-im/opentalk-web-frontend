// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid } from '@mui/material';
import React from 'react';

import { CloseIcon } from '../../assets/icons';
import IconButton from '../../components/IconButton';
import { ISnackbarActionButtonProps } from '../../utils/snackBarUtils';

const SnackbarActionButtons = ({
  onCancel,
  onAction,
  actionBtnText,
  cancelBtnText,
  hideCloseButton,
}: Omit<ISnackbarActionButtonProps, 'msg'>) => {
  const renderCancelGridItem = () => (
    <Grid item>
      {cancelBtnText && (
        <Button onClick={onCancel} color={'inherit'}>
          {cancelBtnText}
        </Button>
      )}
      {!cancelBtnText && (
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      )}
    </Grid>
  );

  return (
    <Grid container spacing={2}>
      {actionBtnText && (
        <Grid item>
          <Button onClick={onAction} variant={'text'} color={'inherit'}>
            {actionBtnText}
          </Button>
        </Grid>
      )}
      {!hideCloseButton && renderCancelGridItem()}
    </Grid>
  );
};

export default SnackbarActionButtons;
