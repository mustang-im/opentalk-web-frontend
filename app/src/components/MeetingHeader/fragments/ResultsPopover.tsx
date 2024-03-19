// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Menu, styled } from '@mui/material';
import { PollIcon as DefaultPollIcon } from '@opentalk/common';
import { useState, MouseEvent } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectPollsAndVotingsCount } from '../../../store/selectors';
import ResultsList from './ResultsList';

const CustomMenu = styled(Menu)({
  maxWidth: 420,
});

const ResultsPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | SVGSVGElement | null>(null);
  const votingsAndPollsCount = useAppSelector(selectPollsAndVotingsCount);

  const showDialog = (event: MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return votingsAndPollsCount < 1 ? (
    <>{null}</>
  ) : (
    <>
      <DefaultPollIcon fontSize={'medium'} onClick={showDialog} />
      <CustomMenu
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
        }}
        anchorEl={anchorEl}
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

export default ResultsPopover;
