// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { useRef } from 'react';

import { useAppSelector } from '../../hooks';
import { selectSlicedParticipants } from '../../store/slices/participantsSlice';
import { selectGridViewOrder, selectPaginationPageState } from '../../store/slices/uiSlice';
import GridCell from './fragments/GridCell';

const GridContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'videoWidth',
})<{ videoWidth: number }>(({ theme, videoWidth }) => {
  return {
    width: '100%',
    display: 'grid',
    gridGap: theme.spacing(1),
    alignContent: 'center',
    gridAutoFlow: 'row',
    [theme.breakpoints.up('md')]: {
      height: '100%',
      gridTemplateColumns: `repeat(auto-fit, minmax(calc(${videoWidth}% - ${theme.spacing(1)}), 1fr))`,
    },
  };
});

export const MAX_GRID_TILES = 9;

const GridView = () => {
  const selectedPage = useAppSelector(selectPaginationPageState);
  const gridViewOrder = useAppSelector(selectGridViewOrder);
  const slicedParticipants = useAppSelector(selectSlicedParticipants(selectedPage, MAX_GRID_TILES, gridViewOrder));
  const lastPage = useRef<number>(0);

  const videoWidth = slicedParticipants.length <= 4 ? 50 : 33.3;
  const direction = selectedPage > lastPage.current ? 'left' : 'right';

  lastPage.current = selectedPage;

  const highlight = slicedParticipants.length >= 2;

  const gridCells = slicedParticipants.map((participant, index) => (
    <GridCell
      key={participant.id}
      direction={direction}
      index={index}
      participantId={participant.id}
      highlight={highlight}
    />
  ));

  return <GridContainer videoWidth={videoWidth}>{gridCells}</GridContainer>;
};

export default GridView;
