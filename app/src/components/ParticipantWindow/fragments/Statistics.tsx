// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Popover } from '@mui/material';
import { ConnectionGoodIcon, ConnectionMediumIcon, ConnectionBadIcon } from '@opentalk/common';
import React, { useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { MediaDescriptor } from '../../../modules/WebRTC';
import { selectSubscriberById } from '../../../store/slices/mediaSubscriberSlice';
import { StatisticsContent } from './StatisticsContent';
import { OverlayIconButton } from './VideoOverlay';

const Statistics = ({
  descriptor,
  disablePopoverPortal,
  packetLossPercent,
}: {
  descriptor: MediaDescriptor;
  disablePopoverPortal?: boolean | undefined;
  packetLossPercent: number;
}) => {
  const subscriber = useAppSelector(selectSubscriberById(descriptor));
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const connectionIcon = useMemo(() => {
    if (packetLossPercent > 10) {
      return <ConnectionBadIcon color="error" />;
    } else if (packetLossPercent >= 1 && packetLossPercent <= 10) {
      return <ConnectionMediumIcon color="warning" />;
    }
    return <ConnectionGoodIcon />;
  }, [packetLossPercent]);

  const handleClose = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(null);
  }, []);

  const toggleStats = useCallback((event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  // show no stats when the participant is not publishing and therefore not connected
  if (
    subscriber === undefined ||
    subscriber.subscriberState.connection === 'new' ||
    subscriber.subscriberState.connection === 'closed'
  ) {
    return <></>;
  }

  return (
    <>
      <OverlayIconButton onClick={toggleStats} size="large" color="secondary" aria-label={t('statistics-video')}>
        {connectionIcon}
      </OverlayIconButton>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disablePortal={disablePopoverPortal}
        keepMounted={false}
      >
        <StatisticsContent descriptor={descriptor} />
      </Popover>
    </>
  );
};

export default Statistics;
