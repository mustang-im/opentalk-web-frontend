// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Collapse, Typography, Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

import { useGetMeQuery } from '../../../api/rest';
import ParticipantAvatar from '../../ParticipantAvatar';

interface ChipProps {
  collapsed: boolean;
  withLabel?: boolean;
}

const ProfileChip = ({ collapsed, withLabel }: ChipProps) => {
  const { data } = useGetMeQuery();
  const displayName = data?.displayName;

  return (
    <Button
      component={Link}
      to={'settings/profile'}
      variant="outlined"
      color="secondary"
      fullWidth
      sx={{
        p: 0,
        border: 'none',
        '&.MuiButton-root': {
          justifyContent: 'flex-start',
        },
        ':hover': {
          border: 'none',
        },
      }}
    >
      <ParticipantAvatar src={data?.avatarUrl} translate="no">
        {displayName}
      </ParticipantAvatar>
      {withLabel && (
        <Collapse orientation="horizontal" in={!collapsed}>
          <Typography noWrap translate="no">
            {displayName}
          </Typography>
        </Collapse>
      )}
    </Button>
  );
};

export default ProfileChip;
