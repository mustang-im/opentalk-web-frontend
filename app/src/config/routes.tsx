// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Typography } from '@mui/material';
import { AuthCallback, selectAuthError, selectIsAuthed, selectIsLoading, useAuth } from '@opentalk/react-redux-appauth';
import i18next from 'i18next';
import React, { ReactNode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { To, RouteObject, useNavigate, Outlet, useParams } from 'react-router-dom';

import { useAppSelector } from '../hooks';
import {
  SettingsProfilePage,
  SettingsGeneralPage,
  SettingsAccountPage,
  CreateEventsPage,
  EditEventsPage,
  Home,
  CreateDirectMeeting,
  EventsOverviewPage,
  EventDetailsPage,
} from '../pages/Dashboard';
import RoomPage from '../pages/RoomPage';
import { selectIsGuest } from '../store/slices/userSlice';
import DashboardSettingsTemplate from '../templates/DashboardSettingsTemplate';
import DashboardTemplate from '../templates/DashboardTemplate';
import LobbyTemplate from '../templates/LobbyTemplate';

const InvitePage = React.lazy(() => import('../pages/InvitePage'));

type RouteValue = {
  path: string;
  children?: Routes;
};

export type Routes = {
  [key: string]: RouteValue;
};

const AuthRedirect = ({ label }: { label: string }) => {
  const navigate = useNavigate();
  const historyStub = { push: (target: string) => navigate(target) };
  return (
    <AuthCallback history={historyStub}>
      <p>{label}</p>
    </AuthCallback>
  );
};

const RouteNotFound = () => {
  const { t } = useTranslation();
  return (
    <Box display={'flex'} margin={'auto'}>
      <Typography variant="h5" component={'h1'} color={'white'}>
        {t('route-not-found')}
      </Typography>
    </Box>
  );
};

const Redirect = ({ to }: { to: To }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    roomId ? navigate(`${to}/${roomId}`) : navigate(to);
  }, [navigate, to, roomId]);
  return null;
};

const WAIT_FOR_REDIRECT_BEFORE_SIGNIN = 500; //ms

const ProtectedRoute = ({ children }: { children?: ReactNode }) => {
  const { signIn } = useAuth();
  const isAuthenticated = useAppSelector(selectIsAuthed);
  const isAuthLoading = useAppSelector(selectIsLoading);
  const isAuthError = useAppSelector(selectAuthError);
  const isGuest = useAppSelector(selectIsGuest);

  useEffect(() => {
    if (!isAuthenticated && !isAuthLoading && !isAuthError && !isGuest) {
      const timeout = setTimeout(async () => {
        const redirectUrl = sessionStorage.getItem('redirect-uri');
        if (!redirectUrl || redirectUrl === '/auth/popup_callback') {
          sessionStorage.setItem('redirect-uri', window.location.pathname);
        }
        await signIn();
      }, WAIT_FOR_REDIRECT_BEFORE_SIGNIN);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, isAuthLoading, isAuthError, isGuest]);

  if (isAuthenticated || isGuest) {
    if (children !== undefined) {
      return <>{children}</>;
    }
    return <Outlet />;
  }
  return null;
};

type CreateRoutes = (redirectUri: string, popUpRedirect: string) => RouteObject[];

const routes: CreateRoutes = (redirectUri: string, popUpRedirect: string) => [
  {
    path: '/',
    key: 'home',
    element: <LobbyTemplate />,
    children: [
      { index: true, element: <Redirect to={'/dashboard'} /> },
      {
        path: '/lobby/:roomId',
        key: 'lobby',
        element: <Redirect to={'/room'} />,
      },
      {
        path: '/waiting/:roomId',
        key: 'waiting',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <Redirect to={'/room'} /> },
          { path: ':breakoutRoomId', element: <Redirect to={'/room'} />, key: 'breakoutRoom' },
        ],
      },
      {
        path: '/room/:roomId',
        key: 'room',
        element: <ProtectedRoute />,
        children: [
          { index: true, element: <RoomPage /> },
          { path: ':breakoutRoomId', element: <RoomPage />, key: 'breakoutRoom' },
        ],
      },
    ],
  },

  {
    path: '/invite/:inviteCode',
    element: <LobbyTemplate />,
    children: [{ index: true, element: <InvitePage /> }],
    key: 'invite',
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardTemplate />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'settings',
        element: <DashboardSettingsTemplate />,
        children: [
          { path: 'general', element: <SettingsGeneralPage /> },
          { path: 'account', element: <SettingsAccountPage /> },
          { path: 'profile', element: <SettingsProfilePage /> },
        ],
      },
      {
        path: 'legal',
        element: <></>,
        children: [
          { path: 'imprint', element: <></> },
          { path: 'data-protection', element: <></> },
        ],
      },
      {
        path: 'meetings',
        children: [
          { element: <EventsOverviewPage />, index: true },
          { path: 'meet-now', element: <CreateDirectMeeting /> },
          { path: 'create', element: <CreateEventsPage /> },
          { path: 'update/:meetingId/:formStep', element: <EditEventsPage /> },
          { path: ':eventId', element: <EventDetailsPage /> },
        ],
      },
    ],
  },
  {
    path: redirectUri,
    key: 'redirectUri',
    element: <AuthRedirect label={i18next.t('auth-redirect-message')} />,
  },
  {
    path: popUpRedirect,
    key: 'popUpRedirect',
    element: <AuthRedirect label={i18next.t('auth-popup-closes-message')} />,
  },
  {
    path: '*',
    element: <RouteNotFound />,
  },
];

export default routes;
