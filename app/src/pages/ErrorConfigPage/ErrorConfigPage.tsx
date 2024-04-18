// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import React from 'react';
import { useTranslation } from 'react-i18next';

import Error from '../../components/Error';

const ErrorConfigPage = () => {
  const { t } = useTranslation();

  return <Error isCrashError title={t('error-config-title')} description={t('error-config-message')} />;
};

export default ErrorConfigPage;
