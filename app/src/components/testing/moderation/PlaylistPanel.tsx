import { Box } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import { createNextState } from '@reduxjs/toolkit';
import React from 'react';
import { useCallback } from 'react';
import {
  DragDropContext,
  DraggableLocation,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  DropResult,
} from 'react-beautiful-dnd';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectParticipantsIds } from '../../../store/slices/participantsSlice';
import { selectOurUuid } from '../../../store/slices/userSlice';
import DragDropParticipantList, { SortableParticipantEntry } from '../../ui/DragAndDropParticipantList';

const USER_POOL = 'user_pool';
const PLAYLIST = 'playlist';

interface PlaylistPanelProps {
  playlist: ParticipantId[];
  setPlaylist: React.Dispatch<React.SetStateAction<ParticipantId[]>>;
}

export const PlaylistPanel = ({ playlist, setPlaylist }: PlaylistPanelProps) => {
  const { t } = useTranslation();
  const participantIds = useAppSelector(selectParticipantsIds);
  const ourUuid = useAppSelector(selectOurUuid);
  const participantIdsWithUs = ourUuid ? participantIds.concat([ourUuid]) : participantIds;

  const moveParticipant = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }
      const source: DraggableLocation = result.source;
      const destination: DraggableLocation = result.destination;
      // did not move anywhere - can bail early
      if (source.droppableId === destination.droppableId && source.index === destination.index) {
        return;
      }
      if (source.droppableId === PLAYLIST && destination.droppableId === PLAYLIST) {
        // We operate in the playlist
        setPlaylist(
          createNextState(playlist, (draft) => {
            draft.splice(source.index, 1);
            draft.splice(destination.index, 0, result.draggableId as ParticipantId);
          })
        );
      } else if (source.droppableId === PLAYLIST && destination.droppableId === USER_POOL) {
        // Move from PLAYLIST to USER_POOL, deselect user
        setPlaylist(
          createNextState(playlist, (draft) => {
            draft.splice(source.index, 1);
          })
        );
      } else if (source.droppableId === USER_POOL && destination.droppableId === PLAYLIST) {
        // Move from USER_POOL to USER_POOL, selecting a user
        setPlaylist(
          createNextState(playlist, (draft) => {
            draft.splice(destination.index, 0, result.draggableId as ParticipantId);
          })
        );
      }
    },
    [playlist, setPlaylist]
  );

  return (
    <>
      <h4>{t('automod-playlist-tab-header')}</h4>
      <p>{t('automod-playlist-tab-help')}</p>
      <DragDropContext onDragEnd={moveParticipant}>
        <Box display="flex" justifyContent="space-around">
          <div>
            <h5>{t('automod-unselected-users')}:</h5>
            <Droppable
              droppableId={USER_POOL}
              isDropDisabled={false}
              renderClone={(provided, snapshot, descriptor) => (
                <SortableParticipantEntry
                  id={participantIdsWithUs[descriptor.source.index] as ParticipantId}
                  index={descriptor.source.index}
                  provided={provided}
                  isDragging={snapshot.isDragging}
                />
              )}
            >
              {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                <DragDropParticipantList
                  entries={(participantIdsWithUs as ParticipantId[]).filter((e) => !playlist.includes(e))}
                  dropProvided={dropProvided}
                  dropSnapshot={dropSnapshot}
                />
              )}
            </Droppable>
          </div>
          <div>
            <h5>{t('automod-playlist')}:</h5>
            <Droppable
              droppableId="playlist"
              isDropDisabled={false}
              renderClone={(provided, snapshot, descriptor) => (
                <SortableParticipantEntry
                  id={playlist[descriptor.source.index] as ParticipantId}
                  index={descriptor.source.index}
                  provided={provided}
                  isDragging={snapshot.isDragging}
                />
              )}
            >
              {(dropProvided: DroppableProvided, dropSnapshot: DroppableStateSnapshot) => (
                <DragDropParticipantList entries={playlist} dropProvided={dropProvided} dropSnapshot={dropSnapshot} />
              )}
            </Droppable>
          </div>
        </Box>
      </DragDropContext>
    </>
  );
};
export default PlaylistPanel;
