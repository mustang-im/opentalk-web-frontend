// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Container } from '@mui/material';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import Toggle from './Toggle';

const options = [
  {
    value: 'month',
    label: 'Month',
  },
  {
    value: 'week',
    label: 'Week',
  },
  {
    value: 'day',
    label: 'Day',
  },
];

export default {
  title: 'components/Toggle',
  component: Toggle,
} as ComponentMeta<typeof Toggle>;

export const Basic: ComponentStory<typeof Toggle> = (props) => (
  <Container>
    <Toggle {...props} options={options} />
  </Container>
);
