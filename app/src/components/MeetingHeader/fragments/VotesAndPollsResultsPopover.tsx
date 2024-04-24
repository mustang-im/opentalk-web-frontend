// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Menu, styled } from '@mui/material';
import { PollIcon, generateUniquedId } from '@opentalk/common';
import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectActivePollsAndVotingsCount, selectPollsAndVotingsCount } from '../../../store/selectors';
import { MeetingHeaderButton } from './MeetingHeaderButton';
import ResultsList from './ResultsList';

const CustomMenu = styled(Menu)({
  maxWidth: 420,
});

const VotesAndPollsResultsPopover = () => {
  const id = generateUniquedId();
  const anchorEl = useRef<HTMLButtonElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const votingsAndPollsCount = useAppSelector(selectPollsAndVotingsCount);
  const hasVotingsOrPolls = votingsAndPollsCount > 0;
  const activeVotesOrPolls = useAppSelector(selectActivePollsAndVotingsCount);
  const hasActiveVotesOrPolls = activeVotesOrPolls > 0;
  const { t } = useTranslation();

  const showDialog = () => setIsExpanded(true);
  const closeDialog = () => setIsExpanded(false);

  if (!hasVotingsOrPolls) {
    return null;
  }

  return (
    <>
      <MeetingHeaderButton
        ref={anchorEl}
        onClick={showDialog}
        aria-controls={id}
        aria-haspopup="menu"
        aria-expanded={isExpanded}
        aria-label={t('votes-poll-button-show')}
        active={hasActiveVotesOrPolls}
      >
        <PollIcon fontSize="medium" />
      </MeetingHeaderButton>
      <CustomMenu
        id={id}
        open={isExpanded}
        onClose={closeDialog}
        anchorEl={anchorEl.current}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <ResultsList />
      </CustomMenu>
    </>
  );
};

export default VotesAndPollsResultsPopover;
