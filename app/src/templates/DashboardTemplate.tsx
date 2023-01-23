// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Container as MuiContainer,
  Grid,
  Paper,
  Skeleton,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { HomeIcon, SettingsIcon, MeetingsIcon } from '@opentalk/common';
import React, { useState } from 'react';
import { Outlet, useOutletContext } from 'react-router-dom';

import { useGetMeQuery } from '../api/rest';
import { ReactComponent as Logo } from '../assets/images/logoGradient.svg';
import DashboardNavigation, { PrimaryRoute } from '../components/DashboardNavigation';

const DashboardLogo = styled(Logo)({
  gridArea: 'Logo',
  height: '1.685em',
  width: '100%',
});

const Main = styled('main')(({ theme }) => ({
  maxWidth: 1500,
  height: '100%',
  flex: 1,
  padding: theme.spacing(3, 5),

  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(3, 2),
  },
}));

const Container = styled(MuiContainer)(({ theme }) => ({
  background: theme.palette.common.white,

  '&::before': {
    position: 'absolute',
    inset: 0,
    content: "''",
    background: theme.palette.background?.defaultGradient || theme.palette.background?.default,
    backgroundColor: theme.palette.background?.defaultGradient || theme.palette.background?.default,
    pointerEvents: 'none',
  },
}));

const LoadingNavbarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  width: 256,
}));

type DashboardTemplateContext = {
  header: React.ReactNode;
  setHeader: (header: React.ReactNode) => void;
};

export const useHeader = () => {
  return useOutletContext<DashboardTemplateContext>();
};

const routes: Array<PrimaryRoute> = [
  {
    icon: <HomeIcon />,
    path: '/dashboard/',
    name: 'dashboard-home',
  },
  {
    icon: <MeetingsIcon />,
    path: 'meetings',
    name: 'dashboard-meetings',
  },
  {
    icon: <SettingsIcon />,
    path: 'settings',
    name: 'dashboard-settings',
    childRoutes: [
      {
        path: 'general',
        name: 'dashboard-settings-general',
      },
      {
        path: 'profile',
        name: 'dashboard-settings-profile',
      },
      {
        path: 'account',
        name: 'dashboard-settings-account',
      },
    ],
  },
];

const DashboardTemplate = () => {
  const [header, setHeader] = useState<React.ReactNode>();
  const { isLoading } = useGetMeQuery();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  if (isLoading) {
    return (
      <Container maxWidth={false} disableGutters>
        <Stack direction={{ xs: 'column', md: 'row' }} height={'100%'}>
          {isDesktop && (
            <LoadingNavbarContainer elevation={0}>
              <Stack spacing={12}>
                <Grid container spacing={1} alignItems={'center'}>
                  <Grid item>
                    <Skeleton variant="circular" width={40} height={40} />
                  </Grid>
                  <Grid item xs>
                    <Skeleton variant="text" />
                  </Grid>
                </Grid>
                <Stack spacing={1}>
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                  <Skeleton variant="text" width={208} height={56} />
                </Stack>
              </Stack>
            </LoadingNavbarContainer>
          )}
          <Main>
            <Grid container spacing={4}>
              <Grid item>
                <DashboardLogo />
              </Grid>
            </Grid>
            <div>
              <Stack spacing={2}>
                <Skeleton variant="text" />
                <Skeleton />
                <Skeleton variant="rectangular" width={'100%'} height={400} />
              </Stack>
            </div>
          </Main>
        </Stack>
      </Container>
    );
  }
  return (
    <Container maxWidth={false} disableGutters>
      <Stack direction={{ xs: 'column', md: 'row' }} height={'100%'}>
        <DashboardNavigation routes={routes} />
        <Stack component={Main} spacing={{ xs: 2, md: 5 }} maxHeight={'100%'} height={{ xs: 0, sm: '100%' }}>
          <Grid spacing={2} container direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
            <Grid item alignSelf={'flex-end'}>
              <DashboardLogo />
            </Grid>
            <Grid item xs>
              {header}
            </Grid>
          </Grid>
          <Outlet context={{ setHeader }} />
        </Stack>
      </Stack>
    </Container>
  );
};

export default DashboardTemplate;
