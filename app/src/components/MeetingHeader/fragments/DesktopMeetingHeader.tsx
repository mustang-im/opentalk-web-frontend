// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Pagination } from '@mui/material';
import { WhiteboardIcon, ProtocolIcon } from '@opentalk/common';
import React, { useMemo, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { selectPollsAndVotingsCount } from '../../../store/selectors';
import { selectAllOnlineParticipants } from '../../../store/slices/participantsSlice';
import { selectProtocolUrl } from '../../../store/slices/protocolSlice';
import { selectIsSharedFolderAvailable } from '../../../store/slices/sharedFolderSlice';
import {
  updatedCinemaLayout,
  selectCinemaLayout,
  setPaginationPage,
  selectPaginationPageState,
  selectIsCurrentProtocolHighlighted,
} from '../../../store/slices/uiSlice';
import { selectIsCurrentWhiteboardHighlighted } from '../../../store/slices/uiSlice';
import { selectIsWhiteboardAvailable } from '../../../store/slices/whiteboardSlice';
import { MAX_GRID_TILES } from '../../GridView/GridView';
import LayoutSelection from './LayoutSelection';
import { MeetingHeaderButton } from './MeetingHeaderButton';
import MeetingUtilsSection from './MeetingUtilsSection';
import MyMeetingMenu from './MyMeetingMenu';
import RoomTitle from './RoomTitle';
import { SharedFolderPopover } from './SharedFolderPopover';
import VotesAndPollsResultsPopover from './VotesAndPollsResultsPopover';

const HeaderItem = styled('div')<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  background: highlighted ? theme.palette.primary.main : theme.palette.background.video,
  borderRadius: '0.25rem',
  display: 'inline-flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiIconButton-root .MuiSvgIcon-root': {
    fill: highlighted ? theme.palette.background.default : theme.palette.text.primary,
  },
}));

const HeaderPagination = styled(Pagination)(({ theme }) => ({
  '& .MuiPaginationItem-root:hover': {
    color: theme.palette.primary.main,
    fontWeight: 'bold',
  },
  '& .Mui-selected': {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
}));

const HeaderContainer = styled('div')<{ lgOrder?: number; justifyContentLgDown?: string }>(
  ({ theme, lgOrder, justifyContentLgDown }) => ({
    display: 'flex',
    gap: theme.spacing(2),
    justifyContent: 'center',
    '@media (max-width: 1060px)': {
      order: lgOrder || 1,
      flex: lgOrder ? '0 0 100%' : 1,
      justifyContent: justifyContentLgDown ? justifyContentLgDown : 'center',
    },
  })
);

const Content = styled('header')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
}));

const DesktopMeetingHeader = () => {
  const dispatch = useAppDispatch();
  const selectedLayout = useAppSelector(selectCinemaLayout);
  const participants = useAppSelector(selectAllOnlineParticipants);
  const selectedPage = useAppSelector(selectPaginationPageState);
  const protocolUrl = useAppSelector(selectProtocolUrl);
  const isWhiteboardAvailable = useAppSelector(selectIsWhiteboardAvailable);
  const isCurrentWhiteboardHighlighted = useAppSelector(selectIsCurrentWhiteboardHighlighted);
  const isCurrentProtocolHighlighted = useAppSelector(selectIsCurrentProtocolHighlighted);
  const showWhiteboardIcon = isWhiteboardAvailable && selectedLayout !== LayoutOptions.Whiteboard;
  const votingsAndPollsCount = useAppSelector(selectPollsAndVotingsCount);
  const showVotesAndPolls = votingsAndPollsCount > 0;
  const isSharedFolderAvailable = useAppSelector(selectIsSharedFolderAvailable);
  const { t } = useTranslation();
  const isProtocolActive = selectedLayout === LayoutOptions.Protocol;
  const isWhiteboardActive = selectedLayout === LayoutOptions.Whiteboard;

  const pageCount = useMemo(() => {
    return Math.ceil(participants.length / MAX_GRID_TILES);
  }, [participants]);

  useEffect(() => {
    if (selectedPage > pageCount || selectedPage === 0) {
      dispatch(setPaginationPage(pageCount));
    }
  }, [selectedPage, pageCount, dispatch]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(setPaginationPage(page));
  };

  const handleSelectedView = (layout: LayoutOptions) => {
    dispatch(updatedCinemaLayout(layout));
  };

  const handleProtocolClick = useCallback(() => {
    if (selectedLayout !== LayoutOptions.Protocol) {
      handleSelectedView(LayoutOptions.Protocol);
    }
  }, [selectedLayout, handleSelectedView]);

  const renderProtocolButton = () => {
    return (
      <MeetingHeaderButton
        active={isCurrentProtocolHighlighted}
        onClick={handleProtocolClick}
        aria-label={t('protocol-button-show')}
        aria-pressed={isProtocolActive}
      >
        <ProtocolIcon />
      </MeetingHeaderButton>
    );
  };

  const handleWhiteboardClick = useCallback(() => {
    if (selectedLayout !== LayoutOptions.Whiteboard) {
      handleSelectedView(LayoutOptions.Whiteboard);
    }
  }, [selectedLayout, handleSelectedView]);

  const renderWhiteboardButton = () => (
    <MeetingHeaderButton
      active={isCurrentWhiteboardHighlighted}
      onClick={handleWhiteboardClick}
      aria-label={t('whiteboard-start-whiteboard-button')}
      aria-pressed={isWhiteboardActive}
    >
      <WhiteboardIcon />
    </MeetingHeaderButton>
  );

  return (
    <Content>
      <HeaderContainer justifyContentLgDown="flex-start">
        <RoomTitle />
        <LayoutSelection />
      </HeaderContainer>
      <HeaderContainer lgOrder={2}>
        {selectedLayout === LayoutOptions.Grid && pageCount > 1 && (
          <HeaderItem>
            <HeaderPagination
              count={pageCount > 1 ? pageCount : 0}
              page={selectedPage}
              variant="outlined"
              shape="rounded"
              siblingCount={1}
              size="small"
              hidePrevButton
              hideNextButton
              onChange={handleChangePage}
            />
          </HeaderItem>
        )}
        {(showWhiteboardIcon || protocolUrl || showVotesAndPolls || isSharedFolderAvailable) && (
          <>
            {showWhiteboardIcon && renderWhiteboardButton()}
            {protocolUrl && selectedLayout !== LayoutOptions.Protocol && renderProtocolButton()}
            {isSharedFolderAvailable && <SharedFolderPopover />}
            {showVotesAndPolls && <VotesAndPollsResultsPopover />}
          </>
        )}
      </HeaderContainer>
      <HeaderContainer justifyContentLgDown="flex-end">
        <MeetingUtilsSection />
        <MyMeetingMenu />
      </HeaderContainer>
    </Content>
  );
};

export default DesktopMeetingHeader;
