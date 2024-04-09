import { MenuItem, Select, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TimePerspectiveFilter } from "../../../../utils/eventUtils";

export enum TimeFilter {
   Month = 'month',
   Week = 'week',
   Day = 'day',
}

type EventPageFiltersProps = {
   timePerspectiveFilterValue: TimePerspectiveFilter;
   timeFilterValue: TimeFilter;
   visuallyDivide?: boolean;
}

const timePerspectiveFilterOptions: Array<TimePerspectiveFilter> = [
   TimePerspectiveFilter.TimeIndependent,
   TimePerspectiveFilter.Future,
   TimePerspectiveFilter.Past,
];

const timeFilterOptions: Array<TimeFilter> = [
   TimeFilter.Month,
   TimeFilter.Week,
   TimeFilter.Day,
];

export const EventPageFilters = (props: EventPageFiltersProps) => {
   const { t } = useTranslation();

   return (
      <Stack direction="row" alignItems="center" spacing={1} justifyContent={props.visuallyDivide ? "space-between" : undefined}>
         <Select value={props.timePerspectiveFilterValue}>
            {timePerspectiveFilterOptions.map(option => {
               return <MenuItem key={option} value={option}>{t(`dashboard-meeting-details-page-${option}`)}</MenuItem>
            })}
         </Select>
         <Select value={props.timeFilterValue}>
            {timeFilterOptions.map(option => {
               return <MenuItem key={option} value={option}>{t(`global-${option}`)}</MenuItem>
            })}
         </Select>
      </Stack>
   );
}