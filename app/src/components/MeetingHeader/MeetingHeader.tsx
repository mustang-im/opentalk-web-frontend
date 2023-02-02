// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Popover,
  styled,
  Pagination,
  Typography,
  Tooltip,
  Stack,
  Button,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuList,
  Badge,
  Chip as MuiChip,
} from '@mui/material';
import { keyframes } from '@mui/system';
import {
  DurationIcon,
  SpeakerViewIcon,
  GridViewIcon,
  FullscreenViewIcon,
  NewMessageIcon,
  SpeakerQueueIcon,
  PollIcon,
  LegalBallotIcon,
  WhiteboardIcon,
  RecordingsIcon,
  SecureIcon,
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
import {
  participantsLayoutSet,
  selectParticipantsLayout,
  paginationPageSet,
  selectPaginationPageState,
  setVotePollIdToShow,
  toggleDebugMode,
} from '../../store/slices/uiSlice';
import { selectIsModerator } from '../../store/slices/userSlice';
import { selectIsWhiteboardAvailable } from '../../store/slices/whiteboardSlice';
import { MAX_GRID_TILES } from '../GridView/GridView';
import { Vote } from '../VoteResult/VoteResultContainer';
import MeetingTimer from './fragments/MeetingTimer';
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

const CurrentRoomText = styled(Typography)(({ theme }) => ({
  textTransform: 'inherit',
  padding: theme.spacing(0.5, 1),
  fontSize: theme.typography.pxToRem(14),
}));

const WaitingPopperContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  maxHeight: 200,
  overflow: 'scroll',
  alignItems: 'space-between',
  padding: theme.spacing(1, 1),
  borderRadius: '0.1rem',
  background: 'rgba(0, 0, 0, 0.5)',
}));

const PopperContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'space-between',
  padding: theme.spacing(0.5, 1),
  borderRadius: '0.1rem',
  background: 'rgba(0, 0, 0, 0.5)',
}));

const ViewPopperContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
});

const HeaderItem = styled('div')({
  background: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '0.25rem',
  display: 'inline-flex',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
});

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
  '& svg': {
    width: '0.6em',
    height: '0.6em',
    fill: theme.palette.common.white,
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

const MeetingHeader = () => {
  const [infoEl, setInfoEl] = useState<null | HTMLElement>(null);
  const [viewEl, setViewEl] = useState<null | HTMLElement>(null);
  const [waitingEl, setWaitingEl] = useState<null | HTMLElement>(null);
  const [areAllApproved, setApproveAll] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const selectedLayout = useAppSelector(selectParticipantsLayout);
  const currentBreakoutRoom = useAppSelector(selectCurrentBreakoutRoom);
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
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const showWhiteboard = useAppSelector(selectIsWhiteboardAvailable);
  const recording = useAppSelector(selectRecordingState);

  const fullscreenHandle = useFullscreenContext();

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

  const LogoImage = () => {
    return <Logo width={'12.8997em'} height={'2.072em'} onClick={showDebugDialog} fill={'white'} />;
  };

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

  const toggleViewPopper = (event: React.MouseEvent<HTMLElement>) => {
    setViewEl(viewEl ? null : event.currentTarget);
  };

  const resetHTMLElements = () => {
    setInfoEl(null);
    setViewEl(null);
    setWaitingEl(null);
  };

  const handleSelectedView = async (layout: LayoutOptions) => {
    resetHTMLElements();
    dispatch(participantsLayoutSet(layout));
  };

  const openFullscreenView = useCallback(async () => {
    resetHTMLElements();
    await fullscreenHandle.enter();
  }, [fullscreenHandle]);

  const renderSecurityIcon = () =>
    window.location.protocol === 'https:' && (
      <Tooltip title={`${t('meeting-room-header-connection-secure')}`}>
        <Stack>
          <SecureIcon aria-label="secure connection" />
        </Stack>
      </Tooltip>
    );

  const renderViewIcon = () => {
    switch (selectedLayout) {
      case LayoutOptions.Grid:
        return <GridViewIcon />;
      case LayoutOptions.Whiteboard:
        return <WhiteboardIcon />;
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

  const ViewPopper = () => (
    <ViewPopperContainer>
      <IconButton aria-describedby={'view-select'} onClick={toggleViewPopper}>
        {renderViewIcon()}
      </IconButton>
      <Popover
        open={Boolean(viewEl)}
        anchorEl={viewEl}
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
        <PopperContainer>
          <IconButton onClick={() => handleSelectedView(LayoutOptions.Grid)}>
            <GridViewIcon />
          </IconButton>
          <IconButton onClick={() => handleSelectedView(LayoutOptions.Speaker)}>
            <SpeakerViewIcon />
          </IconButton>
          {showWhiteboard && (
            <IconButton onClick={() => handleSelectedView(LayoutOptions.Whiteboard)}>
              <WhiteboardIcon />
            </IconButton>
          )}
          <IconButton onClick={openFullscreenView}>
            <FullscreenViewIcon />
          </IconButton>
        </PopperContainer>
      </Popover>
    </ViewPopperContainer>
  );

  const RoomPopper = () => (
    <div>
      <CurrentRoomText>
        {currentBreakoutRoom !== undefined ? currentBreakoutRoom.name : t('header-meeting-room')}
      </CurrentRoomText>
    </div>
  );

  const toggleInfoPopper = (event: React.MouseEvent<HTMLElement>) => {
    setInfoEl(infoEl ? null : event.currentTarget);
  };

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
              <WaitingPopperContainer>
                <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
                  <Typography variant="body2">{t('waiting-room-participant-label')}</Typography>
                  <Button variant="text" disabled={!participantsNotApproved} onClick={() => setApproveAll(true)}>
                    {t('approve-all-participants-from-waiting')}
                  </Button>
                </Stack>
                {participantsInWaitingRoom.map((participant) => (
                  <WaitingParticipantItem
                    key={participant.id}
                    participant={participant}
                    approveAllWaiting={areAllApproved}
                    handleApproveAll={() => setApproveAll(false)}
                  />
                ))}
              </WaitingPopperContainer>
            </Popover>
          </HeaderItem>
        </StyledBadge>
      );
    }
  };

  const navigateToProtocolUrl = () => {
    protocolUrl !== null && window.open(protocolUrl, '_blank');
    setInfoEl(null);
  };

  const renderProtocolInfo = () => (
    <ViewPopperContainer>
      <IconButton aria-describedby={'view-select'} onClick={toggleInfoPopper}>
        <NewMessageIcon />
      </IconButton>
      <Popover
        open={Boolean(infoEl)}
        anchorEl={infoEl}
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
        <PopperContainer>
          <Button variant={'text'} size="small" color={'secondary'} onClick={navigateToProtocolUrl}>
            {t('protocol-join-session')}
          </Button>
        </PopperContainer>
      </Popover>
    </ViewPopperContainer>
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

  return (
    <Content>
      <ContentItem>
        <LogoImage />
      </ContentItem>
      <ContentItem lgOrder={2}>
        <HeaderCenterContainer>
          <HeaderItem>{RoomPopper()}</HeaderItem>
          <HeaderItem>{ViewPopper()}</HeaderItem>
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
          {protocolUrl && <HeaderItem>{renderProtocolInfo()}</HeaderItem>}
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
