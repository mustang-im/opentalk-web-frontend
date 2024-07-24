// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Frequency, RRule } from '@heinlein-video/rrule';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent as MuiDialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
} from '@mui/material';
import { CommonTextField } from '@opentalk/common';
import { RecurrencePattern } from '@opentalk/rest-api-rtk-query';
import { ChangeEvent, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import {
  PartialRRuleOptions,
  RRuleObject,
  getRRuleDayOfWeekIndex,
  getRRuleText,
  FrequencyOption,
} from '../../../../utils/rruleUtils';
import { CustomEndOptions } from './CustomEndDateOptions';
import { CustomMonthlyOptions } from './CustomMonthlyOptions';
import { CustomWeeklyOptions } from './CustomWeeklyOptions';

export interface RecurringEventDialogProps extends DialogProps {
  open: boolean;
  closeDialog: () => void;
  selectCustomFrequencyOption: (option: FrequencyOption) => void;
  recurrenceStartTimestamp: string;
  initialRRule?: string;
}

const NumberInput = styled(CommonTextField)(({ theme }) => ({
  maxWidth: '4rem',
  '& .MuiInputBase-input.MuiOutlinedInput-input': {
    paddingRight: theme.spacing(0),
    textAlign: 'center',
  },
}));

const DialogContent = styled(MuiDialogContent)(({ theme }) => ({
  '& .MuiInputBase-input.MuiOutlinedInput-input': {
    padding: theme.spacing(1.5, 5, 1.5, 2),
  },
  '& .MuiSelect-icon': {
    fontSize: theme.typography.pxToRem(30),
  },
}));

const CommonLabel = styled(InputLabel)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
}));

const EndOptionLabel = styled(CommonLabel)(({ theme }) => ({
  [theme.breakpoints.up('sm')]: {
    paddingTop: theme.spacing(1.5),
  },
}));

const RECURRING_DIALOG_LABEL_ID = 'recurrence-dialog-title';

export const RecurringEventDialog = ({
  open,
  closeDialog,
  selectCustomFrequencyOption,
  recurrenceStartTimestamp,
  initialRRule,
  ...props
}: RecurringEventDialogProps) => {
  const { t } = useTranslation();
  const recurrenceFrequency = [
    { translationKey: 'day', value: RRule.DAILY },
    { translationKey: 'week', value: RRule.WEEKLY },
    { translationKey: 'month', value: RRule.MONTHLY },
    { translationKey: 'year', value: RRule.YEARLY },
  ];

  const recurrenceStartDate = new Date(recurrenceStartTimestamp);

  const initialRRuleObject = useMemo(
    () => (initialRRule ? new RRule({ ...RRule.parseString(initialRRule) }) : undefined),
    [initialRRule]
  );

  const [rruleObject, setRRuleObject] = useState<RRuleObject>(
    //Each time you create a new RRule it automatically adds dtstart and a few other fields
    //If we already have a predefined RRule which has its own dtstart and we parse that it gets added to the recurrence pattern
    //Since the backend does not allow DTSTART as part of the pattern we need to make sure it does not get in
    //By using the origOptions we guarantee that we use the options coming from the initial backend pattern, which will always exclude DTSTART
    //We pass the frequency manually, since in the origOptions it is possible to be optional
    //byweekday is being passed as a workaround, since in the library the fields do not match in options and origOptions - https://github.com/jkbrzt/rrule?tab=readme-ov-file#instance-properties
    initialRRuleObject?.origOptions
      ? {
          ...initialRRuleObject.origOptions,
          freq: initialRRuleObject.options.freq,
          byweekday: initialRRuleObject.options.byweekday,
        }
      : { freq: RRule.DAILY, interval: 1 }
  );

  /**
   * Helper function for updating that keeps rest of options as they were, but prevents from updating frequency.
   *
   * Frequency is only set from initial dropdown to reset extra options that some types add.
   * @param options Any rrule option except frequency
   */
  const updateRRuleObject = (options: PartialRRuleOptions) => {
    setRRuleObject((state) => ({
      ...state,
      ...options,
    }));
  };

  const renderFrequencyDetails = () => {
    switch (rruleObject.freq) {
      case RRule.WEEKLY:
        return <CustomWeeklyOptions rRuleObject={rruleObject} updateRRuleObject={updateRRuleObject} />;
      case RRule.MONTHLY:
        return <CustomMonthlyOptions recurrenceStartDate={recurrenceStartDate} updateRRuleObject={updateRRuleObject} />;
      case RRule.YEARLY:
      case RRule.DAILY:
      default:
        return null;
    }
  };

  //Main setting point for frequency. It keeps interval and until, but will reset the rest of the state to prevent leftover fields.
  const handleFrequencySelect = (value: Frequency) => {
    setRRuleObject((state) => {
      //Since there is no way to set a default value for month select option we need to pass it here.
      const byMonthDay = value === RRule.MONTHLY ? recurrenceStartDate.getDate() : undefined;
      //If we select weekly we start with a default value of current weekday
      const byWeekday = value === RRule.WEEKLY ? [getRRuleDayOfWeekIndex(recurrenceStartDate.getDay())] : undefined;
      return {
        freq: value,
        interval: state.interval,
        until: state.until,
        bymonthday: byMonthDay,
        byweekday: byWeekday,
      };
    });
  };

  const handleIntervalChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const parsedValue = parseInt(event.currentTarget.value);
    const isParsedValueValid = typeof parsedValue === 'number' && parsedValue > 0;
    updateRRuleObject({ interval: isParsedValueValid ? parsedValue : 1 });
  };

  const handleSelectRRule = () => {
    const rrule = new RRule({ ...rruleObject });
    const rruleLabel = getRRuleText(rrule);
    const rruleValue = rrule.toString() as RecurrencePattern;
    selectCustomFrequencyOption({ label: rruleLabel, value: rruleValue });
    closeDialog();
  };

  return (
    <Dialog
      {...props}
      open={open}
      onClose={closeDialog}
      aria-labelledby={RECURRING_DIALOG_LABEL_ID}
      data-testid="recurrence-dialog"
    >
      <DialogTitle id={RECURRING_DIALOG_LABEL_ID}>{t('dashboard-recurrence-dialog-title')}</DialogTitle>

      <DialogContent>
        <Grid container rowGap={2}>
          <Grid container alignItems="center">
            <Grid item sm={4}>
              <CommonLabel>{t('dashboard-recurrence-dialog-frequency-label')}</CommonLabel>
            </Grid>

            <Grid container item sm={8} justifyItems="baseline" alignItems="center" spacing={2}>
              <Grid item sm="auto">
                <NumberInput
                  type="number"
                  value={rruleObject.interval?.toString()}
                  onChange={handleIntervalChange}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item sm="auto">
                <Select value={rruleObject.freq} data-testid="frequency-select">
                  {recurrenceFrequency.map((entry) => (
                    <MenuItem
                      key={entry.translationKey}
                      value={entry.value}
                      onClick={() => handleFrequencySelect(entry.value)}
                    >
                      {t(`dashboard-recurrence-dialog-frequency-${entry.translationKey}`, {
                        count: rruleObject.interval,
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </Grid>
          {(rruleObject.freq === RRule.MONTHLY || rruleObject.freq === RRule.WEEKLY) && (
            <Grid container alignItems="center">
              <Grid item sm={4}>
                <InputLabel>{t('dashboard-recurrence-dialog-frequency-details-label')}</InputLabel>
              </Grid>
              {renderFrequencyDetails()}
            </Grid>
          )}
          <Grid container>
            <Grid sm={4} item>
              <EndOptionLabel>{t('dashboard-recurrence-dialog-end-label')}</EndOptionLabel>
            </Grid>
            <Grid sm={8} container item>
              <CustomEndOptions
                rRuleObject={rruleObject}
                updateRRuleObject={updateRRuleObject}
                minDate={recurrenceStartDate}
              />
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="secondary" onClick={closeDialog}>
          {t('dashboard-recurrence-dialog-close-button')}
        </Button>
        <Button variant="contained" onClick={handleSelectRRule}>
          {t('dashboard-recurrence-dialog-save-button')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
