// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, useTheme } from '@mui/material';
import { SearchIcon, CommonTextField } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

type SearchInputProps = {
  onSearch: (searchValue: string) => void;
  searchValue: string;
};
function SearchInput({ searchValue, onSearch }: SearchInputProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };
  return (
    <CommonTextField
      fullWidth
      value={searchValue}
      onChange={handleSearchChange}
      size="small"
      label={t('participant-search-label')}
      placeholder={t('global-name-placeholder')}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      InputLabelProps={{ sx: { fontWeight: theme.typography.fontWeightRegular } }}
    />
  );
}

export default SearchInput;
