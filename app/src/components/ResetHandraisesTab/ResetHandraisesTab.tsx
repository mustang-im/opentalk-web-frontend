// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useMemo, useState } from 'react';

import { resetRaisedHands } from '../../api/types/outgoing/moderation';
import { SearchAndSelectParticipantsTab } from '../../commonComponents/SearchAndSelectParticipantsTab';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectParticipantsWithRaisedHands } from '../../store/selectors';
import { ParticipantId } from '../../types';

const ResetHandraisesTab = () => {
  const dispatch = useAppDispatch();
  const activeParticipants = useAppSelector(selectParticipantsWithRaisedHands);

  const [search, setSearch] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantId[]>([]);

  const searchFilteredParticipantsList = useMemo(() => {
    return activeParticipants
      .filter((participant) => participant.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      .map((participant) => ({ ...participant, selected: selectedParticipants.includes(participant.id) }));
  }, [search, activeParticipants, selectedParticipants]);

  const handleSelectParticipant = (checked: boolean, participantId: ParticipantId) => {
    if (checked) {
      setSelectedParticipants((prevState) => [...prevState, participantId]);
    } else {
      setSelectedParticipants((prevState) => prevState.filter((part) => part !== participantId));
    }
  };

  const resetAllHandraises = () => {
    dispatch(resetRaisedHands.action({}));
  };

  const resetSelectedHandraises = () => {
    if (selectedParticipants.length > 0) {
      dispatch(resetRaisedHands.action({ target: selectedParticipants }));
      setSelectedParticipants([]);
    }
  };

  return (
    <SearchAndSelectParticipantsTab
      handleAllClick={resetAllHandraises}
      handleSelectedClick={resetSelectedHandraises}
      handleSelectParticipant={handleSelectParticipant}
      handleSearchChange={setSearch}
      searchValue={search}
      participantsList={searchFilteredParticipantsList}
    />
  );
};

export default ResetHandraisesTab;
