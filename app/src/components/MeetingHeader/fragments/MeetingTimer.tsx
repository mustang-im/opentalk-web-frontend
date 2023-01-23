// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import { useAppSelector } from '../../../hooks';
import { selectJoinedFirstTimestamp } from '../../../store/selectors';
import { getIntervalToDurationString } from '../../../utils/timeUtils';

const MeetingTimer = () => {
  const [meetingTime, setMeetingTime] = useState<string>('00 : 00');
  const meetingStartPoint = useAppSelector(selectJoinedFirstTimestamp);
  const startTime = useMemo(() => (meetingStartPoint ? new Date(meetingStartPoint) : new Date()), [meetingStartPoint]);

  const getDuration = useCallback(() => {
    setMeetingTime(
      getIntervalToDurationString({
        start: startTime,
        end: new Date(),
      })
    );
  }, [startTime]);

  useEffect(() => {
    const interval = setInterval(() => getDuration(), 1000);
    return () => clearInterval(interval);
  }, [getDuration, meetingTime]);

  return (
    <Typography variant={'body2'} minWidth="4em">
      {meetingTime}
    </Typography>
  );
};

export default MeetingTimer;
