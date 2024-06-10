// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment } from '@mui/material';
import { SearchIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import TextField from '../../TextField';

type SearchInputProps = {
  onSearch: (searchValue: string) => void;
  searchValue: string;
};
function SearchInput({ searchValue, onSearch }: SearchInputProps) {
  const { t } = useTranslation();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };
  return (
    <TextField
      fullWidth
      value={searchValue}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
      onKeyUp={(event) => {
        event.stopPropagation();
      }}
      onChange={handleSearchChange}
      size="small"
      placeholder={t('input-search-placehoder')}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
    />
  );
}

export default SearchInput;
