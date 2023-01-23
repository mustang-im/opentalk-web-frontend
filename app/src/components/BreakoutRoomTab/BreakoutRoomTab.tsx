// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box } from '@mui/material';
import React from 'react';

import { useAppSelector } from '../../hooks';
import { selectIsActive } from '../../store/slices/breakoutSlice';
import CreateRoomsForm from './fragments/CreateRoomsForm';
import RoomOverview from './fragments/RoomOverview';

const BreakoutRoomTab = () => {
  const breakoutRoomIsActive = useAppSelector(selectIsActive);
  return (
    <Box flex={1} display={'flex'}>
      {breakoutRoomIsActive ? <RoomOverview /> : <CreateRoomsForm />}
    </Box>
  );
};

export default BreakoutRoomTab;
