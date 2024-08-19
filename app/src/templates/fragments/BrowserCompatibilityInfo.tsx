// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { differenceInMonths } from 'date-fns';
import { PropsWithChildren, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { notificationAction } from '../../commonComponents';
import ConfirmBrowserDialog from '../../components/ConfirmBrowserDialog';
import { localStorageItems } from '../../config/storage';
import browser from '../../modules/BrowserSupport';

const BrowserCompatibilityInfo = ({ children }: PropsWithChildren) => {
  const signature = browser.getBrowserSignature();
  const [isConfirmed, setBrowserConfirmed] = useState(browser.isBrowserConfirmed());
  const { t } = useTranslation();

  const handleClick = useCallback(() => {
    localStorage.setItem(localStorageItems.browserConfirmed, signature);
    setBrowserConfirmed(true);
  }, []);

  useEffect(() => {
    const isSafari = browser.isSafari();
    if (isSafari) {
      const safariNotificationLastSeenTimestamp = localStorage.getItem(localStorageItems.safariNotificationKey);
      const now = new Date();
      const lastSeenDate = safariNotificationLastSeenTimestamp
        ? new Date(safariNotificationLastSeenTimestamp)
        : undefined;
      const showNotification = !lastSeenDate || differenceInMonths(now, lastSeenDate) > 0;
      if (showNotification) {
        const message = t('safari-warning-notification');
        notificationAction({
          msg: message,
          variant: 'warning',
          cancelBtnText: t('global-ok'),
          persist: true,
          preventDuplicate: true,
          onCancel: () => localStorage.setItem(localStorageItems.safariNotificationKey, now.toISOString()),
        });
      }
    }
  }, [t]);

  if (!isConfirmed) {
    return <ConfirmBrowserDialog handleClick={handleClick} />;
  }
  return <>{children}</>;
};

export default BrowserCompatibilityInfo;
