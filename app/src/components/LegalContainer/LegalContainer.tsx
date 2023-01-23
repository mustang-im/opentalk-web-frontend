// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, List, ListItem, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import FontAwesome from '../../components/Licenses/FontAwesome';

const Container = styled('div')({
  display: 'flex',
  marginLeft: 'auto',
});

const CustomListItemText = styled(ListItemText)(({ theme }) => ({
  '& .MuiTypography-body1': {
    fontSize: '0.75rem',
    color: theme.palette.secondary.contrastText,
  },
}));

const LegalContainer = () => {
  const [faLicence, setFaLicence] = useState(false);
  const { t } = useTranslation();
  const toggleOpen = () => {
    setFaLicence(!faLicence);
  };

  const menuItems = [
    {
      key: 'font-awesome-license',
      toggle: toggleOpen,
    },
  ];

  return (
    <Container data-testid={'LegalContainer'}>
      <FontAwesome isOpen={faLicence} toggleOpen={toggleOpen} />
      <List>
        {menuItems.map((item) => (
          <ListItem button key={item.key} onClick={item.toggle}>
            <CustomListItemText primary={t('font-awesome-license')} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default LegalContainer;
