// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, ButtonProps, styled } from '@mui/material';
import { ArrowLeftIcon, ArrowRightIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SlideButton = styled(Button)<{ direction: 'left' | 'right' }>(({ theme, direction }) => ({
  width: theme.spacing(4),
  minWidth: theme.spacing(4),
  marginLeft: direction === 'right' ? 'auto' : undefined,
  '& svg': {
    fill: theme.palette.secondary.contrastText,
  },
}));

export interface IconSlideButtonProps extends ButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
}

const IconSlideButton = ({ direction, onClick, ...props }: IconSlideButtonProps) => {
  const { t } = useTranslation();
  return (
    <SlideButton
      color="secondary"
      variant="contained"
      direction={direction}
      aria-label={t(`navigate-to-${direction}`)}
      onClick={onClick}
      {...props}
    >
      {direction === 'left' && <ArrowLeftIcon />}
      {direction === 'right' && <ArrowRightIcon />}
    </SlideButton>
  );
};

export default IconSlideButton;
