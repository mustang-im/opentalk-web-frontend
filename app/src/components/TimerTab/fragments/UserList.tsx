// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import styled from '@emotion/styled';
import { List as MuiList, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from '@mui/material';
import { DoneIcon, CloseIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectParticipantsReadyList } from '../../../store/selectors';
import ParticipantAvatar from '../../ParticipantAvatar';

const List = styled(MuiList)({
  overflow: 'auto',
});

const UserList = () => {
  const participants = useAppSelector(selectParticipantsReadyList);
  const { t } = useTranslation();

  const renderUsers = () => {
    return participants.map((participant) => {
      if (participant.leftAt === null) {
        return (
          <ListItem key={participant.id} sx={{ px: 0 }}>
            <ListItemAvatar>
              <ParticipantAvatar src={participant.avatarUrl}>{participant.displayName}</ParticipantAvatar>
            </ListItemAvatar>
            <ListItemText primary={<Typography noWrap>{participant.displayName}</Typography>} />
            {participant.isReady ? (
              <DoneIcon fontSize="small" color="primary" />
            ) : (
              <CloseIcon fontSize="small" color="warning" />
            )}
          </ListItem>
        );
      }
      return null;
    });
  };

  return (
    <Stack spacing={2} overflow="hidden">
      <Typography variant="h2">{t('global-participants')}</Typography>
      <List>{renderUsers()}</List>
    </Stack>
  );
};

export default UserList;
