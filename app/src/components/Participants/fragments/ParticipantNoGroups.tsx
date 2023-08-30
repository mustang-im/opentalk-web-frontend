// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { useMemo } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectAllParticipantsSortedAndFiltered } from '../../../store/selectors';
import ParticipantSimpleList from './ParticipantSimpleList';

const ParticipantNoGroups = () => {
  const participants = useAppSelector(selectAllParticipantsSortedAndFiltered);
  const participantIds = participants.map((p) => p.id);

  const cachedParticipants = useMemo(() => {
    return participants;
  }, [participantIds.toString()]);

  return <ParticipantSimpleList participants={cachedParticipants} />;
};

export default ParticipantNoGroups;
