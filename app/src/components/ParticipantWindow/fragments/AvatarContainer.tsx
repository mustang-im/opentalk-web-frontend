// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Grid } from '@mui/material';
import { ParticipantAvatar } from '@opentalk/common';
import React from 'react';

const Container = styled(Grid)({
  transition: 'all 300ms linear',
  '& *': {
    transition: 'opacity 300ms linear 300ms',
  },
});

const Avatar = styled(ParticipantAvatar)(({ theme }) => ({
  width: theme.spacing(10),
  height: theme.spacing(10),
}));

interface AvatarContainerProps {
  children: string;
  avatarUrl?: string;
  isSipParticipant?: boolean;
}

export const AvatarContainer = ({ avatarUrl, children, isSipParticipant = false }: AvatarContainerProps) => (
  <Container
    container
    flexDirection={'column'}
    justifyContent={'center'}
    alignItems={'center'}
    flexWrap={'nowrap'}
    data-testid="avatarContainer"
  >
    <Avatar src={avatarUrl} isSipParticipant={isSipParticipant}>
      {children}
    </Avatar>
  </Container>
);
