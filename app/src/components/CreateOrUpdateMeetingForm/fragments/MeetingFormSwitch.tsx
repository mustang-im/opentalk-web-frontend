// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormControlLabel as MuiFormControlLabel, Stack, Switch, SwitchProps, styled } from '@mui/material';

interface MeetingFormSwitchProps {
  switchProps: SwitchProps;
  checked: boolean;
  switchValueLabel: string;
}

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  margin: 0,
  gap: theme.spacing(1),
  verticalAlign: 'baseline',
  width: 'max-content',
}));

const MeetingFormSwitch = ({ switchProps, checked, switchValueLabel }: MeetingFormSwitchProps) => {
  return (
    <Stack>
      <FormControlLabel checked={checked} control={<Switch {...switchProps} />} label={switchValueLabel} />
    </Stack>
  );
};

export default MeetingFormSwitch;
