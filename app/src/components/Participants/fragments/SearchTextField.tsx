// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, useTheme } from '@mui/material';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SearchIcon, SortIcon } from '../../../assets/icons';
import { AdornmentIconButton, CommonTextField, SortPopoverMenu } from '../../../commonComponents';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectParticipantsSortOption, setParticipantsSortOption } from '../../../store/slices/uiSlice';
import { SortItem, SortOption } from '../../../types';

interface SearchFieldProps {
  onSearch: (search: string) => void;
  fullWidth?: boolean;
  showSort?: boolean;
  searchValue?: string;
}

export const items: SortItem[] = [
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

const SearchTextField = ({ onSearch, fullWidth, showSort, searchValue = '' }: SearchFieldProps) => {
  const id = 'sort-search-participants';
  const { t } = useTranslation();
  const theme = useTheme();
  const anchorEl = useRef(null);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [hasFocus, setFocus] = useState<boolean>(false);
  const sortType = useAppSelector(selectParticipantsSortOption);
  const dispatch = useAppDispatch();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  const handleClick = () => {
    setExpanded((expanded) => !expanded);
  };

  const handleSortSelected = (sort: string) => {
    dispatch(setParticipantsSortOption(sort as SortOption));
  };
  const handleFocus = () => {
    setFocus(true);
  };
  const handleBlur = () => {
    setFocus(false);
  };

  return (
    <CommonTextField
      fullWidth={fullWidth}
      value={searchValue}
      onKeyDown={(event) => {
        event.stopPropagation();
      }}
      onKeyUp={(event) => {
        event.stopPropagation();
      }}
      onChange={handleSearchChange}
      size="small"
      onFocus={handleFocus}
      onBlur={handleBlur}
      label={t('participant-search-label')}
      placeholder={t('global-name-placeholder')}
      multiline
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: showSort && (
          <InputAdornment position="end">
            <AdornmentIconButton
              ref={anchorEl}
              onClick={handleClick}
              edge="end"
              aria-label={t('sort-by')}
              aria-expanded={expanded}
              aria-controls={id}
              aria-haspopup="menu"
              onKeyDown={(event) => event.stopPropagation()}
              onKeyUp={(event) => event.stopPropagation()}
              parentHasFocus={hasFocus}
            >
              <SortIcon />
            </AdornmentIconButton>
            {anchorEl.current && expanded && (
              <SortPopoverMenu
                id={id}
                anchorEl={anchorEl.current}
                isOpen={true}
                items={items}
                selectedOptionType={sortType}
                onChange={handleSortSelected}
                onClose={() => setExpanded(false)}
              />
            )}
          </InputAdornment>
        ),
      }}
      InputLabelProps={{ sx: { fontWeight: theme.typography.fontWeightRegular } }}
    />
  );
};

export default SearchTextField;
