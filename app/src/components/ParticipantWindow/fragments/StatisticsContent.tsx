// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';

import SuspenseLoading from '../../../commonComponents/SuspenseLoading';
import { useAppSelector } from '../../../hooks';
import { MediaDescriptor } from '../../../modules/WebRTC';
import { selectStatsById } from '../../../store/slices/connectionStatsSlice';
import { formatBitRate } from '../../../utils/numberUtils';

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '3fr 2fr',
  padding: theme.spacing(1),
}));

export const StatisticsContent = ({ descriptor }: { descriptor: MediaDescriptor }) => {
  const stats = useAppSelector(selectStatsById(descriptor));
  const { t } = useTranslation();
  if (stats === undefined) {
    return <SuspenseLoading />;
  }

  const { bitRate, frameRate, packetLoss, frameHeight, frameWidth, jitter, codingTime, roundTripTime } = stats;

  const validJitter = jitter !== undefined && jitter > 0.0005 && Math.round(jitter * 1000);
  const validLatency = roundTripTime !== undefined && roundTripTime > 0.0005 && Math.round((roundTripTime / 2) * 1000);
  const validPacketLoss = packetLoss !== undefined && Math.round(packetLoss * 100);

  return (
    <ContentContainer>
      {frameHeight && frameWidth && (
        <>
          <Typography variant={'body2'}>{`${t('statistics-video')}: `}</Typography>
          <Typography variant={'body2'} align={'right'}>
            {`${frameWidth}x${frameHeight}`}
          </Typography>
        </>
      )}
      <Typography variant={'body2'}>{`${t('statistics-rate')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {formatBitRate(bitRate)}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-fps')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {frameRate ? `${Math.round(frameRate)} FPS` : '-'}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-jitter')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {validJitter ? `${validJitter} ms` : '-'}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-latency')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {validLatency ? `${validLatency} ms` : '-'}
      </Typography>
      <Typography variant={'body2'}>{`${t('statistics-packets-lost')}: `}</Typography>
      <Typography variant={'body2'} align={'right'}>
        {validPacketLoss ? `${validPacketLoss} % ` : '-'}
      </Typography>
      {codingTime !== undefined && (
        <>
          <Typography variant={'body2'}>{`${t('statistics-decode-time')}: `}</Typography>
          <Typography variant={'body2'} align={'right'}>
            {Math.round(codingTime * 1000)} ms
          </Typography>
        </>
      )}
    </ContentContainer>
  );
};
