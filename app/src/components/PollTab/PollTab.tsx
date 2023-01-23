// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, styled } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { selectSavedPollPerId } from '../../store/slices/pollSlice';
import CreatePollForm from './fragments/CreatePollForm';
import PollOverview from './fragments/PollOverview';

const PollContainer = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 'calc(100vh - 19em)',
  overflow: 'auto',
});

const PollTab = () => {
  const [showPollForm, setShowPollForm] = useState(false);
  const [savedPollFormId, setSavedPollFormId] = useState<number | undefined>();
  const formValues = useAppSelector(selectSavedPollPerId(savedPollFormId));
  const { t } = useTranslation();

  const handleOnClickSavedPollItem = (id: number | undefined) => {
    setSavedPollFormId(id);
    setShowPollForm(true);
  };

  const handleOnClose = () => {
    setSavedPollFormId(undefined);
    setShowPollForm(false);
  };

  return (
    <PollContainer>
      {showPollForm ? (
        <CreatePollForm initialValues={formValues} onClose={handleOnClose} />
      ) : (
        <Box flex={1} display={'flex'} flexWrap={'wrap'} justifyContent={'center'}>
          <PollOverview onClickItem={handleOnClickSavedPollItem} />
          <Box alignSelf={'flex-end'}>
            <Button onClick={() => setShowPollForm(true)}>{t('poll-overview-button-create-poll')}</Button>
          </Box>
        </Box>
      )}
    </PollContainer>
  );
};

export default PollTab;
