// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Pagination } from '@mui/material';
import { WhiteboardIcon, ProtocolIcon } from '@opentalk/common';
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../../assets/images/logo.svg';
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
  toggleDebugMode,
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

const OpenTalkLogo = styled(Logo)(({ theme }) => ({
  width: theme.typography.pxToRem(205),
  height: theme.typography.pxToRem(35),
  fill: 'white',
}));

const HeaderDivider = styled('div')(({ theme }) => ({
  display: 'flex',
  alignSelf: 'center',
  height: '50%',
  borderStyle: 'solid',
  borderLeftWidth: theme.typography.pxToRem(2),
  borderColor: theme.palette.background.voteResult,
}));

const HeaderPaginationContainer = styled('div')(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  display: 'inline-flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
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

const HeaderCenterContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
}));

const Content = styled('header')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
}));

const ContentItem = styled('div')<{ lgOrder?: number }>(({ theme, lgOrder }) => ({
  [theme.breakpoints.down('lg')]: {
    order: lgOrder,
    flex: lgOrder ? '0 0 100%' : 1,
  },
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
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const votingsAndPollsCount = useAppSelector(selectPollsAndVotingsCount);
  const showVotesAndPolls = votingsAndPollsCount > 0;
  const isSharedFolderAvailable = useAppSelector(selectIsSharedFolderAvailable);
  const { t } = useTranslation();
  const isProtocolActive = selectedLayout === LayoutOptions.Protocol;
  const isWhiteboardActive = selectedLayout === LayoutOptions.Whiteboard;

  const showDebugDialog = () => {
    if (clickTimer.current) {
      clearTimeout(clickTimer.current);
    }

    clickTimer.current = setTimeout(() => {
      setClickCount(0);
    }, 2000);

    setClickCount((clickCount) => clickCount + 1);
  };

  useEffect(() => {
    if (clickCount === 5) {
      dispatch(toggleDebugMode());
      setClickCount(0);
    }
  }, [dispatch, clickCount]);

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
      <ContentItem>
        <OpenTalkLogo onClick={showDebugDialog} aria-disabled />
      </ContentItem>
      <ContentItem lgOrder={2}>
        <HeaderCenterContainer>
          <RoomTitle />
          <LayoutSelection />
          {selectedLayout === LayoutOptions.Grid && pageCount > 1 && (
            <HeaderPaginationContainer>
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
            </HeaderPaginationContainer>
          )}
          {(showWhiteboardIcon || protocolUrl || showVotesAndPolls || isSharedFolderAvailable) && (
            <>
              <HeaderDivider />
              {showWhiteboardIcon && renderWhiteboardButton()}
              {protocolUrl && selectedLayout !== LayoutOptions.Protocol && renderProtocolButton()}
              {isSharedFolderAvailable && <SharedFolderPopover />}
              {showVotesAndPolls && <VotesAndPollsResultsPopover />}
            </>
          )}
        </HeaderCenterContainer>
      </ContentItem>
      <ContentItem>
        <HeaderCenterContainer>
          <MeetingUtilsSection />
          <MyMeetingMenu />
        </HeaderCenterContainer>
      </ContentItem>
    </Content>
  );
};

export default DesktopMeetingHeader;
