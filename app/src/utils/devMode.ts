// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { localStorageItems } from '../config/storage';

export const isDevMode = (): boolean => Boolean(localStorage.getItem(localStorageItems.devMode) ?? false);
