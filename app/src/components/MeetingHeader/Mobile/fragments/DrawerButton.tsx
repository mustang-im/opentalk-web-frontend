// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';

import { LogoSmallIcon } from '../../../../assets/icons';
import { IconButton as DefaultIconButton } from '../../../../commonComponents';
import { useAppSelector } from '../../../../hooks';
import { selectPollsAndVotingsCount } from '../../../../store/selectors';
import { selectUnreadGlobalMessageCount, selectUnreadPersonalMessageCount } from '../../../../store/slices/chatSlice';
import { selectParticipantsWaitingCount } from '../../../../store/slices/participantsSlice';
import { selectIsSharedFolderAvailableIndicatorVisible } from '../../../../store/slices/sharedFolderSlice';
import {
  selectHaveSeenMobilePollsAndVotes,
  selectIsCurrentWhiteboardHighlighted,
} from '../../../../store/slices/uiSlice';
import { selectIsModerator } from '../../../../store/slices/userSlice';
import { Indicator } from '../../fragments/Indicator';

const IconButton = styled(DefaultIconButton)(({ theme }) => ({
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  width: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(0),
  },
  '& .MuiSvgIcon-root': {
    fontSize: '1.5rem',
  },
}));

const ButtonIndicator = styled(Indicator)({
  position: 'absolute',
  top: '0.1rem',
  right: '0.1rem',
});

type DrawerButtonProps = {
  onClick(): void;
};

export const DrawerButton = ({ onClick }: DrawerButtonProps) => {
  const isModerator = useAppSelector(selectIsModerator);
  const unreadGlobalMessageCount = useAppSelector(selectUnreadGlobalMessageCount);
  const unreadPersonalMessageCount = useAppSelector(selectUnreadPersonalMessageCount);
  const isCurrentWhiteboardHighlighted = useAppSelector(selectIsCurrentWhiteboardHighlighted);
  const isSharedFolderAvailableIndicatorVisible = useAppSelector(selectIsSharedFolderAvailableIndicatorVisible);
  const participantsWaitingCount = useAppSelector(selectParticipantsWaitingCount);
  const hasParticipantsWaiting = participantsWaitingCount > 0;
  const hasUnreadMessages = unreadGlobalMessageCount > 0 || unreadPersonalMessageCount > 0;
  const voteAndPollCount = useAppSelector(selectPollsAndVotingsCount);
  const haveSeenMobilePollsAndVotes = useAppSelector(selectHaveSeenMobilePollsAndVotes);
  const showWaitingRoomIndicator = isModerator && hasParticipantsWaiting;
  const showPollAndVoteIndicator = !isModerator && voteAndPollCount > 0 && !haveSeenMobilePollsAndVotes;

  const showIndicator =
    hasUnreadMessages ||
    isCurrentWhiteboardHighlighted ||
    isSharedFolderAvailableIndicatorVisible ||
    showWaitingRoomIndicator ||
    showPollAndVoteIndicator;

  return (
    <IconButton onClick={onClick}>
      <LogoSmallIcon />
      {showIndicator && <ButtonIndicator />}
    </IconButton>
  );
};
