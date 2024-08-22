// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Dialog, styled, Paper } from '@mui/material';
import { EntityId } from '@reduxjs/toolkit';
import { batch } from 'react-redux';

import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  closedResultWindow as closedLegalVoteResultWindow,
  selectCurrentShownVoteId,
  selectVoteById,
} from '../../store/slices/legalVoteSlice';
import {
  selectPollIdToShow,
  closedResultWindow as closedPollResultWindow,
  selectPollById,
} from '../../store/slices/pollSlice';
import { selectVoteOrPollIdToShow, setVoteOrPollIdToShow } from '../../store/slices/uiSlice';
import { selectOurUuid } from '../../store/slices/userSlice';
import { LegalVoteContainer } from './fragments/LegalVoteContainer';
import { PollContainer } from './fragments/PollContainer';
import { ReportSection } from './fragments/ReportSection';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '1rem',
  background: theme.palette.background.voteResult,
  padding: theme.spacing(2),
}));

export default function Ballot() {
  const dispatch = useAppDispatch();
  const voteIdToShow = useAppSelector(selectCurrentShownVoteId);
  const pollIdToShow = useAppSelector(selectPollIdToShow);
  const voteOrPollIdToShow = useAppSelector(selectVoteOrPollIdToShow); // when user selects a vote to preview from the dropdown menu

  const pollToShow = useAppSelector(
    selectPollById((voteOrPollIdToShow ? voteOrPollIdToShow : pollIdToShow) as EntityId)
  );
  const legalVoteToShow = useAppSelector(
    selectVoteById((voteOrPollIdToShow ? voteOrPollIdToShow : voteIdToShow) as EntityId)
  );

  const ourUuid = useAppSelector(selectOurUuid);
  const isAllowedToVote =
    ourUuid && legalVoteToShow ? Boolean(legalVoteToShow.allowedParticipants?.includes(ourUuid)) : false;

  const handleClose = () => {
    batch(() => {
      dispatch(setVoteOrPollIdToShow(undefined));
      dispatch(closedLegalVoteResultWindow());
      dispatch(closedPollResultWindow());
    });
  };

  if (pollToShow) {
    return (
      <Dialog
        PaperComponent={StyledPaper}
        onClose={handleClose}
        open={true}
        maxWidth="sm"
        fullWidth
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <PollContainer onClose={handleClose} poll={pollToShow} />
      </Dialog>
    );
  }

  if (legalVoteToShow) {
    return (
      <Dialog
        PaperComponent={StyledPaper}
        onClose={handleClose}
        open={true}
        maxWidth={false}
        fullWidth
        onKeyDown={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
        PaperProps={{
          sx: { maxWidth: 700 },
        }}
      >
        <LegalVoteContainer onClose={handleClose} legalVote={legalVoteToShow} isAllowedToVote={isAllowedToVote} />
        {isAllowedToVote && <ReportSection legalVoteId={legalVoteToShow.id} />}
      </Dialog>
    );
  }

  return null;
}
