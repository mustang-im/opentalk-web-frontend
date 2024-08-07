// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Theme, useMediaQuery, Typography, styled } from '@mui/material';
import { useTheme } from '@mui/material';
import { DateTimePicker as MuiDateTimePicker, PickersActionBarAction, PickersLocaleText } from '@mui/x-date-pickers';
import { ErrorFormMessage } from '@opentalk/common';
import { isSameDay } from 'date-fns';
import { isEmpty } from 'lodash';
import { useState } from 'react';

import PickerLocalizationProvider from '../../provider/PickerLocalizationProvider';
import { IFormikCustomFieldPropsReturnValue } from '../../utils/formikUtils';

type PickerTextFieldProps = {
  placeholder?: string;
  id?: string;
  startAdornment?: string;
  fullWidth?: boolean;
};

type DateTimePickerProps = {
  value: string | number;
  ampm?: boolean;
  minTimeDate?: Date;
  clearable?: boolean;
  clearButtonLabel?: string;
  okButtonLabel?: string;
  cancelButtonLabel?: string;
  textField?: PickerTextFieldProps;
} & Pick<IFormikCustomFieldPropsReturnValue, 'onChange' | 'helperText' | 'error'>;

const StartAdornmentTypography = styled(Typography)(({ theme }) => ({
  paddingRight: theme.spacing(2),
  flex: '1',
  display: 'block',
  whiteSpace: 'nowrap',
}));

const DateTimePicker = ({
  value,
  onChange,
  helperText,
  minTimeDate = new Date(),
  clearable = false,
  clearButtonLabel = 'Clear',
  okButtonLabel = 'OK',
  cancelButtonLabel = 'Cancel',
  ampm = false,
  error,
  textField,
}: DateTimePickerProps) => {
  const { placeholder, id, startAdornment, fullWidth } = textField || {};
  const [focused, setFocused] = useState(false);
  const [opened, setOpened] = useState(false);
  const isScreenHeightTooSmall = useMediaQuery((theme: Theme) => {
    const query = theme.breakpoints.up('sm') + ' and (max-height:900px)';
    return query;
  });
  const theme = useTheme();

  // There are cases, when the screen height is too small to fit the popper of the desktop variant
  // Therefore we need an offset for the popper relativ to it's anchor
  const getOffsetModifier = () => {
    let skidding = 0;
    let distance = 0;
    if (isScreenHeightTooSmall) {
      skidding = 50;
      distance = -200;
    }
    return { name: 'offset', options: { offset: [skidding, distance] } };
  };

  // Clearable date pickers can have a null value
  // For not clearable date pickers we set empty values to the current date
  let actualValue;
  if (clearable) {
    actualValue = isEmpty(value) ? null : new Date(value);
  } else {
    actualValue = isEmpty(value) ? new Date() : new Date(value);
  }

  let minTime;
  if (actualValue && isSameDay(actualValue, minTimeDate)) {
    minTime = minTimeDate;
  } else {
    minTime = undefined;
  }

  const actions: PickersActionBarAction[] = clearable ? ['clear', 'accept', 'cancel'] : ['accept', 'cancel'];

  const actionButtonLabels: Pick<
    PickersLocaleText<Date>,
    'okButtonLabel' | 'cancelButtonLabel' | 'clearButtonLabel'
  > = {
    okButtonLabel,
    cancelButtonLabel,
    clearButtonLabel,
  };

  const onFocus = () => {
    setFocused(true);
  };
  const onBlur = () => {
    setFocused(false);
  };

  // as adornment for input fields of the picker we want to have just text (no icons or such)
  const getStartAdornment = () => {
    if (startAdornment) {
      return <StartAdornmentTypography>{startAdornment}</StartAdornmentTypography>;
    }
    return null;
  };

  return (
    // This provider is needed to customize and translate action button labels
    // Another option would be to introduce custom action components, which will make more work at the moment
    <>
      <PickerLocalizationProvider localeText={actionButtonLabels}>
        <MuiDateTimePicker
          value={actualValue}
          onChange={onChange}
          onOpen={() => setOpened(true)}
          onClose={() => setOpened(false)}
          ampm={ampm}
          minDate={minTimeDate}
          minTime={minTime}
          slotProps={{
            textField: {
              placeholder,
              error,
              id,
              fullWidth,
              onFocus,
              onBlur,
              InputProps: { startAdornment: getStartAdornment() },
            },
            actionBar: { actions },
            popper: { placement: 'bottom-start', modifiers: [getOffsetModifier()] },
            openPickerButton: {
              sx: {
                ':hover': {
                  backgroundColor: focused || opened ? theme.palette.secondary.lighter : theme.palette.secondary.light,
                },
                '& .MuiTouchRipple-child': {
                  backgroundColor: theme.palette.secondary.lighter,
                },
              },
            },
          }}
        />
      </PickerLocalizationProvider>
      {error && <ErrorFormMessage helperText={helperText} />}
    </>
  );
};

export default DateTimePicker;
