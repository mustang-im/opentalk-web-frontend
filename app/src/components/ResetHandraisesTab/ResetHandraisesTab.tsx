// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, styled } from '@mui/material';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { resetRaisedHands } from '../../api/types/outgoing/moderation';
import { useAppDispatch } from '../../hooks';
import { Participant } from '../../store/slices/participantsSlice';

const Container = styled('div')({
  flex: 1,
  maxWidth: '100%',
});

export interface MutedParticipant extends Participant {
  selected: boolean;
}

const ResetHandraisesTab = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const resetAllHandraises = useCallback(() => {
    dispatch(resetRaisedHands.action());
  }, [dispatch]);

  return (
    <Container>
      <Stack alignItems={'center'}>
        <Button onClick={resetAllHandraises}>{t('reset-handraises')}</Button>
      </Stack>
    </Container>
  );
};

export default ResetHandraisesTab;
