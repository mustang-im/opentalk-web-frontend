// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { List as MuiList, styled, useMediaQuery, useTheme } from '@mui/material';
import { selectAuthIsPending, useAuthContext } from '@opentalk/redux-oidc';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FeedbackIcon, SettingsIcon, SignOutIcon } from '../../../assets/icons';
import { useAppSelector } from '../../../hooks';
import {
  selectAccountManagementUrl,
  selectDataProtectionUrl,
  selectImprintUrl,
  selectUserSurveyUrl,
} from '../../../store/slices/configSlice';
import FeedbackDialog from '../../FeedbackDialog/FeedbackDialog';
import CollapseRow from './CollapseRow';
import PrimaryNavigationEntry from './PrimaryNavigationEntry';
import PrimaryNavigationList, { FilterMode, PrimaryRoute } from './PrimaryNavigationList';
import ProfileChip from './ProfileChip';

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateRows: 'auto 1fr auto',
  alignItems: 'flex-start',
  height: '100%',
  background: theme.palette.background.paper,
  padding: theme.spacing(3, 0),
  transition: 'all 300ms ease-out',
}));

const ChipContainer = styled('div', {
  shouldForwardProp: (prop) => prop !== 'collapsed',
})<{ collapsed: boolean }>(({ collapsed, theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: theme.spacing(0, 5),
  marginBottom: theme.spacing(13.5),
  transition: 'all 300ms ease-out',
  background: 'transparent',
  maxWidth: '100%',
  overflow: 'hidden',

  '& .MuiCollapse-wrapperInner ': {
    width: '8em',
    paddingLeft: theme.spacing(1.5),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  '& .MuiTypography-root': {
    width: collapsed ? 'auto' : '100%',
  },
}));

const List = styled(MuiList)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1.5),
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
  },
}));

interface NavigationProps {
  submenu: string;
  routes: Array<PrimaryRoute>;
  setActiveNavbar: (value: boolean) => void;
}

const PrimaryNavigation = ({ submenu, routes, setActiveNavbar }: NavigationProps) => {
  const [collapsedBar, setcollapsedBar] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { t } = useTranslation();
  const userSurveyEnabled = useAppSelector(selectUserSurveyUrl);
  const accountManagementUrl = useAppSelector(selectAccountManagementUrl);
  const imprintUrl = useAppSelector(selectImprintUrl);
  const dataProtectionUrl = useAppSelector(selectDataProtectionUrl);
  const auth = useAuthContext();
  const isAuthPending = useAppSelector(selectAuthIsPending);

  const toggleFeedbackModal = () => setShowFeedbackModal((prevState) => !prevState);

  return (
    <Container data-testid="PrimaryNavigation">
      {isDesktop && (
        <ChipContainer collapsed={collapsedBar}>
          <ProfileChip collapsed={collapsedBar} withLabel />
        </ChipContainer>
      )}
      <List>
        <PrimaryNavigationList
          submenu={submenu}
          routes={routes}
          setActiveNavbar={setActiveNavbar}
          filter={{ value: 'legal', mode: FilterMode.Exclude }}
          collapsedBar={collapsedBar}
        />
        {accountManagementUrl && (
          <PrimaryNavigationEntry
            href={accountManagementUrl}
            Icon={<SettingsIcon />}
            collapsedBar={collapsedBar}
            label={t('dashboard-account-management')}
            disabled={isAuthPending}
          />
        )}

        {(imprintUrl || dataProtectionUrl) && (
          <PrimaryNavigationList
            submenu={submenu}
            routes={routes}
            setActiveNavbar={setActiveNavbar}
            filter={{ value: 'legal', mode: FilterMode.Include }}
            collapsedBar={collapsedBar}
          />
        )}
        {userSurveyEnabled && (
          <>
            <PrimaryNavigationEntry
              onClick={toggleFeedbackModal}
              Icon={<FeedbackIcon />}
              collapsedBar={collapsedBar}
              label={t('feedback-button')}
              isSubmenuOpen={false}
            />
            <FeedbackDialog open={showFeedbackModal} onClose={toggleFeedbackModal} />
          </>
        )}

        <PrimaryNavigationEntry
          href=""
          onClick={() => auth?.signOut()}
          Icon={<SignOutIcon />}
          collapsedBar={collapsedBar}
          label={t('dashboard-logout')}
          disabled={isAuthPending}
          isSubmenuOpen={false}
        />
      </List>
      <CollapseRow collapsed={collapsedBar} onChange={setcollapsedBar} />
    </Container>
  );
};

export default PrimaryNavigation;
