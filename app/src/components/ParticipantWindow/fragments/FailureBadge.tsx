// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Tooltip, Zoom } from '@mui/material';
import { ReactNode } from 'react';

import { WarningIcon } from '../../../assets/icons';

export const FailureBadge = ({ title, children }: { title: string; children: ReactNode }) => (
  <Tooltip title={title}>
    <Zoom in={true} unmountOnExit style={{ transitionDelay: '3000ms' }}>
      <Stack direction="row">
        <WarningIcon color="error" fontSize="medium" />
        {children}
      </Stack>
    </Zoom>
  </Tooltip>
);
