// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Skeleton, Stack, styled, Typography, useMediaQuery, useTheme } from '@mui/material';
import { AddIcon, CameraOnIcon } from '@opentalk/common';
import { RoomId } from '@opentalk/rest-api-rtk-query';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { useGetEventsQuery } from '../../../api/rest';
import FavoriteMeetingsCard, { FavoriteMeetingProps } from '../../../components/FavoriteMeetingsCard';
import MeetingCard from '../../../components/MeetingCard';
import StartMeetingImage from '../../../components/StartMeetingImage';
import getReferrerRouterState from '../../../utils/getReferrerRouterState';

const Container = styled('div')(({ theme }) => ({
  display: 'grid',
  rowGap: theme.spacing(3),
  overflow: 'auto',

  [theme.breakpoints.up('md')]: {
    columnGap: theme.spacing(5),
    gridTemplateColumns: '256px 1fr',
  },
}));

const HeaderContainer = styled(Stack)(({ theme }) => ({
  flexDirection: 'column-reverse',
  justifyContent: 'space-between',
  alignItems: 'flex-end',
  gap: theme.spacing(2),

  [theme.breakpoints.up('md')]: {
    flexDirection: 'row',
    gridColumnStart: 2,
  },
}));

const Home = () => {
  const [animated, setAnimated] = useState<boolean>(false);
  const { t } = useTranslation();
  const { data: favoritesEvents, isLoading: favoritesEventsIsLoading } = useGetEventsQuery({
    favorites: true,
  });
  const { data: upcomingEvents, isLoading: upcomingEventsIsLoading } = useGetEventsQuery({
    perPage: 4,
    adhoc: false,
  });
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const renderStartDirectMeetingButton = () => (
    <Button
      component={Link}
      to={'/dashboard/meetings/meet-now'}
      onMouseEnter={toggleAnimation}
      onMouseLeave={toggleAnimation}
      startIcon={<CameraOnIcon />}
      size={'large'}
      state={{
        ...getReferrerRouterState(window.location),
      }}
    >
      {t('dashboard-meeting-card-button-start-direct')}
    </Button>
  );

  const renderNewMeetingButton = () => (
    <Button
      component={Link}
      to={'/dashboard/meetings/create'}
      startIcon={<AddIcon />}
      color={'secondary'}
      size={'large'}
      state={{
        ...getReferrerRouterState(window.location),
      }}
    >
      {t('dashboard-plan-new-meeting')}
    </Button>
  );

  const renderFavoriteEventsLoading = () => (
    <Stack width={'100%'}>
      <Skeleton variant="text" />
      <Skeleton variant="rectangular" height={200} />
    </Stack>
  );

  const getMappedFavoriteMeetings = (): Array<FavoriteMeetingProps> =>
    favoritesEvents?.data
      ?.filter((favoritesEvent) => !isEmpty(favoritesEvent.title))
      .map((favoritesEvent) => ({
        subject: favoritesEvent.title ? favoritesEvent.title : '',
        roomId: favoritesEvent.room?.id ? (favoritesEvent.room.id as RoomId) : ('' as RoomId),
      })) || [];

  const renderFavoriteEvents = () => {
    if (favoritesEventsIsLoading) {
      return renderFavoriteEventsLoading();
    }
    return (
      <Stack spacing={2} flex={1} justifyContent={'flex-end'}>
        <Typography>{t('dashboard-meeting-card-title-favorite-meetings')}</Typography>
        <FavoriteMeetingsCard meetings={getMappedFavoriteMeetings()} />
      </Stack>
    );
  };

  const renderUpcomingEventsLoading = () => (
    <Stack spacing={2}>
      <Skeleton variant="rectangular" height={130} />
      <Skeleton variant="rectangular" height={130} />
      <Skeleton variant="rectangular" height={130} />
      <Skeleton variant="rectangular" height={130} />
    </Stack>
  );

  const renderUpcomingEvents = () => {
    if (upcomingEventsIsLoading) {
      return renderUpcomingEventsLoading();
    }

    if (upcomingEvents?.data === undefined) {
      return undefined;
    }

    return (
      <Stack spacing={2} height={'100%'} overflow={'auto'}>
        {upcomingEvents.data.map((upcomingEvent) => (
          <MeetingCard key={upcomingEvent.id} event={upcomingEvent} />
        ))}
      </Stack>
    );
  };

  const renderLogoAndFavoriteBar = () => (
    <Stack flexDirection={'column'} flex={1} spacing={12.5} justifyContent="space-between">
      <Stack justifyContent={'center'} alignItems={'center'} spacing={1}>
        <StartMeetingImage animated={animated} width={146} height={140} />
        {renderStartDirectMeetingButton()}
      </Stack>
      {renderFavoriteEvents()}
    </Stack>
  );

  const toggleAnimation = () => {
    setAnimated(!animated);
  };

  return (
    <Container>
      <HeaderContainer>
        <Typography>{t('dashboard-meeting-card-title-next-meetings')}</Typography>
        {renderNewMeetingButton()}
        {!isDesktop && renderStartDirectMeetingButton()}
      </HeaderContainer>
      {isDesktop && renderLogoAndFavoriteBar()}
      {renderUpcomingEvents()}
    </Container>
  );
};

export default Home;
