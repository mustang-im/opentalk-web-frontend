// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DateTimePicker } from '@mui/lab';
import { Stack, styled, TextFieldProps, ThemeProvider, InputAdornment } from '@mui/material';
import { Calendar } from '@mui/x-date-pickers/internals/components/icons';
import { isSameDay } from 'date-fns';
import { isEmpty, merge } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { FormProps } from '../../../commonComponents/FormWrapper/FormWrapper';
import TextField from '../../../commonComponents/TextField';
import { IFormikCustomFieldPropsReturnValue } from '../../../utils/formikUtils';

const CustomTextField = styled(TextField)(({ theme }) => ({
  '&.Mui-disabled': {
    backgroundColor: theme.palette.secondary.main,
    input: {
      color: theme.palette.secondary.contrastText,
      ' -webkit-text-fill-color': theme.palette.secondary.contrastText,
    },
  },
  '.MuiInputBase-input:focus': {
    // TODO: We rely on the contrast text color due to the calendar hacky solution which conflicts input text color.
    color: theme.palette.secondary.contrastText,
  },
  button: {
    svg: {
      fill: theme.palette.background.default,
    },
  },
}));

const masks = {
  de: '__.__.____ __:__',
  en: '__/__/____ __:__',
} as Record<string, string>;

type TimePickerProps = {
  value: string | number;
  ampm?: boolean;
  minTimeDate?: Date;
} & FormProps &
  IFormikCustomFieldPropsReturnValue;

const globalTheme = createOpenTalkTheme();
const timePickerTheme = merge({}, globalTheme, {
  palette: {
    common: {
      black: globalTheme.palette.common.black,
      white: globalTheme.palette.secondary.dark,
    },
    text: {
      secondary: globalTheme.palette.secondary.dark,
    },
  },
});

const TimePickers = ({ value, error, helperText, onChange, minTimeDate = new Date() }: TimePickerProps) => {
  const valueAsDate = isEmpty(value) ? new Date() : new Date(value);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { i18n } = useTranslation();
  const locale = i18n.language.split('-')[0];

  const onDateTimePickerChange = (date: Date | null) => {
    onChange(date);
  };

  const renderTextField = ({ inputRef, inputProps, disabled }: TextFieldProps) => {
    const { value, onChange, onBlur, onFocus } = inputProps || {};
    const endAdornment = (
      <InputAdornment position="end" onClick={() => setPopoverOpen(true)} sx={{ cursor: 'pointer' }}>
        <Calendar />
      </InputAdornment>
    );

    return (
      <CustomTextField
        ref={inputRef}
        endAdornment={endAdornment}
        disabled={disabled}
        value={value}
        error={error}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        onClick={(event) => setAnchorEl(event.currentTarget)}
        fullWidth
        helperText={helperText}
      />
    );
  };

  return (
    <Stack spacing={2}>
      <ThemeProvider theme={timePickerTheme}>
        <DateTimePicker
          label={'DateTimePicker'}
          value={valueAsDate}
          onChange={onDateTimePickerChange}
          renderInput={renderTextField}
          minDate={new Date()}
          mask={masks[locale] || masks.en}
          ampm={false}
          open={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          minTime={isSameDay(valueAsDate, minTimeDate) ? minTimeDate : undefined}
          PopperProps={{
            sx: { '& .MuiClockPicker-root': { pt: 4 }, '& :focus': { outline: 'none' } },
            anchorEl: anchorEl,
          }}
        />
      </ThemeProvider>
    </Stack>
  );
};

export default TimePickers;
