// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Stack } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectAllOnlineParticipants } from '../../../store/slices/participantsSlice';
import IconSlideButton from './IconSlideButton';
import { Thumbnail } from './Thumbnail';

// ThumbsHolder: the surrounding container of the thumbnails
const ThumbsHolder = styled(Stack)<{ tracks: number }>(({ theme }) => ({
  margin: theme.spacing(2, 0, 0, 0),
  gridGap: theme.spacing(2),
  width: '100%',
}));

export interface ThumbsProps {
  thumbWidth: number;
  thumbsPerWindow: number;
}

const ThumbsRow = ({ thumbWidth, thumbsPerWindow }: ThumbsProps) => {
  const participants = useAppSelector(selectAllOnlineParticipants);

  const [firstVisibleParticipantIndex, setFirstVisibleParticipantIndex] = useState(0);
  const lastVisibleParticipantIndex = Math.min(firstVisibleParticipantIndex + thumbsPerWindow, participants.length);
  const currentlyVisibleParticipantsNumber = lastVisibleParticipantIndex - firstVisibleParticipantIndex;

  const slideLeft = () => {
    const newFirstIndex = Math.max(firstVisibleParticipantIndex - thumbsPerWindow, 0);
    setFirstVisibleParticipantIndex(newFirstIndex);
  };

  const slideRight = () => {
    const newFirstIndex = Math.max(participants.length - thumbsPerWindow, 0);
    const minFirstIndex = Math.min(lastVisibleParticipantIndex, newFirstIndex);
    setFirstVisibleParticipantIndex(minFirstIndex);
  };

  // we compare number of visible participants (thumbnails) with the participants length, to detect
  // if a participant, we were showing in the thumbnails row, has left the meeting
  // if there is a gap -> we update the firstVisibleParticipantIndex and move the whole row to the left
  useEffect(() => {
    if (currentlyVisibleParticipantsNumber < participants.length) {
      setFirstVisibleParticipantIndex((firstVisibleParticipantIndex) => Math.max(firstVisibleParticipantIndex - 1, 0));
    }
  }, [participants.length, currentlyVisibleParticipantsNumber]);

  const visibleParticipantIds = useMemo(
    () =>
      participants
        .slice(firstVisibleParticipantIndex, lastVisibleParticipantIndex)
        .map((participant) => participant.id),
    [participants, firstVisibleParticipantIndex, lastVisibleParticipantIndex]
  );

  return (
    <ThumbsHolder direction="row" gap={1} tracks={thumbsPerWindow} data-testid="ThumbsHolder">
      {firstVisibleParticipantIndex > 0 && (
        <IconSlideButton direction="left" aria-label="navigate-to-left" onClick={slideLeft} />
      )}
      {visibleParticipantIds.map((participantId, index) => (
        <Thumbnail width={thumbWidth} key={participantId} participantId={participantId} index={index} />
      ))}
      {lastVisibleParticipantIndex < participants.length && (
        <IconSlideButton direction="right" aria-label="navigate-to-right" onClick={slideRight} />
      )}
    </ThumbsHolder>
  );
};

export default ThumbsRow;
