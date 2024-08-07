// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Box,
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Paper,
  Stack,
  DialogActions,
  Button,
  styled,
} from '@mui/material';
import { CloseIcon, IconButton, CopyTextField, notifications, RoomInfo } from '@opentalk/common';
import { EventInfo } from '@opentalk/common';
import { CallIn } from '@opentalk/rest-api-rtk-query';
import { Trans, useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectUserAsParticipant } from '../../../store/selectors';
import { selectCurrentBreakoutRoomId } from '../../../store/slices/breakoutSlice';
import { selectBaseUrl } from '../../../store/slices/configSlice';
import { composeInviteUrl } from '../../../utils/apiUtils';
import { FieldKeys } from '../../InviteToMeeting/fragments/MeetingLinkField';

export type MeetingDetailsDialogProps = {
  eventInfo: EventInfo;
  roomInfo: RoomInfo;
  open: boolean;
  onClose: () => void;
};

const SubTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(12),
  fontWeight: 'normal',
  padding: theme.spacing(0, 3),
  marginTop: theme.spacing(-2),
}));

const DialogActionsTitle = styled(Typography)(({ theme }) => ({
  fontSize: theme.typography.pxToRem(14),
  fontWeight: 'bold',
  padding: theme.spacing(0, 3),
  marginBottom: theme.spacing(2),
}));

const DialogActionsLeftAligned = styled(DialogActions)({ justifyContent: 'start' });

const MeetingDetailsDialog = ({ open, onClose, eventInfo, roomInfo }: MeetingDetailsDialogProps) => {
  const { t } = useTranslation();
  const { callIn, inviteCodeId, streamingLinks } = eventInfo.meetingDetails;
  const { title, roomId } = eventInfo;
  const { createdBy: roomOwner, password: roomPassword } = roomInfo;
  const baseUrl = useAppSelector(selectBaseUrl);
  const currentUser = useAppSelector(selectUserAsParticipant);
  const currentBreakoutRoomId = useAppSelector(selectCurrentBreakoutRoomId);
  const inviteUrl = roomId ? composeInviteUrl(baseUrl, roomId, inviteCodeId, currentBreakoutRoomId) : null;
  const streamingLinksExist = () => streamingLinks.length > 0;

  const handleClipboardClick = () => {
    navigator.clipboard.writeText(createClipboardString()).then(() => {
      notifications.success(t('meeting-details-dialog-copy-success'));
    });
  };

  const handleMailToClick = () => window.open(createMailToLinkString());

  const createStreamingLinkString = () =>
    streamingLinks.map((streamingLink) => `${streamingLink.name}: ${streamingLink.url}`).join('\n');

  const createCallInString = (callIn: CallIn) => `${t('global-call-in')}
${t('global-call-in-number')}: ${callIn.tel}
${t('global-call-in-id')}: ${callIn.id}
${t('global-call-in-pin')}: ${callIn.password}
  `;

  const getRoomOwnerNameString = () => roomOwner.firstname + ' ' + roomOwner.lastname;

  const createClipboardString = () => {
    return `${t('meeting-details-dialog-invite-line', { name: currentUser?.displayName })}.

${t('global-title')}: ${title}

${t('meeting-details-dialog-join-line')}:

${t('global-meeting-link')}: ${inviteUrl}
${roomPassword ? t('global-password') + ': ' + roomPassword : ''}
${callIn ? createCallInString(callIn) : ''}
${
  streamingLinksExist()
    ? t('global-streaming-link', { count: streamingLinks.length }) + '\n' + createStreamingLinkString()
    : ''
}`;
  };

  const createMailToLinkString = () => {
    const subject = `subject=OpenTalk Meeting Invitation - ${title}`;
    const body = `body=${createClipboardString()}`;
    return encodeURI(`mailto:?${subject}&${body}`);
  };

  const renderStreamingLinks = () => (
    <>
      <Typography variant="h2">{getLabelText(FieldKeys.LivestreamLink)}</Typography>
      {streamingLinks.map((streamingLink) => (
        <CopyTextField
          key="global-streaming-link"
          label={streamingLink.name}
          value={streamingLink.url}
          ariaLabel={getAriaLabelText(FieldKeys.LivestreamLink, streamingLink.name)}
          notificationText={getNotificationText(FieldKeys.LivestreamLink)}
        />
      ))}
    </>
  );

  const renderSubtitle = () => (
    <Trans
      i18nKey="meeting-details-dialog-subtitle"
      values={{ roomOwner: getRoomOwnerNameString() }}
      components={{ subtitle: <SubTitle />, strong: <strong /> }}
    />
  );
  const sipLink = callIn ? `${callIn.tel},,${callIn.id},,${callIn.password}` : undefined;
  const getNotificationText = (fieldKey: FieldKeys) => t(`meeting-details-dialog-copy-${fieldKey}-success`);
  const getLabelText = (fieldKey: FieldKeys) => t(`meeting-details-dialog-label-${fieldKey}`);
  const getAriaLabelText = (fieldKey: FieldKeys, name?: string) =>
    t(`meeting-details-dialog-aria-label-${fieldKey}`, { name });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xs"
      PaperComponent={Paper}
      aria-labelledby="detail-invite-title"
    >
      <DialogTitle aria-hidden="true" sx={{ width: '95%' }}>
        {t('meeting-details-dialog-title', { title })}
      </DialogTitle>
      {roomOwner && renderSubtitle()}
      <Box position="absolute" top={4} right={2}>
        <IconButton onClick={onClose} aria-label={t('global-close-dialog')}>
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent>
        <Stack spacing={2}>
          <CopyTextField
            label={getLabelText(FieldKeys.InviteLink)}
            value={inviteUrl?.toString()}
            ariaLabel={getAriaLabelText(FieldKeys.InviteLink)}
            notificationText={getNotificationText(FieldKeys.InviteLink)}
          />
          <CopyTextField
            label={getLabelText(FieldKeys.SipLink)}
            value={sipLink}
            ariaLabel={getAriaLabelText(FieldKeys.SipLink)}
            notificationText={getNotificationText(FieldKeys.SipLink)}
          />
          {roomPassword && (
            <CopyTextField
              label={getLabelText(FieldKeys.RoomPassword)}
              value={roomPassword}
              ariaLabel={getAriaLabelText(FieldKeys.RoomPassword)}
              notificationText={getNotificationText(FieldKeys.RoomPassword)}
            />
          )}
          {streamingLinksExist() && renderStreamingLinks()}
        </Stack>
      </DialogContent>

      <DialogActionsTitle>{t('meeting-details-dialog-button-header')}</DialogActionsTitle>
      <DialogActionsLeftAligned>
        {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
        <Button type="submit" variant="outlined" color="secondary" onClick={handleClipboardClick} autoFocus>
          {t('meeting-details-dialog-copy-button')}
        </Button>
        <Button type="submit" variant="outlined" color="secondary" onClick={handleMailToClick}>
          {t('meeting-details-dialog-mail-button')}
        </Button>
      </DialogActionsLeftAligned>
    </Dialog>
  );
};

export default MeetingDetailsDialog;
