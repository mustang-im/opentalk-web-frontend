// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  Collapse,
  List as MuiList,
  ListItem as MuiListItem,
  ListItemText,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FeedbackIcon, HelpIcon, SettingsIcon, SignOutIcon } from '@opentalk/common';
import { useAuth } from '@opentalk/react-redux-appauth';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppSelector } from '../../../hooks';
import { selectAccountManagementUrl, selectHelpdeskUrl, selectUserSurveyUrl } from '../../../store/slices/configSlice';
import FeedbackDialog from '../../FeedbackDialog/FeedbackDialog';
import { PrimaryRoute } from '../DashboardNavigation';
import CollapseRow from './CollapseRow';
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

const ListItem = styled(MuiListItem, {
  shouldForwardProp: (prop) => prop !== 'isSubmenuOpen',
})<{ isSubmenuOpen?: boolean }>(({ theme, isSubmenuOpen }) => ({
  padding: 0,
  paddingRight: theme.spacing(3),
  borderRadius: `${theme.borderRadius.large}px 0 0 ${theme.borderRadius.large}px`,
  background: isSubmenuOpen ? theme.palette.secondary.lightest : 'transparent',

  [theme.breakpoints.down('md')]: {
    borderRadius: 0,
    paddingRight: 0,
    marginLeft: 0,
  },

  '> *, & .MuiButton-root': {
    color: theme.palette.text.primary,
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(1.5, 3),
    borderRadius: theme.borderRadius.large,
    textDecoration: 'none',
    width: '100%',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    justifyContent: 'flex-start',

    '& svg': {
      fill: 'currentcolor',
    },

    '& .MuiListItemText-root': {
      paddingLeft: theme.spacing(2),
      fontSize: '1rem',
      '& .MuiListItemText-primary': {
        fontWeight: 'bold',
      },
    },

    '&:hover': {
      background: theme.palette.secondary.lightest,
    },

    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(1.5, 3),
      borderRadius: 0,

      '*': {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    },
  },
  '& .active-link': {
    background: theme.palette.secondary.lightest,
  },
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
  const navigate = useNavigate();
  const helpdeskUrl = useAppSelector(selectHelpdeskUrl);
  const userSurveyEnabled = useAppSelector(selectUserSurveyUrl);
  const accountManagementUrl = useAppSelector(selectAccountManagementUrl);
  const auth = useAuth();

  const logout = useCallback(async () => {
    if (!auth.isLoading) {
      await auth.signOut();
    }
  }, [auth]);

  const handleNavigation = (event: React.MouseEvent, hasSubmenu: boolean, path: string) => {
    if (hasSubmenu) {
      event.preventDefault();
      navigate(`/dashboard/${path}`);
      return;
    }
    // if menu doesn't contain child close it on mobile
    if (!isDesktop) {
      setActiveNavbar(false);
    }
  };

  const toggleFeedbackModal = () => setShowFeedbackModal((prevState) => !prevState);

  const renderNavItems = () =>
    routes.map(({ path, name, icon, childRoutes }) => {
      const hasSubmenu = childRoutes ? childRoutes.length > 0 : false;
      return (
        <ListItem key={path} isSubmenuOpen={path.includes(submenu) && hasSubmenu}>
          <NavLink
            onClick={(event) => handleNavigation(event, hasSubmenu, path)}
            to={path}
            data-testid={`PrimaryNavItem`}
            className={path.includes(submenu) ? 'active-link' : ''}
          >
            {icon}
            <Collapse orientation="horizontal" in={!collapsedBar}>
              <ListItemText>{t(name)}</ListItemText>
            </Collapse>
          </NavLink>
        </ListItem>
      );
    });

  return (
    <Container data-testid={'PrimaryNavigation'}>
      {isDesktop && (
        <ChipContainer collapsed={collapsedBar}>
          <ProfileChip collapsed={collapsedBar} withLabel />
        </ChipContainer>
      )}
      <List>
        {renderNavItems()}
        {accountManagementUrl && (
          <ListItem>
            <Button href={accountManagementUrl} role="button" disableRipple disabled={auth.isLoading}>
              <SettingsIcon />
              <Collapse orientation="horizontal" in={!collapsedBar}>
                <ListItemText>{t('dashboard-account-management')}</ListItemText>
              </Collapse>
            </Button>
          </ListItem>
        )}
        {helpdeskUrl && (
          <ListItem isSubmenuOpen={false} role="button">
            <Button href={helpdeskUrl} disableRipple target="_blank">
              <HelpIcon />
              <Collapse orientation="horizontal" in={!collapsedBar}>
                <ListItemText>{t('help-button')}</ListItemText>
              </Collapse>
            </Button>
          </ListItem>
        )}
        {userSurveyEnabled && (
          <>
            <ListItem isSubmenuOpen={false}>
              <Button onClick={toggleFeedbackModal} disableRipple>
                <FeedbackIcon />
                <Collapse orientation="horizontal" in={!collapsedBar}>
                  <ListItemText>{t('feedback-button')}</ListItemText>
                </Collapse>
              </Button>
            </ListItem>
            <FeedbackDialog open={showFeedbackModal} onClose={toggleFeedbackModal} />
          </>
        )}
        <ListItem>
          <Button onClick={logout} role="button" disableRipple disabled={auth.isLoading}>
            <SignOutIcon />
            <Collapse orientation="horizontal" in={!collapsedBar}>
              <ListItemText>{t('dashboard-settings-logout')}</ListItemText>
            </Collapse>
          </Button>
        </ListItem>
      </List>

      <CollapseRow collapsed={collapsedBar} onChange={setcollapsedBar} />
    </Container>
  );
};

export default PrimaryNavigation;
