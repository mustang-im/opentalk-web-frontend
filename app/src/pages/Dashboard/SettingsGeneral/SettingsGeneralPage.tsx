// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';

import { VisuallyHiddenTitle } from '../../../commonComponents';
import LanguageSelector from './fragments/LanguageSelector';

const SettingsGeneralPage = () => {
  const { t } = useTranslation();

  return (
    <>
      <VisuallyHiddenTitle label={t('dashboard-settings-general-title')} component="h1" />
      <Grid container direction="column" data-testid="dashboardSettingsGeneral" spacing={5}>
        <Grid item>
          <LanguageSelector />
        </Grid>
        {/* TODO add action ThemeSelector, currently has only presentation function
        <Grid item>
          <Divider />
        </Grid>
        <Grid item>
          <ThemeSelector />
        </Grid> */}
      </Grid>
    </>
  );
};

export default SettingsGeneralPage;
