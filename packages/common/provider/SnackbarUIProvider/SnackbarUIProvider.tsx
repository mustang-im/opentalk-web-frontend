// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useContext, createContext } from 'react';

const SnackbarUIContext = createContext<{
  snackbars: JSX.Element[];
}>({
  snackbars: [],
});

export const SnackbarUIContextProvider = SnackbarUIContext.Provider;

export function useSnackbarUI() {
  return useContext(SnackbarUIContext);
}
