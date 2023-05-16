// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Tab as MuiTab, Tabs as MuiTabs, styled, Tooltip, Divider, Button } from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Tab as TabProps } from '../../config/moderationTabs';

const Tabs = styled(MuiTabs)(({ theme }) => ({
  //todo align a proper background color from theme (for now nothing fit)
  background: 'rgb(56, 88, 101)',
  padding: theme.spacing(4.5, 0),
  borderBottomLeftRadius: theme.borderRadius.medium,
  borderTopLeftRadius: theme.borderRadius.medium,
  '& .MuiTabs-flexContainer': {
    display: 'grid',
    gridColumns: '1fr',
    gridTemplateRows: '4fr repeat(11, 1fr)',
    alignItems: 'flex-start',
    rowGap: theme.spacing(0.5),
    height: '100%',
    '@media (max-height:800px)': {
      gridTemplateRows: '1fr repeat(11, 1fr)',
      rowGap: theme.spacing(0.25),
    },
  },
  '& .MuiTabs-indicator': {
    left: 0,
    width: '2px',
    display: 'block',
    backgroundColor: theme.palette.primary.main,
    transition: 'none',
  },
}));

const Tab = styled(MuiTab)<{ component?: React.ElementType }>(({ theme }) => ({
  color: theme.palette.secondary.light,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1),
  borderRadius: 0,
  minWidth: '1rem',
  minHeight: '1rem',
  background: 'transparent',
  '& svg': {
    width: '1.25rem',
    fill: 'currentcolor',
  },
  '&.MuiButtonBase-root.Mui-disabled': {
    backgroundColor: 'transparent',
  },
  '&:hover:not(&.Mui-disabled)': {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  '&.Mui-selected': {
    background: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
  },
  '&.Mui-selected .MuiTab-wrapper > svg': {
    fill: 'white',
  },
}));

const ToolbarDivider = styled(Divider)(({ theme }) => ({
  padding: theme.spacing(1),
  margin: theme.spacing(0, 1),
  borderBottom: `3px solid rgb(31,62,73)`,
}));

export type ModerationSideToolbarProps = {
  onSelect: (tabIndex: number) => void;
  selectedTabs: TabProps[];
  value: number;
};

const ModerationSideToolbar = ({ onSelect, selectedTabs, value }: ModerationSideToolbarProps) => {
  const { t } = useTranslation();

  const handleChange = useCallback(
    (_event: React.SyntheticEvent<Element, Event>, tabIndex: number) => {
      onSelect(tabIndex);
    },
    [onSelect]
  );

  const renderTooltipTitle = (tab: TabProps) => {
    return t(tab.tooltipTranslationKey as string) || '';
  };

  const renderTabs = () =>
    selectedTabs.map((tab) =>
      tab.divider ? (
        <Tab key={tab.key} label="" icon={<ToolbarDivider />} disabled />
      ) : (
        <Tooltip key={tab.key} placement="right" title={renderTooltipTitle(tab)}>
          <Tab icon={tab.icon} component={Button} disabled={tab.disabled} />
        </Tooltip>
      )
    );

  return (
    <Tabs value={value} onChange={handleChange} orientation="vertical">
      {renderTabs()}
    </Tabs>
  );
};

export default ModerationSideToolbar;
