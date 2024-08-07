// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, BoxProps, Typography } from '@mui/material';
import { DurationIcon } from '@opentalk/common';
import { useEffect, useState } from 'react';

interface VoteCountdownProps extends BoxProps {
  duration: number;
  startTime: string;
  active: boolean;
}

function formatSeconds(seconds: number): string {
  const _hours = Math.floor(seconds / 3600);
  const _minutes = Math.floor((seconds - _hours * 3600) / 60);
  const _seconds = seconds - _hours * 3600 - _minutes * 60;

  const output = [
    _hours > 0 ? String(_hours).padStart(2, '0') + ':' : '',
    _minutes > 0 ? String(_minutes).padStart(2, '0') + ':' : '00:',
    _seconds > 0 ? String(_seconds).padStart(2, '0') : '00',
  ];

  return output.join('');
}

export default function LegalVoteCountdown({ active, duration, startTime, ...boxProps }: VoteCountdownProps) {
  const [counter, setCounter] = useState<string>('');

  useEffect(() => {
    if (!active) {
      setCounter('00:00');
      return;
    }

    const startDate = new Date(startTime);
    const endDate = new Date(startDate);
    endDate.setSeconds(startDate.getSeconds() + duration);

    function updateCounter() {
      const delta = Number(endDate) - Date.now();

      if (delta < 0) {
        // stop the timer.
        setCounter('00:00');
        clearInterval(interval);
        return;
      }

      const remainingSeconds = Math.floor(delta / 1000);
      setCounter(formatSeconds(remainingSeconds));
    }

    updateCounter();

    const interval = setInterval(() => {
      updateCounter();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [duration, startTime, active]);

  return (
    <Box display="flex" alignItems="center" {...boxProps}>
      <DurationIcon />
      <Typography ml={0.5} sx={{ fontVariantNumeric: 'tabular-nums' }}>
        {counter}
      </Typography>
    </Box>
  );
}
