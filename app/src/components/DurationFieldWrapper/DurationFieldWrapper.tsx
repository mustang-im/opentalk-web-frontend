// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, BoxTypeMap, Typography } from '@mui/material';
import { DefaultComponentProps } from '@mui/material/OverridableComponent';
import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';

export const DurationFieldWrapper = (
  props: PropsWithChildren<DefaultComponentProps<BoxTypeMap<Record<string, unknown>, 'div'>>>
) => {
  const { t } = useTranslation();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" {...props}>
      <Typography>{t('global-duration')}</Typography>
      {props.children}
    </Box>
  );
};
