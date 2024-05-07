// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DateTime } from '@opentalk/rest-api-rtk-query';
import { TimePerspectiveFilter } from '../../../utils/eventUtils';

export enum TimeFilter {
   Month = 'month',
   Week = 'week',
   Day = 'day',
}

export interface DashboardEventsFilters {
   timePeriod: TimeFilter;
   timeMin?: DateTime;
   timeMax?: DateTime;
   openInvitedMeeting?: boolean;
   favoriteMeetings?: boolean;
   timePerspective: TimePerspectiveFilter;
}

export type FilterChangeCallbackType = <K extends keyof DashboardEventsFilters>(key: K, value?: DashboardEventsFilters[K]) => void;