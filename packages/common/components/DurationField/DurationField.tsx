// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Button,
  ButtonProps,
  Chip as MuiChip,
  FormHelperText,
  Popover,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { isNumber } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ClockIcon } from '../../assets/icons';
import { IFormikCustomFieldPropsReturnDurationValue } from '../../utils';
import TextField from '../TextField';
import { MenuTitle } from '../ToolbarMenuUtils/ToolbarMenuUtils';

export type DurationValueOptions = number | 'custom' | null;
interface IDurationFieldProps extends IFormikCustomFieldPropsReturnDurationValue {
  name: string;
  /**
   * Options:
   * - null for unlimited time
   * - number (in minutes)
   * - 'custom'
   *
   * Default:
   * - [null, 5, 10, 15, 30, 'custom']
   */
  durationOptions?: Array<DurationValueOptions>;
  ButtonProps?: ButtonProps;
  min?: number;
  allowEmpty?: boolean;
}

const DURATION_OPTIONS: Array<DurationValueOptions> = [null, 5, 10, 15, 30, 'custom'];

const NumberInput = styled(TextField)({
  maxWidth: '4rem',
  '& input': {
    paddingRight: 0,
    textAlign: 'center',
  },
});

const Chip = styled(MuiChip)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  '& .MuiChip-label': {
    padding: theme.spacing(0.5, 1),
  },
}));

const StyledClockIcon = styled(ClockIcon)({
  fill: 'currentColor',
});

const Container = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: '17.875rem',
}));

export const DurationField = ({
  name,
  value,
  setFieldValue,
  durationOptions = DURATION_OPTIONS,
  ButtonProps,
  error,
  helperText,
  min = 1,
  allowEmpty,
}: IDurationFieldProps) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const [customDurationFieldValue, setCustomDurationFieldValue] = React.useState<number | null>(
    value && durationOptions.includes(value) ? value : min
  );

  const [selectedChip, setSelectedChip] = useState<DurationValueOptions>(isNumber(value) ? value : null);
  const { t } = useTranslation();

  const showCustomDurationField = selectedChip === 'custom';

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  const renderButtonText = () => (value ? `${value} min` : t('field-duration-unlimited-time'));

  const getChipLabel = (duration: DurationValueOptions) => {
    switch (duration) {
      case 'custom':
        return t('field-duration-custom');
      case null:
        return t('field-duration-unlimited-time');
      default:
        return `${duration} min`;
    }
  };

  const renderDurationOptions = () => (
    <Stack spacing={1} flexDirection={'row'} flexWrap={'wrap'} justifyContent={'space-between'} alignItems={'baseline'}>
      {durationOptions.map((duration, index) => {
        return (
          <Chip
            label={getChipLabel(duration)}
            onClick={() => setSelectedChip(duration)}
            variant={selectedChip === duration ? 'filled' : 'outlined'}
            key={index}
          />
        );
      })}
    </Stack>
  );

  const handleSave = (event: React.MouseEvent<HTMLElement>) => {
    handlePopoverClose(event);

    const durationMinutes = showCustomDurationField ? customDurationFieldValue : selectedChip;
    const duration = isNumber(durationMinutes) ? durationMinutes : null;

    setFieldValue(name, duration);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseInt(event.target.value);
    if (Number.isNaN(nextValue)) {
      // If input is invalid, unless we allow empty field, we fallback to the minimum allowed value.
      setCustomDurationFieldValue(allowEmpty ? null : min);
      return;
    }
    setCustomDurationFieldValue(Math.max(min, nextValue));
  };

  const open = Boolean(anchorEl);

  return (
    <Box>
      <Button variant={'text'} onClick={handlePopoverOpen} {...ButtonProps} startIcon={<StyledClockIcon />}>
        {renderButtonText()}
      </Button>
      <Popover
        open={open}
        onClose={handlePopoverClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 118,
          horizontal: 'left',
        }}
      >
        <Container spacing={2}>
          <MenuTitle>{t('field-duration-button-text')}</MenuTitle>
          {renderDurationOptions()}
          {showCustomDurationField && (
            <Stack spacing={1}>
              <NumberInput
                type={'number'}
                inputProps={{ min }}
                onChange={handleInputChange}
                value={customDurationFieldValue}
              />
              <Typography variant="caption">{t('field-duration-input-label')}</Typography>
            </Stack>
          )}
          <Stack flexDirection={'row'} justifyContent={'space-between'}>
            <Button variant={'text'} size={'small'} onClick={handlePopoverClose}>
              {t('field-duration-button-close')}
            </Button>
            <Button size={'small'} onClick={handleSave}>
              {t('field-duration-button-save')}
            </Button>
          </Stack>
        </Container>
      </Popover>
      {error && <FormHelperText error>{helperText}</FormHelperText>}
    </Box>
  );
};
