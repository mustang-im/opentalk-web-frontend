// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack } from '@mui/material';

import { PaymentStatusBanner } from './PaymentStatusBanner';
import { StorageAlmostFullBanner } from './StorageAlmostFullBanner';

export const BannerContainer = () => {
  return (
    <Stack direction="column" gap={1}>
      <PaymentStatusBanner />
      <StorageAlmostFullBanner />
    </Stack>
  );
};
