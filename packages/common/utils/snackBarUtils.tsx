// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { OptionsObject, SnackbarKey, WithSnackbarProps } from '@opentalk/notistack';
import React from 'react';

import useSnackbarFacade from '../hooks/snackbarFacade';
import { SnackbarActionButtons } from '../provider/Utils';

// Must be imported at least once in the app to initialize the ref
let snackbarRef: WithSnackbarProps;
export const SnackbarUtilsConfigurator: React.FC = () => {
  snackbarRef = useSnackbarFacade();
  return null;
};

export interface ISnackbarActionButtonProps {
  msg: string;
  onCancel?: () => void;
  onAction?: () => void;
  actionBtnText?: string;
  cancelBtnText?: string;
}

export interface ISnackActionsProps extends OptionsObject, ISnackbarActionButtonProps {}

export interface ISnackbarPersistentProps extends Omit<OptionsObject, 'persist' | 'action' | 'autoHideDuration'> {
  msg: string;
}

export function notificationAction({
  msg,
  variant,
  actionBtnText,
  cancelBtnText,
  onAction,
  onCancel,
  ...options
}: ISnackActionsProps): void {
  const handleClick = (key: SnackbarKey, action: typeof onAction | typeof onCancel) => {
    snackbarRef.closeSnackbar(key);
    if (action) {
      action();
    }
  };
  snackbarRef.enqueueSnackbar(msg, {
    variant,
    ...options,
    action: (key: SnackbarKey) => (
      <SnackbarActionButtons
        actionBtnText={actionBtnText}
        cancelBtnText={cancelBtnText}
        onAction={() => handleClick(key, onAction)}
        onCancel={() => handleClick(key, onCancel)}
      />
    ),
  });
}

export function notificationPersistent({ msg, variant, ...options }: ISnackbarPersistentProps): void {
  snackbarRef.enqueueSnackbar(msg, {
    variant,
    ...options,
    action: null,
    persist: true,
  });
}

const notifications = {
  success(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'success' });
  },
  warning(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'warning' });
  },
  info(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'info' });
  },
  error(msg: string, options: OptionsObject = {}): void {
    this.toast(msg, { ...options, variant: 'error' });
  },
  toast(msg: string, options: OptionsObject = {}): void {
    snackbarRef.enqueueSnackbar(msg, options);
  },
  close(key: SnackbarKey): void {
    snackbarRef.closeSnackbar(key);
  },
  closeAll(): void {
    snackbarRef.closeSnackbar();
  },
};

// Export no-named default so consumer can name as desired/required
export default notifications;
