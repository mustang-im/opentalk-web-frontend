// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { EventId, StreamingKind, StreamingStatus } from '@opentalk/rest-api-rtk-query';
import { Trans } from 'react-i18next';

import { notifications } from '../../commonComponents';
import { useInviteCode } from '../../hooks/useInviteCode';

const Link = styled('a')(({ theme }) => ({
  color: theme.palette.common.white,
}));

interface NotificationProps {
  kind: StreamingKind;
  status: StreamingStatus;
  publicUrl?: string;
  eventId?: EventId;
}

/**
 * Used for notifications for all different types of streams (currently recording and livestream).
 */
export const createStreamUpdatedNotification = ({ kind, status, publicUrl, eventId }: NotificationProps): void => {
  notifications.toast(
    <StreamUpdatedNotification kind={kind} status={status} publicUrl={publicUrl} eventId={eventId} />,
    {
      variant: 'info',
    }
  );
};

const StreamUpdatedNotification = ({ kind, status, publicUrl, eventId }: NotificationProps) => {
  const i18nKey = `${kind}-${status}-message`;
  const inviteCode = useInviteCode();
  const isGuest = inviteCode !== undefined;

  //For invited users when a recording stops we show a link to the meeting details
  if (kind === StreamingKind.Recording && status === StreamingStatus.Inactive && !isGuest) {
    const messageLink = `/dashboard/meetings/${eventId}`;
    return (
      <Trans
        i18nKey={`${i18nKey}-with-link`}
        values={{ messageLink }}
        components={{
          messageContent: <div />,
          messageLink: <Link target="_blank" href={messageLink} />,
        }}
      />
    );
  }

  //For livestream start we show a link to the public url of the stream
  if (kind === StreamingKind.Livestream && status === StreamingStatus.Active) {
    return (
      <Trans
        i18nKey={i18nKey}
        values={{ publicUrl }}
        components={{ publicUrl: <Link target="_blank" href={publicUrl} />, messageContent: <div /> }}
      />
    );
  }

  return <Trans i18nKey={i18nKey} />;
};
