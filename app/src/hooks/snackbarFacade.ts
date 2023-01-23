// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useSnackbar } from '@opentalk/notistack';

import { useSnackbarUI } from '../provider/SnackbarUIProvider/SnackbarUIProvider';

export default function useSnackbarFacade() {
  const snackbar = useSnackbar();
  const snackbarUI = useSnackbarUI();

  return { ...snackbar, ...snackbarUI };
}
