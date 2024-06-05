// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button } from '@mui/material';
import { useTranslation, Trans } from 'react-i18next';

import { useGetMeTariffQuery, useGetMeQuery } from '../../../../api/rest';
import { useAppSelector } from '../../../../hooks';
import { selectAccountManagementUrl } from '../../../../store/slices/configSlice';
import { AlertBanner } from './AlertBanner';

const FALLBACK_TARIFF_NAME = '';

const TariffDowngradedBanner = () => {
  const { t } = useTranslation();
  const accountManagementUrl = useAppSelector(selectAccountManagementUrl);
  const { data: tariff } = useGetMeTariffQuery();
  const tariffName = tariff?.name ?? FALLBACK_TARIFF_NAME;
  return (
    <AlertBanner
      icon={false}
      variant="filled"
      severity="error"
      // shall be read by screen-reader only after query response
      aria-hidden={tariffName === FALLBACK_TARIFF_NAME}
      action={
        <Button
          size={'medium'}
          onClick={() => {
            window.open(accountManagementUrl, '_self');
          }}
          focusRipple
        >
          {t('dashboard-add-payment-button')}
        </Button>
      }
    >
      <Trans i18nKey={'dashboard-payment-status-downgraded'} values={{ tariffName }} />
    </AlertBanner>
  );
};

export const PaymentStatusBanner = () => {
  const { data: me } = useGetMeQuery();
  const tariffStatus = me?.tariffStatus;

  if (tariffStatus === 'downgraded') {
    return <TariffDowngradedBanner />;
  }

  return null;
};
