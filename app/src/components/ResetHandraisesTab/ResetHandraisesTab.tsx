// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid } from '@mui/material';
import { Participant } from '@opentalk/common';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { resetRaisedHands } from '../../api/types/outgoing/moderation';
import { useAppDispatch } from '../../hooks';

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
    <Grid container>
      <Grid item xs={12} display="flex">
        <Button onClick={resetAllHandraises}>{t('reset-handraises-button')}</Button>
      </Grid>
    </Grid>
  );
};

export default ResetHandraisesTab;
