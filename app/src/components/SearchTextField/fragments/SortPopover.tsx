// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MenuItem as MuiMenuItem, styled, Popover as MuiPopover, Typography, SvgIcon } from '@mui/material';
import { DoneIcon } from '@opentalk/common';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';

import SortOption from '../../../enums/SortOption';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { setParticipantsSortOption, selectParticipantsSortOption } from '../../../store/slices/uiSlice';

interface ISortOptionItem {
  disabled?: boolean;
  type?: SortOption;
  i18nKey: string;
}

interface ISortPopoverProps<T> {
  open: boolean;
  setAnchorEl: Dispatch<SetStateAction<T | undefined>>;
  anchorEl: (T & Element) | undefined;
}

export const sortOptionItems: ISortOptionItem[] = [
  {
    disabled: true,
    i18nKey: 'sort-by',
  },
  {
    type: SortOption.NameASC,
    i18nKey: 'sort-name-asc',
  },
  {
    type: SortOption.NameDESC,
    i18nKey: 'sort-name-dsc',
  },
  {
    type: SortOption.FirstJoin,
    i18nKey: 'sort-first-join',
  },
  {
    type: SortOption.LastJoin,
    i18nKey: 'sort-last-join',
  },
  {
    type: SortOption.LastActive,
    i18nKey: 'sort-last-active',
  },
  {
    type: SortOption.RaisedHandFirst,
    i18nKey: 'sort-raised-hand',
  },
];

const MenuItem = styled(MuiMenuItem)({
  justifyContent: 'space-between',
  '& .MuiTypography-root': {
    fontWeight: 400,
  },
});

const StyledIcon = styled(SvgIcon, {
  shouldForwardProp: (prop) => prop !== 'isActive',
})<{ isActive: boolean | undefined }>(({ theme, isActive }) => ({
  marginLeft: theme.spacing(1),
  '& svg': { fill: isActive ? theme.palette.primary.light : 'transparent' },
}));

function SortPopover<T>({ setAnchorEl, anchorEl, open }: ISortPopoverProps<T>) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const sortType = useAppSelector(selectParticipantsSortOption);

  const handleClose = () => {
    setAnchorEl(undefined);
  };

  const handleSortSelected = (sort?: SortOption) => {
    if (sort !== undefined) {
      dispatch(setParticipantsSortOption(sort));
      setAnchorEl(undefined);
    }
  };

  const renderSortOptionItems = () =>
    sortOptionItems.map((sortOptionItem) => (
      <MenuItem
        disabled={sortOptionItem.disabled}
        key={sortOptionItem.i18nKey}
        onClick={() => handleSortSelected(sortOptionItem.type)}
        selected={sortType === sortOptionItem.type}
      >
        <Typography>{t(sortOptionItem.i18nKey)}</Typography>
        <StyledIcon fontSize="inherit" isActive={sortType === sortOptionItem.type}>
          <DoneIcon />
        </StyledIcon>
      </MenuItem>
    ));

  return (
    <MuiPopover
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      {renderSortOptionItems()}
    </MuiPopover>
  );
}

export default SortPopover;
