// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Stack, Typography } from '@mui/material';
import { SortOption, sortParticipantsWithConfig } from '@opentalk/common';
import React, { memo, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { selectNext, talkingStickStart, stop as talkingStickStop } from '../../api/types/outgoing/automod';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { selectCombinedUserFirstAndParticipantsInConference } from '../../store/selectors';
import { selectAutomodActiveState, selectAutomoderationParticipantIds } from '../../store/slices/automodSlice';
import { TalkingStickParticipantList } from '../TalkingStickParticipantList';
import { TalkingStickSortButton } from '../TalkingStickSortButton';

const TalkingStickTabPanel = () => {
  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const configurationParticipants = useAppSelector(selectCombinedUserFirstAndParticipantsInConference);
  const isAutomodActive = useAppSelector(selectAutomodActiveState);
  const runningParticipantIds = useAppSelector(selectAutomoderationParticipantIds);
  const participantsWithoutUser = configurationParticipants.slice(1);

  const userInitiatingTalkingStick = configurationParticipants[0];

  const activeParticipants = useMemo(() => {
    const map = new Map();
    for (const participant of configurationParticipants) {
      map.set(participant.id, participant);
    }
    return runningParticipantIds.map((id) => map.get(id)).filter(Boolean);
  }, [configurationParticipants, runningParticipantIds]);

  const [selectedSortType, setSelectedSortType] = useState<SortOption>(SortOption.NameASC);

  const sortParticipants = useCallback(sortParticipantsWithConfig({ language: i18n.language }), [i18n.language]);

  const sortedParticipants = useMemo(() => {
    return sortParticipants(participantsWithoutUser, selectedSortType);
  }, [participantsWithoutUser, sortParticipants, selectedSortType]);

  const handleStart = useCallback(() => {
    const participantIdList = sortedParticipants.map((participant) => participant.id);
    dispatch(
      talkingStickStart.action({
        playlist: [userInitiatingTalkingStick.id, ...participantIdList],
      })
    );
  }, [sortedParticipants]);

  const handleStop = () => {
    dispatch(talkingStickStop.action());
  };

  const handleSkipSpeaker = () => {
    dispatch(selectNext.action());
  };

  return (
    <Stack spacing={2} flex={1} overflow="hidden">
      {!isAutomodActive && (
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography>{t('sort-label')}</Typography>
          {/* Component auto closes when selected sort type changes. */}
          <TalkingStickSortButton
            key={selectedSortType}
            selectedSortType={selectedSortType}
            onChange={setSelectedSortType}
          />
        </Box>
      )}
      <Stack overflow="hidden" flex={1}>
        <TalkingStickParticipantList participants={isAutomodActive ? activeParticipants : sortedParticipants} />
      </Stack>
      <Stack>
        {!isAutomodActive ? (
          <Button type="button" onClick={handleStart}>
            {t('global-start-now')}
          </Button>
        ) : (
          <Stack flexDirection="column" spacing={1}>
            <Button type="button" onClick={handleSkipSpeaker}>
              {t('talking-stick-skip-speaker')}
            </Button>
            <Button type="button" color="secondary" onClick={handleStop}>
              {t('global-stop')}
            </Button>
          </Stack>
        )}
      </Stack>
    </Stack>
  );
};

export default memo(TalkingStickTabPanel);
