// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { SnackbarProvider as DefaultSnackbarProvider } from '@opentalk/common';
import { ReactNode } from 'react';

import { TimeLimitNotification } from '../../components/TimeLimitNotification/TimeLimitNotification';

declare module 'notistack' {
  interface VariantOverrides {
    timeLimit: true;
  }
  interface OptionsObject {
    minutes?: number;
  }
}

const SnackbarProvider = ({ children }: { children: ReactNode }) => {
  return (
    <DefaultSnackbarProvider Components={{ timeLimit: TimeLimitNotification }}>{children}</DefaultSnackbarProvider>
  );
};

export default SnackbarProvider;
