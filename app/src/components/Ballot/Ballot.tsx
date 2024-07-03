// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Dialog, styled, Paper } from '@mui/material';
import { batch } from 'react-redux';

import { useAppSelector, useAppDispatch } from '../../hooks';
import {
  closeResultWindow,
  selectCurrentShownVoteId,
  selectShowLegalVoteWindow,
} from '../../store/slices/legalVoteSlice';
import {
  selectPollIdToShow,
  selectShowResult as selectShowPollResult,
  closedResult as closedPollResult,
} from '../../store/slices/pollSlice';
import { selectVoteOrPollIdToShow, setVoteOrPollIdToShow } from '../../store/slices/uiSlice';
import VoteResultContainer from './fragments/VoteResultContainer';

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '1rem',
  background: theme.palette.background.voteResult,
  padding: theme.spacing(2),
}));

export default function Ballot() {
  const dispatch = useAppDispatch();
  const showVoteResult = useAppSelector(selectShowLegalVoteWindow);
  const voteIdToShow = useAppSelector(selectCurrentShownVoteId);
  const showPollResult = useAppSelector(selectShowPollResult);
  const pollIdToShow = useAppSelector(selectPollIdToShow);
  const voteOrPollIdToShow = useAppSelector(selectVoteOrPollIdToShow);

  const getVoteOrPollIdToShow = () => {
    if (voteOrPollIdToShow) {
      return voteOrPollIdToShow;
    } else if (voteIdToShow !== undefined && showVoteResult) {
      return voteIdToShow;
    } else if (pollIdToShow !== undefined && showPollResult) {
      return pollIdToShow;
    } else {
      return undefined;
    }
  };

  const handleClose = () => {
    batch(() => {
      dispatch(setVoteOrPollIdToShow(undefined));
      dispatch(closeResultWindow());
      dispatch(closedPollResult());
    });
  };

  const voteOrPollId = getVoteOrPollIdToShow();
  if (voteOrPollId) {
    return (
      <Dialog PaperComponent={StyledPaper} onClose={handleClose} open={true} maxWidth="sm" fullWidth>
        <VoteResultContainer voteOrPollId={voteOrPollId} onClose={handleClose} />
      </Dialog>
    );
  } else {
    return null;
  }
}
