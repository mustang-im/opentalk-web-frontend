// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid } from '@mui/material';
import { MediaSessionType, ParticipantId } from '@opentalk/common';
import { useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { requestMute } from '../../api/types/outgoing/media';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { SubscriberConfig } from '../../modules/WebRTC';
import { selectUnmutedParticipants } from '../../store/selectors';
import { selectAllSubscribers } from '../../store/slices/mediaSubscriberSlice';
import { Participant } from '../../store/slices/participantsSlice';
import SearchTextField from '../SearchTextField/index';
import MuteParticipantsList from './fragments/MuteParticipantsList';

export interface MutedParticipant extends Participant {
  selected: boolean;
}

const MuteParticipants = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const activeParticipants = useAppSelector(selectUnmutedParticipants);
  const allSubscribers = useAppSelector(selectAllSubscribers);

  const [search, setSearch] = useState<string>('');
  const [selectedParticipants, setSelectedParticipants] = useState<ParticipantId[]>([]);

  const participantsList = useMemo(() => {
    return activeParticipants
      .filter((participant) => participant.displayName.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      .map((participant) => ({ ...participant, selected: selectedParticipants.includes(participant.id) }));
  }, [search, activeParticipants, selectedParticipants]);

  const handleSearchChange = (value: string) => setSearch(value);

  const handleSelectParticipant = (checked: boolean, participantId: ParticipantId) => {
    if (checked) {
      setSelectedParticipants((prevState) => [...prevState, participantId]);
    } else {
      setSelectedParticipants((prevState) => prevState.filter((part) => part !== participantId));
    }
  };

  const muteAll = useCallback(() => {
    const unmutedIds = allSubscribers
      .filter((subscriber: SubscriberConfig) => subscriber.mediaType === MediaSessionType.Video && subscriber.audio)
      .map((subscriber) => subscriber.participantId);
    dispatch(requestMute.action({ targets: unmutedIds, force: true }));
  }, [allSubscribers, dispatch]);

  const muteSelected = useCallback(() => {
    const subscribersIds = allSubscribers
      .filter(
        (subscriber: SubscriberConfig) =>
          selectedParticipants.includes(subscriber.participantId) &&
          subscriber.mediaType === MediaSessionType.Video &&
          subscriber.audio
      )
      .map((subscriber) => subscriber.participantId);
    dispatch(requestMute.action({ targets: subscribersIds, force: true }));
  }, [allSubscribers, selectedParticipants, dispatch]);

  return (
    <Grid container spacing={2}>
      <Grid item container spacing={1} xs={12}>
        <Grid item xs={6} display="flex">
          <Button onClick={muteAll}>{t('mute-participants-button-all')}</Button>
        </Grid>
        <Grid item xs={6} display="flex">
          <Button onClick={muteSelected}>{t('mute-participants-button-selected')}</Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <SearchTextField onSearch={(v) => handleSearchChange(v)} fullWidth />
      </Grid>
      <Grid item xs={12}>
        <MuteParticipantsList participantsList={participantsList} onCheck={handleSelectParticipant} />
      </Grid>
    </Grid>
  );
};

export default MuteParticipants;
