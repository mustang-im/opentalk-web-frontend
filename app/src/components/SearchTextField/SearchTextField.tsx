// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { IconButton, InputAdornment } from '@mui/material';
import { SearchIcon, SortIcon, setHotkeysEnabled } from '@opentalk/common';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '../../commonComponents/TextField';
import { useAppDispatch } from '../../hooks';
import SortPopover from './fragments/SortPopover';

interface SearchFieldProps {
  onSearch: (search: string) => void;
  fullWidth?: boolean;
  showSort?: boolean;
}

const SearchTextField = ({ onSearch, fullWidth, showSort }: SearchFieldProps) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement>();
  const dispatch = useAppDispatch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
    setSearch(event.target.value);
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const open = Boolean(anchorEl);

  return (
    <TextField
      fullWidth={fullWidth}
      value={search}
      onChange={handleSearchChange}
      size={'small'}
      onFocus={() => {
        dispatch(setHotkeysEnabled(false));
      }}
      onBlur={() => {
        dispatch(setHotkeysEnabled(true));
      }}
      placeholder={t('input-search-placehoder')}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      endAdornment={
        showSort && (
          <InputAdornment position="end">
            <IconButton onClick={handleClick} edge="end" aria-label={t('sort-by')}>
              <SortIcon />
            </IconButton>
            <SortPopover setAnchorEl={setAnchorEl} anchorEl={anchorEl} open={open} />
          </InputAdornment>
        )
      }
    />
  );
};

export default SearchTextField;
