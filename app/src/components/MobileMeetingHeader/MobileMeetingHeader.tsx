// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, styled } from '@mui/material';
import { LogoSmallIcon } from '@opentalk/common';

import LayoutSelection from '../MeetingHeader/fragments/LayoutSelection';
import MeetingTimer from '../MeetingHeader/fragments/MeetingTimer';
import RoomTitle from '../MeetingHeader/fragments/RoomTitle';
import MobilePagination from './fragments/MobilePagination';

const HeaderContainer = styled(Stack)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '1fr minmax(0, 3fr) 1fr minmax(0, 1fr) 2fr',
  columnGap: '0.25rem',
  margin: theme.spacing(1, 0),
  marginInline: '0.5rem',
}));

const Logo = styled(LogoSmallIcon)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  width: '100%',
  height: 'auto',
  padding: '0.5rem',
}));

//TODO: Remove last HeaderItem and keep styling internal in components for more precise control. Make background style reusable?
const HeaderItem = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiIconButton-root .MuiSvgIcon-root': {},
}));

const MobileMeetingHeader = () => {
  return (
    <HeaderContainer>
      <Logo />
      <RoomTitle />
      <LayoutSelection />
      <MobilePagination />
      <HeaderItem>
        <MeetingTimer />
      </HeaderItem>
    </HeaderContainer>
  );
};

export default MobileMeetingHeader;
