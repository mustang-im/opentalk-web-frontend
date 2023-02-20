// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Paper, styled, Tooltip, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { setHotkeysEnabled } from '@opentalk/common';
import { LegalVoteProvider } from '@opentalk/components';
import { useTranslation } from 'react-i18next';

import { legalVote } from '../../api/types/outgoing';
import { Tab } from '../../config/moderationTabs';
import { useAppSelector, useTabs } from '../../hooks';
import { selectVotingUsers } from '../../store/selectors';
import { FeaturesKeys, selectLibravatarDefaultImage } from '../../store/slices/configSlice';
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
  const { t } = useTranslation();
  const theme = useTheme();
  const isSmartphone = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallDeviceInLandscape = useMediaQuery(`${theme.breakpoints.down('md')} and (orientation: landscape)`);
  const votingUsers = useAppSelector(selectVotingUsers);
  const libravatarDefaultImage = useAppSelector(selectLibravatarDefaultImage);
  const isModerator = useAppSelector(selectIsModerator);
  const { tabs, value, handleTabSelect } = useTabs();

  if (isSmartphone || isSmallDeviceInLandscape) {
    return null;
  }

  const renderTabs = () => {
    return tabs?.map((tab: Tab, index) => {
      if (!tab.divider) {
        return (
          <Tooltip
            key={tab.key}
            placement="right"
            title={tab.tooltipTranslationKey ? t(tab.tooltipTranslationKey) : ''}
          >
            <SideTabPanel value={value} index={index}>
              {tab.key === FeaturesKeys.Vote ? (
                <LegalVoteProvider
                  apiMessages={{
                    cancel: legalVote.actions.cancel,
                    stop: legalVote.actions.stop,
                    start: legalVote.actions.start,
                  }}
                  votingUsers={votingUsers}
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
        );
      }
    });
  };

  return isModerator ? (
    <SideBar>
      <ModerationSideToolbar selectedTabs={tabs} onSelect={handleTabSelect} />
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
