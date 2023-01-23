// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid } from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import React from 'react';

import IconButton from '../../commonComponents/IconButton';
import { ISnackbarActionButtonProps } from '../../utils/snackBarUtils';

const SnackbarActionButtons = ({
  onCancel,
  onAction,
  actionBtnText,
  cancelBtnText,
}: Omit<ISnackbarActionButtonProps, 'msg'>) => (
  <Grid container spacing={2}>
    {actionBtnText && (
      <Grid item>
        <Button onClick={onAction} variant={'text'} color={'inherit'}>
          {actionBtnText}
        </Button>
      </Grid>
    )}
    {cancelBtnText ? (
      <Grid item>
        <Button onClick={onCancel} color={'inherit'}>
          {cancelBtnText}
        </Button>
      </Grid>
    ) : (
      <Grid item>
        <IconButton onClick={onCancel}>
          <CloseIcon />
        </IconButton>
      </Grid>
    )}
  </Grid>
);

export default SnackbarActionButtons;
