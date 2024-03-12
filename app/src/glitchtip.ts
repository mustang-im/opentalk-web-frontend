// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import * as Sentry from '@sentry/browser';

import store from './store';
import { setShowErrorDialog } from './store/slices/uiSlice';

if (window.config.glitchtip && window.config.glitchtip.dsn) {
  Sentry.init({
    autoSessionTracking: false, // switched because its not implemented https://gitlab.com/glitchtip/glitchtip-backend/-/issues/206
    dsn: window.config.glitchtip.dsn,
    enabled: Boolean(window.config.glitchtip.dsn),
    release: window.config.version?.frontend,
    beforeSend: (event) => {
      if (event.exception && event.event_id) {
        store.dispatch(setShowErrorDialog({ showErrorDialog: true, event }));
      }
      return null;
    },
  });
}
