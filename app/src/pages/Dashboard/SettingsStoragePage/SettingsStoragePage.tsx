// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';

import { AssetSection } from './fragments/AssetSection';
import { StorageSection } from './fragments/StorageSection';

const SettingsStoragePage = () => {
  return (
    <Stack spacing={5}>
      <StorageSection />
      <AssetSection />
    </Stack>
  );
};

export default SettingsStoragePage;
