// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid } from '@mui/material';
import { EventInvite, InviteStatus, EventId } from '@opentalk/rest-api-rtk-query';
import { sortBy } from 'lodash';

import { useGetEventInvitesQuery } from '../../api/rest';
import { isRegisteredUser } from '../../utils/typeGuardUtils';
import { ParticipantOption } from '../SelectParticipants';
import ParticipantList from './fragments/ParticipantList';

type InvitedParticipantsProps = {
  isUpdatable: boolean;
  selectedUsers?: Array<ParticipantOption>;
  removeSelectedUser?: (invitee: EventInvite) => void;
  eventId: EventId;
};

// //Defines statuses that will be displayed
type DisplayedInviteStatuses = Extract<
  InviteStatus,
  InviteStatus.Pending | InviteStatus.Accepted | InviteStatus.Declined
>;
type InviteeMap = { [key in DisplayedInviteStatuses]: Array<EventInvite> };

const inviteeSorter = (user: EventInvite) =>
  isRegisteredUser(user.profile) ? user.profile.displayName.toUpperCase() : user.profile.email.toUpperCase();

const InvitedParticipants = ({
  isUpdatable,
  removeSelectedUser,
  selectedUsers = [],
  eventId,
}: InvitedParticipantsProps) => {
  const { data: invitees = [] } = useGetEventInvitesQuery({ eventId }, { refetchOnMountOrArgChange: true });

  const inviteeMap: InviteeMap = invitees.reduce(
    (acc: InviteeMap, event) => {
      if (event.status in acc) {
        acc[event.status as DisplayedInviteStatuses].push(event);
      }

      return acc;
    },
    {
      [InviteStatus.Pending]: [],
      [InviteStatus.Accepted]: [],
      [InviteStatus.Declined]: [],
    }
  );

  const mapSelectUserToEventInvite = () => {
    return selectedUsers.map(selectedUserToInvitee);
  };

  const selectedUserToInvitee = (user: ParticipantOption) => {
    if ('kind' in user) {
      return {
        status: InviteStatus.Added,
        profile: {
          ...user,
        },
      } as EventInvite;
    }

    return {
      status: InviteStatus.Added,
      profile: {
        ...user,
        email: user.email,
      },
    } as EventInvite;
  };

  const mergedEventInvites = sortBy(inviteeMap[InviteStatus.Pending].concat(mapSelectUserToEventInvite()), [
    inviteeSorter,
  ]);

  return (
    <Grid container spacing={2} data-testid="InvitedParticipants">
      {/* Type assertion, since Object.keys assumes that key is of type string */}
      {(Object.keys(inviteeMap) as Array<keyof typeof inviteeMap>).map((inviteStatus) => (
        <ParticipantList
          key={`${inviteStatus}-invitees`}
          eventId={eventId}
          isUpdatable={isUpdatable}
          status={inviteStatus}
          removeSelectedUser={inviteStatus !== InviteStatus.Declined ? removeSelectedUser : undefined}
          invitees={
            inviteStatus === InviteStatus.Pending
              ? mergedEventInvites
              : sortBy(inviteeMap[inviteStatus], [inviteeSorter])
          }
        />
      ))}
    </Grid>
  );
};

export default InvitedParticipants;
