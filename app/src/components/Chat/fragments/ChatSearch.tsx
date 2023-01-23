// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { InputAdornment, styled } from '@mui/material';
import { CloseIcon, SearchIcon } from '@opentalk/common';
import { ChangeEvent, ForwardedRef, forwardRef, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '../../../commonComponents';

interface EndAdornmentProps {
  onClick(): void;
  className?: string;
  hasValue?: boolean;
}

interface ChatSearchProps {
  value: string;
  onChange(nextValue: string): void;
}

const SearchField = styled(TextField)({
  '&': {
    marginTop: 0,
  },
  '*::-webkit-search-cancel-button': {
    display: 'none',
  },
});

const startAdornment = (
  <InputAdornment position="start">
    <SearchIcon />
  </InputAdornment>
);

const EndAdornment = styled((props: EndAdornmentProps) => (
  <InputAdornment position="end" onClick={props.hasValue ? props.onClick : undefined} className={props.className}>
    {props.hasValue && <CloseIcon />}
  </InputAdornment>
))(({ hasValue }) => ({
  cursor: hasValue ? 'pointer' : 'text',
  pointerEvents: hasValue ? 'auto' : 'none',
}));

const ChatSearch = (props: ChatSearchProps, ref: ForwardedRef<HTMLInputElement>) => {
  const { t } = useTranslation();
  const hasValue = props.value !== '';

  const onChangeMiddleware = (event: ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };

  const clear = () => {
    props.onChange('');
  };

  const onKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      clear();
    }
  };

  return (
    <SearchField
      inputRef={ref}
      size="small"
      placeholder={t('input-search-placehoder')}
      type="search"
      fullWidth={true}
      startAdornment={startAdornment}
      value={props.value}
      // We have to use empty adornment in order to keep layout persistant when clear icon changes visibility.
      endAdornment={<EndAdornment onClick={clear} hasValue={hasValue} />}
      onChange={onChangeMiddleware}
      onKeyUp={onKeyUp}
    />
  );
};

export default forwardRef(ChatSearch);
