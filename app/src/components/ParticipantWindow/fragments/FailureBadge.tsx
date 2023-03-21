// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Tooltip } from '@mui/material';
import { WarningIcon } from '@opentalk/common';
import { ReactNode } from 'react';

export const FailureBadge = ({ title, children }: { title: string; children: ReactNode }) => (
  <Tooltip title={title}>
    <Stack direction={'row'}>
      <WarningIcon color="error" fontSize="medium" />
      {children}
    </Stack>
  </Tooltip>
);
