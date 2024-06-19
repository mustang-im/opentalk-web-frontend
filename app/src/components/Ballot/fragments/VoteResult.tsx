// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Radio, InputLabel } from '@mui/material';
import { PollId, LegalVoteId } from '@opentalk/common';
import { legalVoteStore } from '@opentalk/components';
import React, { useState } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectPollToShow } from '../../../store/slices/pollSlice';

export enum VoteType {
  Poll = 'Poll',
  LegalVote = 'LegalVote',
}
interface IVoteData {
  numberOfVotes: number;
  votePercentage: number;
  isVotable: boolean;
  legalVoteId: LegalVoteId | PollId;
  currentVotes: number;
}

export interface IVoteResult {
  title: string;
  optionIndex: number;
  voteData: IVoteData;
  onVote: () => void;
  showResult?: boolean;
  isChecked?: boolean;
  voteType: VoteType;
}

const ProgressContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  height: '3em',
  display: 'flex',
  alignItems: 'center',
  backgroundColor: theme.palette.secondary.main,
  borderRadius: '0.5em',
  marginTop: theme.spacing(1),
  '& .MuiInputLabel-root': {
    color: theme.palette.secondary.contrastText,
    flex: 1,
    height: '100%',
    lineHeight: '3em',
  },
  '& .MuiRadio-root.MuiRadio-colorPrimary': {
    marginLeft: 0,
    aspectRatio: '1/1',
    borderRadius: '0',
    color: theme.palette.secondary.contrastText,
    '&.Mui-checked': {
      color: theme.palette.secondary.contrastText,
    },
    '&.Mui-disabled': {
      opacity: 0.6,
    },
    '&.Mui-disabled + .MuiInputLabel-root': {
      color: theme.palette.secondary.contrastText,
      opacity: 0.6,
    },
  },
  '& .MuiRadio-root:not(.Mui-disabled) + .MuiInputLabel-root': {
    cursor: 'pointer',
  },
}));

const ProgressLabel = styled('span')(({ theme }) => ({
  position: 'absolute',
  color: theme.palette.secondary.contrastText,
  right: '1em',
  bottom: '0.7em',
  zIndex: 1,
  display: 'flex',
  gap: '1em',
}));

const VoteResult = ({ title, voteData, onVote, showResult = true, isChecked, voteType, optionIndex }: IVoteResult) => {
  const didVote =
    voteType === VoteType.LegalVote
      ? Boolean(useAppSelector(legalVoteStore.selectCurrentShownVote)?.votedAt)
      : Boolean(useAppSelector(selectPollToShow)?.voted);
  const id = voteData.legalVoteId + '-' + optionIndex;
  const [showAdditionalInfo, setShowAdditionalInfo] = useState(false);

  return (
    <ProgressContainer
      onMouseEnter={() => setShowAdditionalInfo(true)}
      onMouseLeave={() => setShowAdditionalInfo(false)}
    >
      <Radio
        id={id}
        disabled={didVote || !voteData.isVotable}
        checked={isChecked}
        name={voteData.legalVoteId}
        onChange={onVote}
      />
      <InputLabel htmlFor={id}>{title}</InputLabel>
      {showResult && (
        <ProgressLabel>
          {`${voteData.votePercentage ? voteData.votePercentage.toFixed(1) : 0}% ${
            showAdditionalInfo ? `${voteData.currentVotes} / ${voteData.numberOfVotes}` : ''
          }`}
        </ProgressLabel>
      )}
    </ProgressContainer>
  );
};

export default VoteResult;
