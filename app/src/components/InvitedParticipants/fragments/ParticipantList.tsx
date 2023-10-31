// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { EventInvite, InviteStatus } from '@opentalk/rest-api-rtk-query';
import { EventId } from '@opentalk/rest-api-rtk-query/src/types';
import { useTranslation } from 'react-i18next';

import { useRevokeEventUserInviteMutation, useRevokeEventUserInviteByEmailMutation } from '../../../api/rest';
import UserRow from './UserRow';

const ParticipantListBox = styled(Stack)({
  alignItems: 'baseline',
  overflow: 'auto',
  maxHeight: '15rem',
  width: '100%',
});

const ParticipantsContainer = styled(Stack)(({ theme }) => ({
  paddingRight: theme.spacing(2),
  width: '100%',
  marginTop: 2,
}));

type ParticipantListProps = {
  status: InviteStatus;
  invitees: Array<EventInvite>;
  showDeleteIcon: boolean;
  removeSelectedUser?: (invitee: EventInvite) => void;
  eventId: EventId;
};

const ParticipantList = ({ eventId, showDeleteIcon, status, invitees, removeSelectedUser }: ParticipantListProps) => {
  const [revokeUserInvite] = useRevokeEventUserInviteMutation();
  const [revokeUserInviteByEmail] = useRevokeEventUserInviteByEmailMutation();
  const { t } = useTranslation();

  const revokeInvitedUser = (user: EventInvite) => {
    if (user.profile.id) {
      revokeUserInvite({ eventId, userId: user.profile.id });
    } else {
      revokeUserInviteByEmail({ eventId, email: user.profile.email });
    }
  };
  return (
    <ParticipantsContainer>
      <Typography mb={1}>{t(`dashboard-meeting-details-page-participant-${status}`)}</Typography>
      <ParticipantListBox>
        {invitees.map((eventInvite) => (
          <UserRow
            key={eventInvite.profile.email}
            showDeleteIcon={showDeleteIcon}
            user={eventInvite}
            onRevokeUserInvite={revokeInvitedUser}
            onRemoveUser={eventInvite.status === InviteStatus.Added ? removeSelectedUser : undefined}
          />
        ))}
      </ParticipantListBox>
    </ParticipantsContainer>
  );
};

export default ParticipantList;
