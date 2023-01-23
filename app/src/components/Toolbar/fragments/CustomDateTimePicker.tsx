// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MobileDateTimePicker } from '@mui/lab';
import { createTheme, styled, TextFieldProps, ThemeProvider } from '@mui/material';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { CommonTextField } from '../../../commonComponents';

const globalTheme = createOpenTalkTheme();
globalTheme.palette.common = { black: globalTheme.palette.common.black, white: globalTheme.palette.secondary.dark };
// TODO: Hacky way of styling mui/lab calendar text.
globalTheme.palette.text.secondary = globalTheme.palette.secondary.dark;

const dateDialogTheme = createTheme({
  ...globalTheme,
});

const StyledCommonTextField = styled(CommonTextField)(({ theme }) => ({
  '.MuiInputBase-input:focus': {
    // TODO: We rely on the contrast text color due to the calendar hacky solution which conflicts input text color.
    color: theme.palette.secondary.contrastText,
  },
}));

const CustomDateTimePicker = ({ ...props }) => {
  return (
    <ThemeProvider theme={dateDialogTheme}>
      <MobileDateTimePicker
        data-testid={'datePicker'}
        ampm={props.ampm}
        clearable={props.clearable}
        disablePast={props.disablePast}
        clearText={props.clearText}
        inputFormat={props.inputFormat}
        mask={props.mask}
        value={props.value}
        onChange={props.onChange}
        renderInput={(params: TextFieldProps) => <StyledCommonTextField {...params} placeholder={props.placeholder} />}
        allowSameDateSelection={props.allowSameDateSelection}
        dateRangeIcon={props.dateRangeIcon}
        minDateTime={props.minDateTime}
      />
    </ThemeProvider>
  );
};

export default CustomDateTimePicker;
