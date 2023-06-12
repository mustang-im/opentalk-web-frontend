// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { Trans } from 'react-i18next';

import { useAppSelector } from '../../hooks';
import { selectEventInfo } from '../../store/slices/roomSlice';

const RecordingLink = styled('a')(({ theme }) => ({
  color: theme.palette.common.white,
}));

const RecordingStoppedMessage = () => {
  const eventInfo = useAppSelector(selectEventInfo);
  const messageLink = `/dashboard/meetings/${eventInfo?.id}`;
  return (
    <Trans
      i18nKey={'recording-stopped-message'}
      values={{ messageLink }}
      components={{
        messageContent: <div />,
        messageLink: <RecordingLink target="_blank" href={messageLink} />,
      }}
    />
  );
};

export default RecordingStoppedMessage;
