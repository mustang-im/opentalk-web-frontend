// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { FormControlLabel as MuiFormControlLabel, Stack, Switch, SwitchProps, styled, Tooltip } from '@mui/material';

interface MeetingFormSwitchProps {
  switchProps: SwitchProps;
  checked: boolean;
  switchValueLabel: string;
  tooltipTitle?: string;
}

const FormControlLabel = styled(MuiFormControlLabel)(({ theme }) => ({
  margin: 0,
  gap: theme.spacing(1),
  verticalAlign: 'baseline',
  width: 'max-content',
}));

interface ConditionalTooltipProps {
  title: string | undefined;
  children: React.ReactElement;
}

const ConditionalTooltip = (props: ConditionalTooltipProps) => {
  const { children, title } = props;
  return title ? <Tooltip title={title}>{children}</Tooltip> : <>{children}</>;
};

const MeetingFormSwitch = ({ switchProps, checked, switchValueLabel, tooltipTitle }: MeetingFormSwitchProps) => {
  return (
    <Stack>
      <ConditionalTooltip title={tooltipTitle}>
        <FormControlLabel checked={checked} control={<Switch {...switchProps} />} label={switchValueLabel} />
      </ConditionalTooltip>
    </Stack>
  );
};

export default MeetingFormSwitch;
