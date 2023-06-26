// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Popover,
  styled,
  Pagination,
  Typography,
  Stack,
  Button,
  Menu,
  MenuList,
  MenuItem,
  Badge,
  Chip as MuiChip,
  List,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  DurationIcon as DefaultDurationIcon,
  SpeakerViewIcon,
  GridViewIcon,
  FullscreenViewIcon,
  SpeakerQueueIcon,
  PollIcon as DefaultPollIcon,
  LegalBallotIcon,
  WhiteboardIcon,
  RecordingsIcon,
  ProtocolIcon,
  SharedFolderIcon,
} from '@opentalk/common';
import { legalVoteStore, LegalVoteType } from '@opentalk/components';
import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { ReactComponent as Logo } from '../../assets/images/logo.svg';
import IconButton from '../../commonComponents/IconButton';
import LayoutOptions from '../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useFullscreenContext } from '../../provider/FullscreenProvider';
import { selectCurrentBreakoutRoom } from '../../store/slices/breakoutSlice';
import {
  selectAllOnlineParticipants,
  selectAllParticipantsInWaitingRoom,
  selectNotApprovedParticipants,
  selectParticipantsWaitingCount,
} from '../../store/slices/participantsSlice';
import { Poll, selectAllPollVotes } from '../../store/slices/pollSlice';
import { selectProtocolUrl } from '../../store/slices/protocolSlice';
import { selectRecordingState } from '../../store/slices/recordingSlice';
import { selectEventInfo } from '../../store/slices/roomSlice';
import {
  selectSharedFolderPassword,
  selectSharedFolderUrl,
  selectIsSharedFolderAvailable,
  selectIsSharedFolderOpened,
  sharedFolderOpened,
} from '../../store/slices/sharedFolderSlice';
import { toggledFullScreenMode } from '../../store/slices/uiSlice';
import {
  updatedCinemaLayout,
  selectCinemaLayout,
  paginationPageSet,
  selectPaginationPageState,
  setVotePollIdToShow,
  toggleDebugMode,
  selectIsCurrentProtocolHighlighted,
} from '../../store/slices/uiSlice';
import { selectIsCurrentWhiteboardHighlighted } from '../../store/slices/uiSlice';
import { selectIsModerator } from '../../store/slices/userSlice';
import { selectIsWhiteboardAvailable } from '../../store/slices/whiteboardSlice';
import { MAX_GRID_TILES } from '../GridView/GridView';
import { Vote } from '../VoteResult/VoteResultContainer';
import MeetingTimer from './fragments/MeetingTimer';
import RoomTitle from './fragments/RoomTitle';
import SecureConnectionField from './fragments/SecureConnectionField';
import WaitingParticipantItem from './fragments/WaitingParticipantsItem';

const blink = keyframes`from { opacity: 1; } to { opacity: 0.3; }`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    color: theme.palette.secondary.contrastText,
    background: theme.palette.primary.main,
    animation: `${blink} 1s ease alternate`,
    animationIterationCount: 'infinite',
  },
}));

const WaitingParticipantList = styled(List)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: 200,
  overflowX: 'hidden',
  overflowY: 'scroll',
  alignItems: 'space-between',
  padding: theme.spacing(1, 1),
  borderRadius: '0.1rem',
  background: theme.palette.background.video,
}));

const PopperContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'space-between',
  padding: theme.spacing(0.5, 1),
  borderRadius: '0.1rem',
  background: theme.palette.background.video,
}));

const ViewPopperContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

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

const HeaderDivider = styled('div')(({ theme }) => ({
  display: 'flex',
  alignSelf: 'center',
  height: '50%',
  borderStyle: 'solid',
  borderLeftWidth: theme.typography.pxToRem(2),
  borderColor: theme.palette.background.voteResult,
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
  height: '100%',
}));

const RightHeaderItem = styled(HeaderItem)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: theme.spacing(0.5, 0),
  '& > :nth-of-type(1)': {
    marginLeft: theme.spacing(1),
  },
  '& > :last-child': {
    marginRight: theme.spacing(1),
  },
}));

const Content = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const ContentItem = styled('div')<{ lgOrder?: number }>(({ theme, lgOrder }) => ({
  flex: 1,
  [theme.breakpoints.down('lg')]: {
    order: lgOrder,
    flex: lgOrder ? '0 0 100%' : 1,
  },
}));

const RecordingIconContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginLeft: theme.spacing(1),
  '& > svg': {
    fill: theme.palette.error.light,
  },
}));

const Chip = styled(MuiChip)(({ theme }) => ({
  marginLeft: theme.spacing(1),
  marginRight: 0,
  borderRadius: 0,
  borderColor: 'transparent',
  '& .MuiChip-label': {
    paddingRight: 0,
    '&:first-letter': {
      textTransform: 'capitalize',
    },
  },
}));

const CustomMenuItem = styled(MenuItem)(() => ({
  '&:hover': {
    cursor: 'pointer',
  },
}));

const ViewDropdownIcon = styled(ListItemIcon)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(16),
  minWidth: 35,
}));

const DurationIcon = styled(DefaultDurationIcon)(() => ({
  width: '0.6em',
}));

const PollIcon = styled(DefaultPollIcon)(() => ({
  width: '0.6em',
}));

const MeetingHeader = () => {
  const [sharedFolderEl, setSharedFolderEl] = useState<null | HTMLElement>(null);
  const [viewEl, setViewEl] = useState<null | HTMLElement>(null);
  const [waitingEl, setWaitingEl] = useState<null | HTMLElement>(null);
  const [areAllApproved, setApproveAll] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedLayout = useAppSelector(selectCinemaLayout);
  const participants = useAppSelector(selectAllOnlineParticipants);
  const selectedPage = useAppSelector(selectPaginationPageState);
  const protocolUrl = useAppSelector(selectProtocolUrl);
  const participantsInWaitingRoom = useAppSelector(selectAllParticipantsInWaitingRoom);
  const participantsInWaitingRoomCount = useAppSelector(selectParticipantsWaitingCount);
  const participantsNotApproved = useAppSelector(selectNotApprovedParticipants);
  const isModerator = useAppSelector(selectIsModerator);
  const votes = useAppSelector(legalVoteStore.selectAllVotes);
  const polls = useAppSelector(selectAllPollVotes);
  const hasVotesOrPolls = votes.length + polls.length > 0;
  const menuRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | SVGSVGElement | null>(null);
  const isWhiteboardAvailable = useAppSelector(selectIsWhiteboardAvailable);
  const isCurrentWhiteboardHighlighted = useAppSelector(selectIsCurrentWhiteboardHighlighted);
  const isCurrentProtocolHighlighted = useAppSelector(selectIsCurrentProtocolHighlighted);
  const recording = useAppSelector(selectRecordingState);
  const showWhiteboardIcon = isWhiteboardAvailable && selectedLayout !== LayoutOptions.Whiteboard;
  const fullscreenHandle = useFullscreenContext();
  const [clickCount, setClickCount] = useState(0);
  const clickTimer = useRef<NodeJS.Timeout | null>(null);
  const isSharedFolderOpened = useAppSelector(selectIsSharedFolderOpened);
  const sharedFolderUrl = useAppSelector(selectSharedFolderUrl);
  const sharedFolderPassword = useAppSelector(selectSharedFolderPassword);
  const isSharedFolderAvailable = useAppSelector(selectIsSharedFolderAvailable);
  const currentBreakoutRoom = useAppSelector(selectCurrentBreakoutRoom);
  const roomInfo = useAppSelector(selectEventInfo);

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

  useEffect(() => {
    if (participantsInWaitingRoomCount === 0) {
      setWaitingEl(null);
    }
  }, [participantsNotApproved, participantsInWaitingRoomCount]);

  const logoImage = () => <Logo width={'12.8997em'} height={'2.072em'} onClick={showDebugDialog} fill={'white'} />;

  const pageCount = useMemo(() => {
    return Math.ceil(participants.length / MAX_GRID_TILES);
  }, [participants]);

  useEffect(() => {
    if (selectedPage > pageCount || selectedPage === 0) {
      dispatch(paginationPageSet(pageCount));
    }
  }, [selectedPage, pageCount, dispatch]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, page: number) => {
    dispatch(paginationPageSet(page));
  };

  const toggleSharedFolderPopper = (event: React.MouseEvent<HTMLElement>) => {
    setSharedFolderEl(sharedFolderEl ? null : event.currentTarget);
  };

  const toggleViewPopper = (event: React.MouseEvent<HTMLElement>) => {
    setViewEl(viewEl ? null : event.currentTarget);
  };

  const resetHTMLElements = () => {
    setViewEl(null);
    setWaitingEl(null);
    setSharedFolderEl(null);
  };

  const handleSelectedView = async (layout: LayoutOptions) => {
    resetHTMLElements();
    dispatch(updatedCinemaLayout(layout));
  };

  const openFullscreenView = useCallback(async () => {
    resetHTMLElements();
    await fullscreenHandle.enter();
    dispatch(toggledFullScreenMode());
  }, [fullscreenHandle]);

  const renderSecurityIcon = () => window.location.protocol === 'https:' && <SecureConnectionField />;

  const renderViewIcon = () => {
    switch (selectedLayout) {
      case LayoutOptions.Grid:
        return <GridViewIcon />;
      case LayoutOptions.Protocol:
        return <Typography noWrap>{t('protocol-hide')}</Typography>;
      case LayoutOptions.Whiteboard:
        return <Typography noWrap>{t('whiteboard-hide')}</Typography>;
      case LayoutOptions.Speaker:
      default:
        return <SpeakerViewIcon />;
    }
  };

  const renderRecordingIcon = () => {
    if (!recording) {
      return null;
    }

    return (
      <RecordingIconContainer>
        <RecordingsIcon aria-label={t('recording-active-label')} />
      </RecordingIconContainer>
    );
  };

  const isViewPopoverOpen = Boolean(viewEl);
  const ViewPopper = (
    <ViewPopperContainer>
      <IconButton
        id="view-popover-menu-button"
        aria-expanded={isViewPopoverOpen ? 'true' : undefined}
        aria-haspopup="true"
        aria-controls={isViewPopoverOpen ? 'view-popover-menu' : undefined}
        aria-label={t('conference-view-trigger-button')}
        onClick={(event) =>
          [LayoutOptions.Protocol, LayoutOptions.Whiteboard].includes(selectedLayout)
            ? handleSelectedView(LayoutOptions.Grid)
            : toggleViewPopper(event)
        }
      >
        {renderViewIcon()}
      </IconButton>
      <Popover
        open={isViewPopoverOpen}
        anchorEl={viewEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={resetHTMLElements}
        role={undefined}
      >
        <PopperContainer>
          <MenuList id="view-popover-menu" autoFocusItem={isViewPopoverOpen} aria-labelledby="view-popover-menu-button">
            <MenuItem
              sx={(theme) => ({ padding: theme.spacing(1) })}
              onClick={() => handleSelectedView(LayoutOptions.Grid)}
            >
              <ViewDropdownIcon aria-hidden={true}>
                <GridViewIcon sx={{ fontSize: 'inherit' }} />
              </ViewDropdownIcon>
              {t('conference-view-grid')}
            </MenuItem>
            <MenuItem
              sx={(theme) => ({ padding: theme.spacing(1) })}
              onClick={() => handleSelectedView(LayoutOptions.Speaker)}
            >
              <ViewDropdownIcon aria-hidden={true}>
                <SpeakerViewIcon sx={{ fontSize: 'inherit' }} />
              </ViewDropdownIcon>
              {t('conference-view-speaker')}
            </MenuItem>
            <MenuItem sx={(theme) => ({ padding: theme.spacing(1) })} onClick={openFullscreenView}>
              <ViewDropdownIcon aria-hidden={true}>
                <FullscreenViewIcon sx={{ fontSize: 'inherit' }} />
              </ViewDropdownIcon>
              {t('conference-view-fullscreen')}
            </MenuItem>
          </MenuList>
        </PopperContainer>
      </Popover>
    </ViewPopperContainer>
  );

  const toggleWaitingPopper = (event: React.MouseEvent<HTMLElement>) => {
    setWaitingEl(waitingEl ? null : event.currentTarget);
  };

  const waitingRoomPopper = () => {
    if (participantsInWaitingRoomCount > 0 && isModerator) {
      return (
        <StyledBadge
          badgeContent={participantsInWaitingRoomCount}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <HeaderItem>
            <IconButton aria-describedby={'view-select'} onClick={toggleWaitingPopper}>
              <SpeakerQueueIcon />
            </IconButton>
            <Popover
              open={Boolean(waitingEl)}
              anchorEl={waitingEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
              onClose={resetHTMLElements}
              disablePortal
            >
              <WaitingParticipantList
                subheader={
                  <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                    <Typography variant="body2">{t('waiting-room-participant-label')}</Typography>
                    <Button variant="text" disabled={!participantsNotApproved} onClick={() => setApproveAll(true)}>
                      {t('approve-all-participants-from-waiting')}
                    </Button>
                  </Stack>
                }
              >
                {participantsInWaitingRoom.map((participant) => (
                  <WaitingParticipantItem
                    key={participant.id}
                    participant={participant}
                    approveAllWaiting={areAllApproved}
                    handleApproveAll={() => setApproveAll(false)}
                  />
                ))}
              </WaitingParticipantList>
            </Popover>
          </HeaderItem>
        </StyledBadge>
      );
    }
  };

  const handleProtocolClick = useCallback(() => {
    if (selectedLayout !== LayoutOptions.Protocol) {
      handleSelectedView(LayoutOptions.Protocol);
    }
  }, [selectedLayout, handleSelectedView]);

  const renderProtocolIcon = () => {
    return (
      <HeaderItem highlighted={isCurrentProtocolHighlighted}>
        <IconButton aria-describedby={'view-select'} onClick={handleProtocolClick}>
          <ProtocolIcon />
        </IconButton>
      </HeaderItem>
    );
  };

  const renderSharedFolderIcon = () => {
    return (
      <HeaderItem highlighted={!isSharedFolderOpened}>
        <IconButton aria-describedby={'view-select'} onClick={toggleSharedFolderPopper}>
          <SharedFolderIcon />
        </IconButton>
        <Popover
          open={Boolean(sharedFolderEl)}
          anchorEl={sharedFolderEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          onClose={resetHTMLElements}
          disablePortal
        >
          {sharedFolderUrl && (
            <MenuItem
              onClick={() => {
                dispatch(sharedFolderOpened());
                window.open(sharedFolderUrl, 'sharedFolder');
                resetHTMLElements();
              }}
            >
              {t('shared-folder-open-label')}
            </MenuItem>
          )}
          {sharedFolderPassword && (
            <MenuItem
              onClick={() => {
                navigator.clipboard.writeText(sharedFolderPassword);
                resetHTMLElements();
              }}
            >
              {t('shared-folder-password-label')}
            </MenuItem>
          )}
        </Popover>
      </HeaderItem>
    );
  };

  const handleWhiteboardClick = useCallback(() => {
    if (selectedLayout !== LayoutOptions.Whiteboard) {
      handleSelectedView(LayoutOptions.Whiteboard);
    }
  }, [selectedLayout, handleSelectedView]);

  const renderWhiteboardIcon = () => (
    <HeaderItem highlighted={isCurrentWhiteboardHighlighted}>
      <IconButton onClick={handleWhiteboardClick}>
        <WhiteboardIcon />
      </IconButton>
    </HeaderItem>
  );

  const openVotePoll = useCallback(
    (item: LegalVoteType | Poll) => {
      dispatch(setVotePollIdToShow(item.id));
    },
    [dispatch]
  );

  const renderLiveLabel = useCallback(
    (item: Vote | Poll) => {
      if ('live' in item) {
        return `${item.live ? t('votes-poll-overview-live-label') : t('votes-poll-overview-not-live-label')}`;
      }
      return '';
    },
    [t]
  );

  const getMenuItem = useCallback(
    (item: LegalVoteType | Poll) => {
      const label = Object.hasOwn(item, 'name') ? (item as LegalVoteType).name : (item as Poll).topic;

      return (
        <CustomMenuItem key={item.id} onClick={() => openVotePoll(item)}>
          <ListItemIcon>{Object.hasOwn(item, 'choices') ? <PollIcon /> : <LegalBallotIcon />}</ListItemIcon>
          <ListItemText sx={{ whiteSpace: 'normal' }}>{`${label}`}</ListItemText>
          <Chip
            size="medium"
            label={t(`global-state-${item.state}`)}
            color={item?.state === 'active' ? 'success' : 'error'}
            variant="filled"
            clickable={false}
          />
        </CustomMenuItem>
      );
    },
    [openVotePoll, renderLiveLabel]
  );

  const renderVotesPollsPopover = () => {
    if (!hasVotesOrPolls) {
      return <></>;
    }
    return (
      <Menu
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuList sx={{ maxWidth: 300 }}>
          <Stack p={2}>
            <Typography variant={'h2'} align={'center'}>
              {t('votes-poll-overview-title')}
            </Typography>
          </Stack>
          {votes.map((vote: LegalVoteType) => {
            return getMenuItem(vote);
          })}
          {polls.map((poll: Poll) => {
            return getMenuItem(poll);
          })}
        </MenuList>
      </Menu>
    );
  };

  const showDialog = () => {
    if (menuRef && menuRef.current) {
      setAnchorEl(menuRef.current);
    }
  };

  const getRoomTitle = () => {
    let roomTitle;
    if (currentBreakoutRoom && currentBreakoutRoom.name) {
      roomTitle = currentBreakoutRoom.name;
    } else if (roomInfo && roomInfo.title) {
      roomTitle = roomInfo.title;
    }
    return roomTitle;
  };

  return (
    <Content>
      <ContentItem>{logoImage()}</ContentItem>
      <ContentItem lgOrder={2}>
        <HeaderCenterContainer>
          <HeaderItem>
            <RoomTitle title={getRoomTitle()} />
          </HeaderItem>
          <HeaderItem>{ViewPopper}</HeaderItem>
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
          {(showWhiteboardIcon || protocolUrl) && (
            <>
              <HeaderDivider />
              {showWhiteboardIcon && renderWhiteboardIcon()}
              {protocolUrl && selectedLayout !== LayoutOptions.Protocol && renderProtocolIcon()}
            </>
          )}
          {isSharedFolderAvailable && renderSharedFolderIcon()}
        </HeaderCenterContainer>
      </ContentItem>
      <ContentItem>
        <Box justifyContent={'end'} height={'100%'} display={'flex'} gap={1}>
          {waitingRoomPopper()}
          <RightHeaderItem ref={menuRef}>
            <Stack spacing={1} direction={'row'}>
              {hasVotesOrPolls && <PollIcon fontSize={'medium'} onClick={showDialog} />}
              <DurationIcon />
            </Stack>
            <MeetingTimer aria-label="current time" />
            {renderSecurityIcon()}
          </RightHeaderItem>
          {renderRecordingIcon()}
        </Box>
        {renderVotesPollsPopover()}
      </ContentItem>
    </Content>
  );
};

export default MeetingHeader;
