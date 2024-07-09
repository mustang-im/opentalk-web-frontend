// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Stack } from '@mui/material';
import { ParticipantId } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SearchInput from './fragments/SearchInput';
import { SelectableParticipant } from './fragments/SelectParticipantsItem';
import SelectParticipantsList from './fragments/SelectParticipantsList';

type SelectParticipantsBoxProps = {
  handleAllClick: () => void;
  handleSelectedClick: () => void;
  handleSelectParticipant: (checked: boolean, participantId: ParticipantId) => void;
  participantsList: SelectableParticipant[];
  searchValue: string;
  handleSearchChange: (searchValue: string) => void;
};

function SearchAndSelectParticipantsTab({
  handleAllClick,
  handleSelectedClick,
  handleSelectParticipant,
  searchValue,
  handleSearchChange,
  participantsList,
}: SelectParticipantsBoxProps) {
  const { t } = useTranslation();

  return (
    <Stack flex={1} spacing={2} overflow="hidden">
      <Box display="flex" justifyContent="space-between" gap={2}>
        <Button onClick={handleAllClick} fullWidth>
          {t('global-all')}
        </Button>
        <Button onClick={handleSelectedClick} fullWidth>
          {t('global-selected')}
        </Button>
      </Box>
      <SearchInput searchValue={searchValue} onSearch={handleSearchChange} />
      <Box overflow="auto">
        <SelectParticipantsList participantsList={participantsList} onCheck={handleSelectParticipant} />
      </Box>
    </Stack>
  );
}

export default SearchAndSelectParticipantsTab;
