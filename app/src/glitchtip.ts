// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: window.config.glitchtipDsn,
  enabled: Boolean(window.config.glitchtipDsn),
  release: window.config.glitchtipRelease,
  beforeSend: (event) => {
    if (window.showReportDialog) {
      window.showReportDialog(event);
    } else {
      Sentry.showReportDialog(event);
    }
    return event;
  },
});
