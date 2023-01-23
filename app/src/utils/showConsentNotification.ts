// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import i18next from 'i18next';

import { sendRecordingConsentSignal } from '../api/types/outgoing/recording';
import { AppDispatch } from '../store';
import { notificationAction } from './snackBarUtils';

export default function showConsentNotification(dispatch: AppDispatch) {
  notificationAction({
    msg: i18next.t('recording-consent-message'),
    variant: 'warning',
    actionBtnText: i18next.t('recording-accept'),
    cancelBtnText: i18next.t('recording-decline'),
    onAction: () => dispatch(sendRecordingConsentSignal.action({ consent: true })),
    onCancel: () => dispatch(sendRecordingConsentSignal.action({ consent: false })),
    persist: true,
  });
}
