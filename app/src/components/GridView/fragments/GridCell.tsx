// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Slide, keyframes } from '@mui/material';
import { ParticipantId } from '@opentalk/common';

import { useAppSelector } from '../../../hooks';
import { selectIsParticipantSpeaking } from '../../../store/slices/participantsSlice';
import ParticipantWindow from '../../ParticipantWindow';

const breathe = keyframes`
  0% {
    opacity: 0.6;
  }

 100% {
    opacity: 1;
  }
`;

const CinemaCell = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isActiveSpeaker',
})<{ highlight: boolean }>(({ theme, highlight }) => ({
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  overflow: 'hidden',
  borderRadius: '1em',
  position: 'relative',

  '&::before': {
    content: '""',
    display: 'block',
    height: 0,
    width: 0,
    paddingBottom: 'calc(9/16 * 100%)',
  },

  '&::after': {
    content: '""',
    position: 'absolute',
    display: 'block',
    width: '100%',
    height: '100%',
    inset: '0',
    borderRadius: '1em',
    boxShadow: `inset 0px 0px 0px ${highlight ? 2 : 0}px ${theme.palette.primary.main}`,
    transition: `all 300ms linear`,
    pointerEvents: 'none',
    animation: highlight ? `${breathe} 1s infinite ease-in-out alternate` : 'none',
  },
}));

type GridCellProps = {
  direction: 'left' | 'right';
  index: number;
  participantId: ParticipantId;
  highlight: boolean;
};

const GridCell = (props: GridCellProps) => {
  const { direction, index, participantId, highlight } = props;
  const isParticipantSpeaking = useAppSelector(selectIsParticipantSpeaking(participantId));
  const highlightSpeaker = highlight && (isParticipantSpeaking ?? false);
  return (
    <Slide direction={direction} key={participantId} in mountOnEnter unmountOnExit>
      <CinemaCell data-testid="cinemaCell" highlight={highlightSpeaker}>
        <ParticipantWindow key={participantId} participantId={participantId} mediaRef={`grid-${index}`} />
      </CinemaCell>
    </Slide>
  );
};

export default GridCell;
