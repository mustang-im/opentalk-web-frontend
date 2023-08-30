import { memo, useCallback } from 'react';

import { useAppDispatch, useAppSelector } from '../../../hooks';
import {
  selectParticipantsSearchValue,
  selectShowParticipantGroups,
  setParticipantsSearchValue,
} from '../../../store/slices/uiSlice';
import SearchTextField from '../../SearchTextField';
import ParticipantGroupByForm from './ParticipantGroupByForm';
import ParticipantGroups from './ParticipantGroups';
import ParticipantNoGroups from './ParticipantNoGroups';

const ParticipantsContainer = () => {
  const dispatch = useAppDispatch();
  const groupParticipantsEnabled = useAppSelector(selectShowParticipantGroups);
  const searchValue = useAppSelector(selectParticipantsSearchValue);

  const dispatchNextSearchValue = useCallback((nextSearchValue: string) => {
    dispatch(setParticipantsSearchValue(nextSearchValue));
  }, []);

  return (
    <>
      <SearchTextField searchValue={searchValue} onSearch={dispatchNextSearchValue} fullWidth showSort />
      <ParticipantGroupByForm />
      {groupParticipantsEnabled ? <ParticipantGroups flex={1} /> : <ParticipantNoGroups />}
    </>
  );
};

export default memo(ParticipantsContainer);
