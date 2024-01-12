// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface VisuallyHiddenTitleProps {
  label: string;
  component: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const VisuallyHiddenTitle = ({ label, component }: VisuallyHiddenTitleProps) => {
  const { t } = useTranslation();
  return (
    <Typography component={component} sx={visuallyHidden}>
      {t(label)}
    </Typography>
  );
};

export default VisuallyHiddenTitle;
