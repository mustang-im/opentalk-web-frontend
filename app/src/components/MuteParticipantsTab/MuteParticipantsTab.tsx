// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useState, useMemo } from 'react';

import { requestMute } from '../../api/types/outgoing/media';
import { SearchAndSelectParticipantsTab } from '../../commonComponents/SearchAndSelectParticipantsTab';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { selectUnmutedParticipants } from '../../store/selectors';
import { ParticipantId } from '../../types';

const MuteParticipantsTab = () => {
  const dispatch = useAppDispatch();
  const unmutedParticipants = useAppSelector(selectUnmutedParticipants);

  const [search, setSearch] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantId[]>([]);

  const participantsList = useMemo(() => {
    return unmutedParticipants
      .filter((participant) => participant.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      .map((participant) => ({ ...participant, selected: selectedParticipants.includes(participant.id) }));
  }, [search, unmutedParticipants, selectedParticipants]);

  const handleSelectParticipant = (checked: boolean, participantId: ParticipantId) => {
    if (checked) {
      setSelectedParticipants((prevState) => [...prevState, participantId]);
    } else {
      setSelectedParticipants((prevState) => prevState.filter((part) => part !== participantId));
    }
  };

  const muteAll = () => {
    const unmutedParticipantIds = unmutedParticipants.map((participant) => participant.id);
    dispatch(requestMute.action({ targets: unmutedParticipantIds, force: true }));
  };

  const muteSelected = () => {
    dispatch(requestMute.action({ targets: selectedParticipants, force: true }));
    setSelectedParticipants([]);
  };

  return (
    <SearchAndSelectParticipantsTab
      handleAllClick={muteAll}
      handleSelectedClick={muteSelected}
      handleSelectParticipant={handleSelectParticipant}
      handleSearchChange={setSearch}
      searchValue={search}
      participantsList={participantsList}
    />
  );
};

export default MuteParticipantsTab;
