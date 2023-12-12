// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid } from '@mui/material';
import { BackIcon, notifications } from '@opentalk/common';
import { Event, EventInvite, isEvent, UserRole } from '@opentalk/rest-api-rtk-query';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { merge } from 'lodash';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import { useCreateEventInviteMutation, useDeleteEventMutation, useGetMeTariffQuery } from '../../api/rest';
import SelectParticipants from '../../components/SelectParticipants';
import { useAppSelector } from '../../hooks';
import { selectFeatures } from '../../store/slices/configSlice';
import InvitedParticipants from '../InvitedParticipants';
import { ParticipantOption } from '../SelectParticipants';
import MeetingLinksAndPasswords from './fragments/MeetingLinksAndPasswords';

interface InviteToMeetingProps {
  isUpdatable: boolean;
  existingEvent: Event;
  directMeeting?: boolean;
  invitationsSent?: () => void;
  onBackButtonClick?: () => void;
  showOnlyLinkFields?: boolean;
}

const InviteToMeeting = ({
  isUpdatable,
  existingEvent,
  onBackButtonClick,
  directMeeting,
  invitationsSent,
  showOnlyLinkFields,
}: InviteToMeetingProps) => {
  const [creatEventInvitation, { isLoading: sendingInvitation, isSuccess, status, isError }] =
    useCreateEventInviteMutation();

  const [deleteEvent] = useDeleteEventMutation();
  const features = useAppSelector(selectFeatures);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedUsers, setSelectedUser] = useState<Array<ParticipantOption>>([]);

  const { data: tariff } = useGetMeTariffQuery();
  const userTariffLimit = tariff?.quotas.roomParticipantLimit;

  const sendInvitations = useCallback(async () => {
    const allInvites = selectedUsers.map((selectedUser) => {
      const invite =
        'id' in selectedUser ? { invitee: selectedUser.id, role: UserRole.USER } : { email: selectedUser.email };
      return creatEventInvitation(merge({ eventId: existingEvent.id }, invite));
    });

    setSelectedUser(() => []);

    await Promise.all(allInvites)
      .then(() => {
        invitationsSent && invitationsSent();
        if (!isError) {
          notifications.success(t('dashboard-direct-meeting-invitations-successful'));
        } else {
          notifications.error(t('dashboard-direct-meeting-invitations-error'));
        }
      })
      .catch(() => {
        notifications.error(t('dashboard-direct-meeting-invitations-error'));
      });
  }, [t, selectedUsers, existingEvent, creatEventInvitation, invitationsSent, isError]);

  const handleCancelMeetingPress = () => {
    if (directMeeting && isEvent(existingEvent)) {
      deleteEvent(existingEvent.id);
    }
    navigate('/dashboard/');
  };

  const addSelectedUser = (selected: ParticipantOption[]) => {
    if (selected.length > 0) {
      setSelectedUser((selectedUsers) => [...selectedUsers, selected[0]]);
    }
  };

  const removeSelectedUser = (removedUser: EventInvite) => {
    setSelectedUser((selectedUsers) => selectedUsers.filter((user) => user.email !== removedUser.profile.email));
  };

  const selectParticipantsLabel = userTariffLimit
    ? t('dashboard-direct-meeting-label-select-participants', { maxParticipants: userTariffLimit })
    : t('dashboard-direct-meeting-label-select-participants-fallback');

  return (
    <Grid container justifyContent={'space-between'} flexDirection={'column'} spacing={2}>
      <Grid container item spacing={3} direction={'row'}>
        <MeetingLinksAndPasswords event={existingEvent} />
        {!showOnlyLinkFields && features.userSearch && (
          <>
            <Grid item xs={12} sm={6}>
              {features.userSearch && (
                <SelectParticipants
                  label={selectParticipantsLabel}
                  placeholder={t('dashboard-select-participants-textfield-placeholder')}
                  onChange={addSelectedUser}
                  selectedUsers={selectedUsers}
                  invitees={existingEvent?.invitees}
                  resetSelected={isSuccess && status === QueryStatus.fulfilled}
                  eventId={existingEvent.id}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12}>
              <InvitedParticipants
                eventId={existingEvent.id}
                selectedUsers={selectedUsers}
                isUpdatable={isUpdatable}
                removeSelectedUser={removeSelectedUser}
              />
            </Grid>
          </>
        )}
      </Grid>
      {!showOnlyLinkFields && (
        <Grid container item spacing={2} justifyContent={{ xs: 'center', sm: 'space-between' }}>
          <Grid item xs={12} sm="auto">
            {onBackButtonClick && (
              <Button variant="text" color="secondary" startIcon={<BackIcon />} onClick={onBackButtonClick}>
                {t('dashboard-meeting-to-step', { step: 1 })}
              </Button>
            )}
          </Grid>
          <Grid container item xs={12} sm="auto" spacing={3} flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
            <Grid item>
              <Button fullWidth color="secondary" variant="outlined" onClick={handleCancelMeetingPress}>
                {t('global-cancel')}
              </Button>
            </Grid>
            <Grid item>
              <Button
                component={Link}
                to={`/room/${existingEvent?.room.id}`}
                color={'secondary'}
                fullWidth
                target="_blank"
              >
                {t('dashboard-direct-meeting-button-open-room')}
              </Button>
            </Grid>
            {features.userSearch && (
              <Grid item>
                <Button onClick={sendInvitations} disabled={!selectedUsers.length || sendingInvitation} fullWidth>
                  {t('dashboard-direct-meeting-button-send-invitations')}
                </Button>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default InviteToMeeting;
