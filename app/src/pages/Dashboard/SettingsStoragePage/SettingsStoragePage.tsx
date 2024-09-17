// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { VisuallyHiddenTitle } from '../../../commonComponents';
import { AssetSection } from './fragments/AssetSection';
import { StorageSection } from './fragments/StorageSection';

const SettingsStoragePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <VisuallyHiddenTitle label={t('dashboard-settings-storage-title')} component="h1" />
      <Stack spacing={5}>
        <StorageSection />
        <AssetSection />
      </Stack>
    </>
  );
};

export default SettingsStoragePage;
