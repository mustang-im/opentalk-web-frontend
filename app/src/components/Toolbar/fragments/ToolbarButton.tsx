// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Tooltip, ThemeProvider } from '@mui/material';
import { ArrowDownIcon } from '@opentalk/common';
import React, { MouseEvent, ReactNode } from 'react';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import IconButton from '../../../commonComponents/IconButton';

interface IButtonProps {
  isActive?: boolean;
  isLobby?: boolean;
}

const ButtonContainer = styled('div')(({ theme }) => ({
  cursor: 'pointer',
  position: 'relative',
  borderRadius: theme.borderRadius.large,
}));

const ToolbarIconButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['isActive', 'isLobby'].includes(prop as string),
})<IButtonProps>(({ theme, isActive, isLobby }) => ({
  cursor: 'pointer',
  position: 'relative',
  boxShadow: 'none',
  minWidth: 0,
  width: '2.5rem',
  height: '2.08rem',
  ...(isActive && {
    background: theme.palette.secondary.lightest,
    '& svg': {
      fill: theme.palette.secondary.main,
    },
  }),
  ...(isLobby && {
    width: '3.25rem',
    height: '2.75rem',
    border: `2px solid ${theme.palette.warning.main}`,

    ...(isActive && {
      border: `2px solid ${theme.palette.secondary.lightest}`,
    }),
  }),
}));

const ToggleButton = styled(IconButton, {
  shouldForwardProp: (prop) => !['isActive', 'isLobby'].includes(prop as string),
})<IButtonProps>(({ theme, isActive, isLobby }) => ({
  backgroundColor: isActive ? theme.palette.text.secondary : theme.palette.secondary.main,
  padding: theme.spacing(0.4),
  border: `solid 0.125em #17313A`,
  position: 'absolute',
  bottom: '-0.25em',
  right: '-0.25em',
  '& svg': {
    fill: isActive ? theme.palette.secondary.light : theme.palette.text.secondary,
    width: '0.5em',
    height: '0.5em',
  },
  '&:hover': {
    background: isActive ? theme.palette.secondary.light : theme.palette.secondary.lightest,
    '& svg': {
      fill: isActive ? theme.palette.secondary.lightest : theme.palette.secondary.light,
    },
  },
  ...(isLobby && {
    padding: theme.spacing(0.625),
    border: `1px solid ${theme.palette.warning.main}`,
  }),
  [theme.breakpoints.down('md')]: {
    padding: isLobby ? theme.spacing(0.625) : theme.spacing(0.4),
  },
}));

export type ToolbarButtonProps = {
  hasContext?: boolean;
  tooltipTitle: string;
  contextDisabled?: boolean;
  contextTitle?: string;
  contextMenuId?: string;
  contextMenuExpanded?: boolean;
  disabled?: boolean;
  active: boolean;
  onClick: (event?: MouseEvent) => void;
  openMenu?: () => void;
  children: ReactNode;
  isLobby?: boolean;
};

const ToolbarButton = ({
  children,
  onClick,
  hasContext,
  contextDisabled,
  contextTitle,
  contextMenuId,
  contextMenuExpanded,
  disabled,
  active,
  openMenu,
  tooltipTitle,
  isLobby,
  ...props
}: ToolbarButtonProps) => (
  <ThemeProvider theme={createOpenTalkTheme()}>
    <Tooltip placement="top" title={tooltipTitle}>
      <ButtonContainer>
        <ToolbarIconButton
          variant={'toolbar'}
          isActive={active}
          disabled={disabled || undefined}
          aria-label={tooltipTitle}
          onClick={(event) => onClick(event)}
          isLobby={isLobby}
          {...props}
        >
          {children}
        </ToolbarIconButton>
        {hasContext && !contextDisabled && (
          <ToggleButton
            isActive={active}
            onClick={(event) => {
              event.stopPropagation();
              if (openMenu) openMenu();
            }}
            isLobby={isLobby}
            aria-label={contextTitle}
            aria-controls={contextMenuId}
            aria-expanded={contextMenuExpanded}
          >
            <ArrowDownIcon />
          </ToggleButton>
        )}
      </ButtonContainer>
    </Tooltip>
  </ThemeProvider>
);

export default ToolbarButton;
