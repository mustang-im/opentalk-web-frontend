// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Paper, styled, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { setHotkeysEnabled } from '@opentalk/common';
import { LegalVoteProvider } from '@opentalk/components';
import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { legalVote } from '../../api/types/outgoing';
import { Tab, tabs } from '../../config/moderationTabs';
import { useAppSelector } from '../../hooks';
import { selectCombinedParticipantsAndUser } from '../../store/selectors';
import { FeaturesKeys, selectFeatures, selectLibravatarDefaultImage } from '../../store/slices/configSlice';
import { selectIsModerator } from '../../store/slices/userSlice';
import LocalVideo from '../LocalVideo/index';
import MenuTabs from '../MenuTabs/MenuTabs';
import ModerationSideToolbar from '../ModerationSideToolbar';
import Toolbar from '../Toolbar';
import SideTabPanel from './fragments/SideTabPanel';

const SideBar = styled(Paper)(({ theme }) => ({
  display: 'flex',
  background: theme.palette.background.paper,
  borderRadius: theme.borderRadius.medium,
  gridRow: 'span 2',
  flex: 1,
}));

const ProfileWindow = styled('div', {
  shouldForwardProp: (prop) => prop !== 'isModerator',
})<{ isModerator?: boolean }>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: theme.borderRadius.medium,
  padding: theme.spacing(2),
  '&-webkit-transform': 'translateZ(0)',
  boxShadow: '0 1.187rem 3.187rem 0 rgb(0 0 0 / 16%), 0 0.875rem 1.187rem 0 rgb(0 0 0 / 7%)',
  width: '21rem',
}));

const MeetingSidebar = () => {
  const theme = useTheme();
  const isSmartphone = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallDeviceInLandscape = useMediaQuery(`${theme.breakpoints.down('md')} and (orientation: landscape)`);
  const [value, setValue] = useState<number>(0);
  const isModerator = useAppSelector(selectIsModerator);
  const { t } = useTranslation();
  const features = useAppSelector(selectFeatures);
  const [filteredTabs, setFilteredTabs] = useState<Tab[]>([]);
  const combinedParticipantsAndUser = useAppSelector(selectCombinedParticipantsAndUser);
  const handleTabSelect = useCallback((tabIndex: number) => setValue(tabIndex), [setValue]);
  const libravatarDefaultImage = useAppSelector(selectLibravatarDefaultImage);

  useEffect(() => {
    setValue(0);
    setFilteredTabs(tabs.filter((tab) => tab.divider || (tab.featureKey && features[tab.featureKey])));
  }, [isModerator, features]);

  const renderTabs = () =>
    filteredTabs?.map((tab: Tab, index) =>
      !tab.divider ? (
        <Tooltip key={tab.key} placement="right" title={tab.tooltipTranslationKey ? t(tab.tooltipTranslationKey) : ''}>
          <SideTabPanel value={value} index={index}>
            {tab.key === FeaturesKeys.Vote ? (
              <LegalVoteProvider
                apiMessages={{
                  cancel: legalVote.actions.cancel,
                  stop: legalVote.actions.stop,
                  start: legalVote.actions.start,
                }}
                votingUsers={combinedParticipantsAndUser}
                setHotkeysEnabled={setHotkeysEnabled}
                libravatarDefaultImage={libravatarDefaultImage}
              >
                {tab.component}
              </LegalVoteProvider>
            ) : (
              tab.component
            )}
          </SideTabPanel>
        </Tooltip>
      ) : null
    );

  if (isSmartphone || isSmallDeviceInLandscape) {
    return null;
  }

  return isModerator ? (
    <SideBar>
      <ModerationSideToolbar selectedTabs={filteredTabs} onSelect={handleTabSelect} />
      <ProfileWindow isModerator={isModerator}>
        <LocalVideo />
        <Toolbar />
        {renderTabs()}
      </ProfileWindow>
    </SideBar>
  ) : (
    <SideBar>
      <ProfileWindow>
        <LocalVideo />
        <Toolbar />
        <SideTabPanel value={value} index={0}>
          <MenuTabs />
        </SideTabPanel>
      </ProfileWindow>
    </SideBar>
  );
};

export default MeetingSidebar;
