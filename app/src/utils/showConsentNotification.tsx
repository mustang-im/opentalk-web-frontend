// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { closeSnackbar, notificationAction } from '@opentalk/common';

import { sendRecordingConsentSignal } from '../api/types/outgoing/recording';
import StartRecordingConsentDialog from '../components/StartRecordingConsentDialog';
import { AppDispatch } from '../store';

export default function showConsentNotification(dispatch: AppDispatch) {
  const key = 'recording-consent-dialog';

  const onAcceptButton = () => {
    dispatch(sendRecordingConsentSignal.action({ consent: true }));
    closeSnackbar(key);
  };

  const onDeclineButton = () => {
    dispatch(sendRecordingConsentSignal.action({ consent: false }));
    closeSnackbar(key);
  };

  notificationAction({
    key: key,
    persist: true,
    variant: 'warning',
    hideCloseButton: true,
    msg: <StartRecordingConsentDialog onAcceptButton={onAcceptButton} onDeclineButton={onDeclineButton} />,
  });
}
