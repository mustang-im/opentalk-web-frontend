// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AppBar as MuiAppBar, Tab as MuiTab, Tabs as MuiTabs, styled, Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { selectParticipantsTotal } from '../../store/slices/participantsSlice';
import { selectChatConversationState } from '../../store/slices/uiSlice';
import Chat from '../Chat';
import ChatOverview from '../ChatOverview';
import Participants from '../Participants';
import TabPanel from './fragments/TabPanel';

const Container = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  maxWidth: '100%',
});

const AppBar = styled(MuiAppBar)({
  borderRadius: '0.5rem',
});

const Tab = styled(MuiTab)(({ theme }) => ({
  minWidth: '33%',
  minHeight: 0,
  fontSize: '0.75rem',
  borderRadius: theme.borderRadius.large,
  color: theme.palette.text.primary,
  textTransform: 'initial',
  fontWeight: 400,
  padding: theme.spacing(1),
  whiteSpace: 'nowrap',
  '&.Mui-selected': {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.text.secondary,
  },
  '& .MuiTab-iconWrapper': {
    marginLeft: theme.spacing(0.2),
  },
}));

const Tabs = styled(MuiTabs)(({ theme }) => ({
  minHeight: 0,
  borderRadius: theme.borderRadius.large,
  background: '#20434F', //todo theme.palette.text.secondary would be the wrong context here
  '& .MuiTabs-flexContainer': {
    alignItems: 'center',
    justifyContent: 'center',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
  },
}));

const MenuTabs = () => {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();
  const chatConversationState = useAppSelector(selectChatConversationState);
  const totalParticipants = useAppSelector(selectParticipantsTotal);

  useEffect(() => {
    if (chatConversationState.scope !== undefined && chatConversationState.targetId !== undefined) {
      setValue(2);
    }
  }, [chatConversationState]);

  const handleChange = (event: React.SyntheticEvent<Element, Event>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container>
      <Box>
        <AppBar position={'static'} color={'secondary'} elevation={0}>
          <Tabs value={value} onChange={handleChange} variant={'fullWidth'}>
            <Tab label={t('menutabs-chat')} />
            <Tab
              label={t('menutabs-people')}
              icon={<Typography variant="caption">({totalParticipants})</Typography>}
              iconPosition="end"
            />
            <Tab label={t('menutabs-messages')} />
          </Tabs>
        </AppBar>
      </Box>
      <TabPanel value={value} index={0}>
        <Chat />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Participants />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ChatOverview />
      </TabPanel>
    </Container>
  );
};

export default MenuTabs;
