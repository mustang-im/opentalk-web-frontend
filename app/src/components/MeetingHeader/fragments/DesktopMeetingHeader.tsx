// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Pagination } from '@mui/material';
import React, { useMemo, useEffect, useCallback, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { WhiteboardIcon, ProtocolIcon } from '../../../assets/icons';
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
  toggleDebugMode,
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

const OpenTalkLogo = styled(Logo)(({ theme }) => ({
  width: theme.typography.pxToRem(150),
  height: theme.typography.pxToRem(35),
  fill: 'white',
}));

const HeaderItem = styled('div')<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  background: highlighted ? theme.palette.primary.main : theme.palette.background.video,
  borderRadius: '0.25rem',
  display: 'inline-flex',
  height: '40px',
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

const HeaderContainer = styled('div', {
  shouldForwardProp: (prop) => !['lgOrder', 'fullWidth', 'justifyContentLgDown', 'wrap'].includes(prop as string),
})<{
  justifyContentLgDown?: string;
  wrap?: boolean;
  flex?: number;
}>(({ theme, justifyContentLgDown, wrap, flex }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'center',
  flexWrap: wrap ? 'wrap' : 'nowrap',
  flex,
  [theme.breakpoints.down('lg')]: {
    justifyContent: justifyContentLgDown ? justifyContentLgDown : 'center',
  },
}));

const LogoContainer = styled(HeaderContainer)(({ theme }) => ({
  [theme.breakpoints.down('lg')]: {
    display: 'none',
  },
}));

const Content = styled('header')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  justifyContent: 'space-between',
  flexWrap: 'nowrap',
  alignItems: 'flex-start',
  [theme.breakpoints.down('lg')]: {
    flexWrap: 'wrap',
  },
}));

const RoomTitleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  [theme.breakpoints.down('lg')]: {
    justifyContent: 'flex-start',
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
  const votingsAndPollsCount = useAppSelector(selectPollsAndVotingsCount);
  const showVotesAndPolls = votingsAndPollsCount > 0;
  const isSharedFolderAvailable = useAppSelector(selectIsSharedFolderAvailable);
  const { t } = useTranslation();
  const isProtocolActive = selectedLayout === LayoutOptions.Protocol;
  const isWhiteboardActive = selectedLayout === LayoutOptions.Whiteboard;
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);

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

  const isAnyFeatureActive = Boolean(showWhiteboardIcon || protocolUrl || showVotesAndPolls || isSharedFolderAvailable);

  const isPaginationVisible = pageCount > 1;

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
      <LogoContainer>
        <OpenTalkLogo onClick={showDebugDialog} aria-disabled />
      </LogoContainer>
      <HeaderContainer justifyContentLgDown="flex-start" wrap flex={1}>
        <RoomTitleContainer>
          <RoomTitle />
          <LayoutSelection />
        </RoomTitleContainer>
        {selectedLayout === LayoutOptions.Grid && isPaginationVisible && (
          <HeaderItem>
            <HeaderPagination
              count={isPaginationVisible ? pageCount : 0}
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

        {isAnyFeatureActive && (
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
