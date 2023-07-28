// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { DateTime } from '@opentalk/rest-api-rtk-query';
import React from 'react';

import { configureStore, render, screen, cleanup, eventMockedData } from '../../../utils/testUtils';
import EventsPage, { filterByTimePeriod } from './EventsOverviewPage';
import { TimeFilter } from './fragments/EventsPageHeader';

const createMockEvent = () => ({
  title: 'some title',
  events: [{ ...eventMockedData }],
});

jest.mock('../../../api/rest', () => ({
  ...jest.requireActual('../../../api/rest'),
  useGetEventsQuery: () => ({
    isLoading: false,
    events: [createMockEvent()],
    isFatching: false,
  }),
  useGetMeQuery: () => ({
    data: {
      id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167',
    },
  }),
}));

jest.mock('../../../templates/DashboardTemplate', () => ({
  useHeader: () => ({
    setHeader: jest.fn(),
  }),
}));

describe('Dashboard EventsPage', () => {
  afterEach(() => cleanup());
  test('page will not crash', async () => {
    const { store } = configureStore();
    await render(<EventsPage />, store);
    expect(screen.getByText('dashboard-events-my-meetings')).toBeInTheDocument();
  });

  test('it will render 1 Accordion', async () => {
    const { store } = configureStore();
    await render(<EventsPage />, store);

    expect(screen.getByTestId('EventAccordion')).toBeInTheDocument();
    expect(screen.getAllByTestId('EventAccordion')).toHaveLength(1);
  });
});

describe('Unit test filterByTimePeriod function used for grouping the events by timePeriod', () => {
  test('filterByTimePeriod function should return month', () => {
    expect(filterByTimePeriod(TimeFilter.Month, '2022-04-06T13:57:38.793602Z' as DateTime)).toBe('April 2022');
  });

  test('filterByTimePeriod function should return day', () => {
    expect(filterByTimePeriod(TimeFilter.Day, '2022-04-06T13:57:38.793602Z' as DateTime)).toBe('April 6, 2022');
  });

  test('filterByTimePeriod function should return week', () => {
    expect(filterByTimePeriod(TimeFilter.Week, '2022-04-06T13:57:38.793602Z' as DateTime)).toBe(
      'global-calendar-week: 14 (04/04/2022 - 04/10/2022)'
    );
  });
});
