// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { UserAssetTable } from './UserAssetTable';

export const AssetSection = () => {
  const { t } = useTranslation();
  return (
    <Stack spacing={2}>
      <Typography variant="h1" component="h2">
        {t('dashboard-settings-storage-assets')}
      </Typography>
      <UserAssetTable />
    </Stack>
  );
};
