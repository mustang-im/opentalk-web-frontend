// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormHelperText, styled } from '@mui/material';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

type ErrorFormMessageProps = {
  helperText?: string;
};

const Container = styled(FormHelperText)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  '&::before': {
    content: "'!'",
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText,
    marginRight: theme.spacing(0.5),
  },
}));

export const ErrorFormMessage: FC<ErrorFormMessageProps> = ({ helperText }) => {
  const { t } = useTranslation();

  return (
    <Container error>
      <span>{t('global-error')}</span>:&nbsp;<span>{helperText}</span>
    </Container>
  );
};
