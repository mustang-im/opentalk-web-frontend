// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Grid, IconButton, InputAdornment, Tooltip } from '@mui/material';
import { BackIcon, CopyIcon, notifications } from '@opentalk/common';
import { Event, isEvent, FindUserResponse } from '@opentalk/rest-api-rtk-query';
import { QueryStatus } from '@reduxjs/toolkit/dist/query';
import { merge } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';

import {
  useLazyGetRoomInvitesQuery,
  useCreateEventInviteMutation,
  useDeleteEventMutation,
  useRevokeEventUserInviteMutation,
  useGetMeTariffQuery,
  useLazyGetMeQuery,
  useCreateRoomInviteMutation,
} from '../../api/rest';
import TextField from '../../commonComponents/TextField';
import SelectParticipants from '../../components/SelectParticipants';
import { useAppSelector } from '../../hooks';
import { selectBaseUrl, selectFeatures } from '../../store/slices/configSlice';
import { composeInviteUrl } from '../../utils/apiUtils';
import { EmailUser } from '../SelectParticipants/SelectParticipants';

interface InviteToMeetingProps {
  existingEvent: Event;
  directMeeting?: boolean;
  invitationsSent?: () => void;
  onBackButtonClick?: () => void;
  showOnlyLinkFields?: boolean;
  refreshEvent?: () => void;
}

const InviteToMeeting = ({
  existingEvent,
  onBackButtonClick,
  directMeeting,
  invitationsSent,
  showOnlyLinkFields,
  refreshEvent,
}: InviteToMeetingProps) => {
  const [creatEventInvitation, { isLoading: sendingInvitation, isSuccess, status, isError }] =
    useCreateEventInviteMutation();

  const [deleteEvent] = useDeleteEventMutation();
  const features = useAppSelector(selectFeatures);
  const baseUrl = useAppSelector(selectBaseUrl);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [selectedUsers, setSelectedUser] = useState<Array<FindUserResponse | EmailUser>>([]);
  const [isRoomLinkCopied, setRoomLinkCopied] = useState(false);
  const [isSipLinkCopied, setSipLinkCopied] = useState(false);
  const [isGuestLinkCopied, setGuestLinkCopied] = useState(false);
  const [isRoomPasswordCopied, setIsRoomPasswordCopied] = useState(false);
  //TODO: There has to be a better way of keeping track of what should be highlighted as copied, maybe we need a follow up issue for it - https://git.opentalk.dev/opentalk/frontend/web/web-app/-/issues/1367
  const [isSharedFolderUrlCopied, setIsSharedFolderUrlCopied] = useState(false);
  const [isSharedFolderPasswordCopied, setIsSharedFolderPasswordCopied] = useState(false);

  const { data: tariff } = useGetMeTariffQuery();
  const userTariffLimit = tariff?.quotas.roomParticipantLimit;

  const roomUrl = useMemo(() => new URL(`/room/${existingEvent?.room.id}`, baseUrl), [baseUrl, existingEvent]);

  const roomSharedFolderUrl = existingEvent.sharedFolder?.readWrite?.url;
  const roomSharedFolderPassword = existingEvent.sharedFolder?.readWrite?.password;

  const callInDetails = existingEvent.room.callIn;

  const [getRoomInvites] = useLazyGetRoomInvitesQuery();

  const [createRoomInvite] = useCreateRoomInviteMutation();
  const [getMe] = useLazyGetMeQuery();

  const [permanentGuestLink, setPermanentGuestLink] = useState<URL>();

  /*    
        Fetch permanent guest link for the meeting.
        If there is no permanent guest link -> we assume, that the meeting has just been created.
        Therefore send request to the controller to create a permanent link.
        As an additional guard, we check, that we are the creator of the meeting.
        In the future, all the moderators of the meeting shall be able to create guest links. Similarly as it is done in InviteGuestDialog

        DISCLAIMER: because of the way tags are setup even with this structure you will see a get -> post -> get request on creating a meeting.
                    It should not impact since we use only the data from the post request and the get request happens in the background.
                    If it is a problem feel free to look into the tag setup for 'packages/rtk-rest-api/src/endpoints/rooms.ts' createRoomInvite and getRoomInvites.
  */
  const fetchPermanentGuestLink = useCallback(async () => {
    const invites = await getRoomInvites({ roomId: existingEvent.room.id }).unwrap();
    if (invites) {
      const foundInvite = invites.find((invite) => invite.active && invite.expiration === null);
      if (foundInvite) {
        return composeInviteUrl(baseUrl, foundInvite.inviteCode);
      }
    }

    const userMe = await getMe().unwrap();
    if (userMe.id === existingEvent.createdBy.id) {
      const createdInvite = await createRoomInvite({ id: existingEvent.room.id }).unwrap();
      return composeInviteUrl(baseUrl, createdInvite.inviteCode);
    }
  }, []);

  useEffect(() => {
    fetchPermanentGuestLink().then((url) => {
      if (url) {
        setPermanentGuestLink(url);
      } else {
        notifications.error(t('global-copy-permanent-guest-link-error'));
      }
    });
  }, []);

  const [revokeInvite] = useRevokeEventUserInviteMutation();

  const sendInvitations = useCallback(async () => {
    const allInvites = selectedUsers.map((selectedUser) => {
      const invite = 'id' in selectedUser ? { invitee: selectedUser.id } : { email: selectedUser.email };
      return creatEventInvitation(merge({ eventId: existingEvent.id }, invite));
    });

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

  const sipLink = callInDetails ? `${callInDetails.tel},,${callInDetails.id},,${callInDetails.password}` : undefined;

  const roomPassword = existingEvent?.room?.password?.trim() || undefined;

  //TODO: Part of line 67 TODO: Also feels very bad to have all of these hardcoded functions to which you add state changes
  const copyRoomLinkToClipboard = useCallback(() => {
    navigator.clipboard.writeText(roomUrl.toString()).then(() => {
      setRoomLinkCopied(true);
      setSipLinkCopied(false);
      setGuestLinkCopied(false);
      setIsRoomPasswordCopied(false);
      setIsSharedFolderUrlCopied(false);
      setIsSharedFolderPasswordCopied(false);
      notifications.success(t('global-copy-link-success'));
    });
  }, [t, roomUrl]);

  const copySipLinkToClipboard = useCallback(() => {
    if (sipLink !== undefined) {
      navigator.clipboard.writeText(sipLink).then(() => {
        setSipLinkCopied(true);
        setRoomLinkCopied(false);
        setGuestLinkCopied(false);
        setIsRoomPasswordCopied(false);
        setIsSharedFolderUrlCopied(false);
        setIsSharedFolderPasswordCopied(false);
        notifications.success(t('global-dial-in-link-success'));
      });
    }
  }, [t, sipLink]);

  const copyGuestLinkToClipboard = useCallback(() => {
    if (permanentGuestLink !== undefined) {
      navigator.clipboard.writeText(permanentGuestLink.toString()).then(() => {
        setGuestLinkCopied(true);
        setRoomLinkCopied(false);
        setSipLinkCopied(false);
        setIsRoomPasswordCopied(false);
        setIsSharedFolderUrlCopied(false);
        setIsSharedFolderPasswordCopied(false);
        notifications.success(t('global-copy-link-success'));
      });
    }
  }, [t, permanentGuestLink]);

  const copyRoomPasswordToClipboard = useCallback(() => {
    if (roomPassword !== undefined) {
      navigator.clipboard.writeText(roomPassword.toString()).then(() => {
        setIsRoomPasswordCopied(true);
        setIsSharedFolderUrlCopied(false);
        setIsSharedFolderPasswordCopied(false);
        setGuestLinkCopied(false);
        setRoomLinkCopied(false);
        setSipLinkCopied(false);
        notifications.success(t('global-password-link-success'));
      });
    }
  }, [t, roomPassword]);

  const copyRoomSharedFolderUrlToClipboard = useCallback(() => {
    if (roomSharedFolderUrl) {
      navigator.clipboard.writeText(roomSharedFolderUrl.toString()).then(() => {
        setIsSharedFolderUrlCopied(true);
        setIsSharedFolderPasswordCopied(false);
        setRoomLinkCopied(false);
        setSipLinkCopied(false);
        setGuestLinkCopied(false);
        setIsRoomPasswordCopied(false);
        notifications.success(t('global-copy-link-success'));
      });
    }
  }, [t, roomSharedFolderUrl]);

  const copyRoomSharedFolderPasswordToClipboard = useCallback(() => {
    if (roomSharedFolderPassword) {
      navigator.clipboard.writeText(roomSharedFolderPassword.toString()).then(() => {
        setIsSharedFolderPasswordCopied(true);
        setIsSharedFolderUrlCopied(false);
        setIsRoomPasswordCopied(false);
        setGuestLinkCopied(false);
        setRoomLinkCopied(false);
        setSipLinkCopied(false);
        notifications.success(t('global-copy-link-success'));
      });
    }
  }, [t, roomSharedFolderPassword]);

  const handleCancelMeetingPress = () => {
    if (directMeeting && isEvent(existingEvent)) {
      deleteEvent(existingEvent.id);
    }
    navigate('/dashboard/');
  };

  return (
    <Grid container justifyContent={'space-between'} flexDirection={'column'} spacing={2}>
      <Grid container item spacing={3} direction={'row'}>
        <Grid item xs={12} sm={6}>
          <Tooltip title={t('dashboard-direct-meeting-invitation-link-tooltip') || ''}>
            <TextField
              label={t('dashboard-direct-meeting-invitation-link-field-label')}
              disabled
              checked={isRoomLinkCopied || undefined}
              value={roomUrl.toString()}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t('dashboard-direct-meeting-copy-link-aria-label')}
                    onClick={copyRoomLinkToClipboard}
                    onMouseDown={copyRoomLinkToClipboard}
                    edge="end"
                  >
                    <CopyIcon />
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </Tooltip>
        </Grid>
        {callInDetails && sipLink && (
          <Grid item xs={12} sm={6}>
            <TextField
              label={t('dashboard-direct-meeting-invitation-sip-field-label')}
              disabled
              checked={isSipLinkCopied || undefined}
              value={sipLink || '-'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={t('dashboard-direct-meeting-copy-sip-aria-label')}
                    onClick={copySipLinkToClipboard}
                    onMouseDown={copySipLinkToClipboard}
                    edge="end"
                    href={`tel:${sipLink}`}
                    disabled={sipLink === undefined}
                  >
                    <CopyIcon />
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </Grid>
        )}
        <Grid item xs={12} sm={6}>
          <Tooltip title={t('dashboard-direct-meeting-invitation-guest-link-tooltip') || ''}>
            <TextField
              label={t('dashboard-direct-meeting-invitation-guest-link-field-label')}
              disabled
              checked={isGuestLinkCopied || undefined}
              value={permanentGuestLink || '-'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={'dashboard-direct-meeting-copy-guest-link-aria-label'}
                    onClick={copyGuestLinkToClipboard}
                    onMouseDown={copyGuestLinkToClipboard}
                    edge="end"
                    disabled={permanentGuestLink === undefined}
                  >
                    <CopyIcon />
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Tooltip title={t('dashboard-direct-meeting-invitation-password-tooltip') || ''}>
            <TextField
              label={t('global-password')}
              disabled
              checked={isRoomPasswordCopied || undefined}
              value={roomPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label={'dashboard-direct-meeting-copy-password-aria-label'}
                    onClick={copyRoomPasswordToClipboard}
                    onMouseDown={copyRoomPasswordToClipboard}
                    edge="end"
                    disabled={roomPassword === undefined}
                  >
                    <CopyIcon />
                  </IconButton>
                </InputAdornment>
              }
              fullWidth
            />
          </Tooltip>
        </Grid>
        {features.sharedFolder && roomSharedFolderUrl && (
          <>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('dashboard-meeting-shared-folder-label')}
                disabled
                checked={isSharedFolderUrlCopied || undefined}
                value={roomSharedFolderUrl ? roomSharedFolderUrl.toString() : '-'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={t('dashboard-direct-meeting-copy-link-aria-label')}
                      onClick={copyRoomSharedFolderUrlToClipboard}
                      onMouseDown={copyRoomSharedFolderUrlToClipboard}
                      edge="end"
                      disabled={roomSharedFolderUrl === undefined}
                    >
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label={t('dashboard-meeting-shared-folder-password-label')}
                disabled
                checked={isSharedFolderPasswordCopied || undefined}
                value={roomSharedFolderPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={'dashboard-meeting-shared-folder-password-label'}
                      onClick={copyRoomSharedFolderPasswordToClipboard}
                      onMouseDown={copyRoomSharedFolderPasswordToClipboard}
                      edge="end"
                      disabled={roomSharedFolderPassword === undefined}
                    >
                      <CopyIcon />
                    </IconButton>
                  </InputAdornment>
                }
                fullWidth
              />
            </Grid>
          </>
        )}
        {!showOnlyLinkFields && features.userSearch && (
          <Grid item xs={12}>
            {features.userSearch && (
              <SelectParticipants
                label={
                  userTariffLimit
                    ? t('dashboard-direct-meeting-label-select-participants', { maxParticipants: userTariffLimit })
                    : t('dashboard-direct-meeting-label-select-participants-fallback')
                }
                placeholder={t('dashboard-select-participants-textfield-placeholder')}
                onChange={(selected) => setSelectedUser(selected)}
                invitees={existingEvent?.invitees}
                resetSelected={isSuccess && status === QueryStatus.fulfilled}
                onRevokeUserInvite={(invitee) => {
                  revokeInvite({ eventId: existingEvent.id, userId: invitee.id })
                    .then(() => {
                      if (typeof refreshEvent === 'function') {
                        refreshEvent();
                      }
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }}
              />
            )}
          </Grid>
        )}
      </Grid>
      {!showOnlyLinkFields && (
        <Grid container item spacing={2} justifyContent={{ xs: 'center', sm: 'space-between' }}>
          <Grid item xs={12} sm={'auto'}>
            {onBackButtonClick && (
              <Button variant={'text'} color={'secondary'} startIcon={<BackIcon />} onClick={onBackButtonClick}>
                {t('dashboard-meeting-to-step', { step: 1 })}
              </Button>
            )}
          </Grid>
          <Grid container item xs={12} sm={'auto'} spacing={3} flexDirection={{ xs: 'column-reverse', sm: 'row' }}>
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
