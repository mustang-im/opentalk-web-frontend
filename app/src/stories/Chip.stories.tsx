// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Avatar, Chip, Container } from '@mui/material';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { CloseIcon } from '../assets/icons';
import hansolo from '../assets/logo.svg';

export default {
  title: 'components/Chip',
  component: Chip,
} as ComponentMeta<typeof Chip>;

export const Basic: ComponentStory<typeof Chip> = () => (
  <Container>
    <Chip
      label="Luisa Grauweiler"
      onDelete={() => alert('delete')}
      deleteIcon={<CloseIcon />}
      avatar={<Avatar src={hansolo} />}
    />
  </Container>
);
