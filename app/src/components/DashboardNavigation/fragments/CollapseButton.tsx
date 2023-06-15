// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, styled } from '@mui/material';
import { BackIcon, ForwardIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

const CustomButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  minWidth: 0,
  padding: theme.spacing(1),
  borderRadius: '100%',
  transition: 'all 200ms linear',

  '& svg': {
    width: '0.5em',
    height: '0.5em',
  },
}));

interface CollapseButtonProps {
  collapsed: boolean;
  onClick: (nextCollapsed: boolean) => void;
}

const CollapseButton = (props: CollapseButtonProps) => {
  const { t } = useTranslation();

  return (
    <CustomButton
      variant="outlined"
      color="secondary"
      collapsed={props.collapsed}
      onClick={props.onClick.bind(null, !props.collapsed)}
      aria-label={t(`dashboard-${props.collapsed ? 'open' : 'close'}-navbar`)}
    >
      {props.collapsed ? <ForwardIcon /> : <BackIcon />}
    </CustomButton>
  );
};

export default CollapseButton;
