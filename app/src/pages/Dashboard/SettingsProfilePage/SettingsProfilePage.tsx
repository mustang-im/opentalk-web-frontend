// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Divider, Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { VisuallyHiddenTitle } from '../../../commonComponents';
import ProfilePicture from '../../../components/ProfilePicture';
import ProfileNameForm from './fragments/ProfileNameForm';

const SettingsProfilePage = () => {
  const { t } = useTranslation();

  return (
    <>
      <VisuallyHiddenTitle label={t('dashboard-settings-profile-title')} component="h1" />
      <Stack spacing={5}>
        <Stack spacing={3}>
          <Typography variant="h1" component="h2">
            {t('dashboard-settings-profile-picture')}
          </Typography>
          <ProfilePicture size="big" />
        </Stack>
        <Divider />
        <ProfileNameForm />
      </Stack>
    </>
  );
};

export default SettingsProfilePage;
