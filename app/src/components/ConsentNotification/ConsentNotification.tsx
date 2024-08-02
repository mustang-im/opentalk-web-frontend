// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { closeSnackbar, notifications } from '@opentalk/common';

import { sendStreamConsentSignal } from '../../api/types/outgoing/streaming';
import localMediaContext from '../../modules/Media/LocalMedia';
import localScreenContext from '../../modules/Media/LocalScreen';
import { AppDispatch } from '../../store';

export const showConsentNotification = (dispatch: AppDispatch) =>
  new Promise((resolve) => {
    const key = 'consent-alert-dialog';

    const setRecordingConsent = (consent: boolean) => {
      dispatch(sendStreamConsentSignal.action({ consent }));
      closeSnackbar(key);
      if (!consent) {
        localMediaContext.reconfigure({ audio: false, video: false }).catch((e) => {
          console.error(`failed to switch off camera and mic when consent was denied: ${e}`);
        });
        localScreenContext.release();
      }
      resolve(consent);
    };

    notifications.consent({
      onAcceptButton: () => setRecordingConsent(true),
      onDeclineButton: () => setRecordingConsent(false),
      key,
    });
  });
