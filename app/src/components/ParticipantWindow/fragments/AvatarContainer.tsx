// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Grid } from '@mui/material';
import { ParticipantAvatar, ParticipantId, ParticipationKind } from '@opentalk/common';

import { useAppSelector } from '../../../hooks';
import {
  selectParticipantAvatarUrl,
  selectParticipantName,
  selectParticipationKind,
} from '../../../store/slices/participantsSlice';

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
  participantId: ParticipantId;
}

export const AvatarContainer = ({ participantId }: AvatarContainerProps) => {
  const displayName = useAppSelector(selectParticipantName(participantId));
  const avatarUrl = useAppSelector(selectParticipantAvatarUrl(participantId));
  const participationKind = useAppSelector(selectParticipationKind(participantId));

  return (
    <Container
      container
      flexDirection={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      flexWrap={'nowrap'}
      data-testid="avatarContainer"
    >
      <Avatar src={avatarUrl} isSipParticipant={participationKind === ParticipationKind.Sip}>
        {displayName || ''}
      </Avatar>
    </Container>
  );
};
