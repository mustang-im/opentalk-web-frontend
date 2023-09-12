// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Badge, Popover } from '@mui/material';
import { keyframes } from '@mui/system';
import { IconButton, SpeakerQueueIcon } from '@opentalk/common';
import { useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectParticipantsWaitingCount } from '../../../store/slices/participantsSlice';
import WaitingParticipantsList from './WaitingParticipantsList';

const blink = keyframes`from { opacity: 1; } to { opacity: 0.3; }`;

const WaitingListButton = styled(IconButton)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: theme.palette.secondary.contrastText,
    background: theme.palette.primary.main,
    animation: `${blink} 1s ease alternate`,
    animationIterationCount: 'infinite',
  },
}));

const WaitingParticipantsPopover = () => {
  const [waitingEl, setWaitingEl] = useState<null | HTMLElement>(null);
  const participantsInWaitingRoomCount = useAppSelector(selectParticipantsWaitingCount);

  const toggleWaitingPopper = (event: React.MouseEvent<HTMLElement>) => {
    setWaitingEl(waitingEl ? null : event.currentTarget);
  };

  return participantsInWaitingRoomCount === 0 ? (
    <>{null}</>
  ) : (
    <StyledBadge
      badgeContent={participantsInWaitingRoomCount}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <WaitingListButton aria-describedby={'view-select'} onClick={toggleWaitingPopper}>
        <SpeakerQueueIcon />
      </WaitingListButton>
      <Popover
        open={Boolean(waitingEl)}
        anchorEl={waitingEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={() => setWaitingEl(null)}
        disablePortal
      >
        <WaitingParticipantsList />
      </Popover>
    </StyledBadge>
  );
};

export default WaitingParticipantsPopover;
