// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Divider, Stack, styled, Typography } from '@mui/material';
import { ParticipantAvatar } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useGetMeQuery } from '../../../api/rest';
import ProfileNameForm from './fragments/ProfileNameForm';

const Avatar = styled(ParticipantAvatar)({
  width: 144,
  height: 144,
});

const SettingsProfilePage = () => {
  const { data } = useGetMeQuery();
  const { t } = useTranslation();
  return (
    <Stack spacing={5}>
      <Stack spacing={3}>
        <Typography variant={'h1'} component={'h2'}>
          {t('dashboard-settings-profile-picture')}
        </Typography>
        <Avatar alt={data?.displayName} src={data?.avatarUrl}>
          {data?.displayName}
        </Avatar>
      </Stack>
      <Divider />
      <ProfileNameForm />
    </Stack>
  );
};

export default SettingsProfilePage;
