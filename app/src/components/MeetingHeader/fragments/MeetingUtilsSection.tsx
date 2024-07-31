// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Stack, Tooltip } from '@mui/material';
import { RecordingsIcon as DefaultRecordingsIcon, DurationIcon, LiveIcon as DefaultLiveIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectIsRecordingActive, selectIsStreamActive } from '../../../store/slices/streamingSlice';
import { selectIsModerator } from '../../../store/slices/userSlice';
import MeetingTimer from './MeetingTimer';
import SecureConnectionField from './SecureConnectionField';
import WaitingParticipantsPopover from './WaitingParticipantsPopover';

const ContainerWithBackground = styled(Stack)(({ theme }) => ({
  background: theme.palette.background.video,
  height: '100%',
  alignItems: 'center',
  justifyContet: 'center',
  padding: theme.spacing(0, 1),
  borderRadius: '0.25rem',
  //Applies proper size to each icon inside
  '& .MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(16),
  },
}));

const Container = styled(Stack)({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
});

const RecordingsIcon = styled(DefaultRecordingsIcon)(({ theme }) => ({
  fill: theme.palette.error.light,
}));

const LiveIcon = styled(DefaultLiveIcon)(({ theme }) => ({
  fill: theme.palette.error.light,
}));

const MeetingUtilsSection = () => {
  const isModerator = useAppSelector(selectIsModerator);
  const isRecordingActive = useAppSelector(selectIsRecordingActive);
  const isStreamingActive = useAppSelector(selectIsStreamActive);
  const { t } = useTranslation();

  const showSecurityIcon = window.location.protocol === 'https:';

  const renderRecordingIcon = () => {
    return (
      <Tooltip title={t('recording-started-tooltip')}>
        <Stack>
          <RecordingsIcon aria-label={t('recording-active-label')} />
        </Stack>
      </Tooltip>
    );
  };

  return (
    <Container spacing={1} direction={'row'}>
      {isModerator && <WaitingParticipantsPopover />}
      <ContainerWithBackground spacing={1} direction={'row'}>
        <DurationIcon />
        <MeetingTimer aria-label="current time" />
        {showSecurityIcon && <SecureConnectionField />}
      </ContainerWithBackground>
      {isRecordingActive && renderRecordingIcon()}
      {isStreamingActive && <LiveIcon aria-label={t('livestream-active-label')} />}
    </Container>
  );
};

export default MeetingUtilsSection;
