// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Chip, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { CloseIcon, ParticipantAvatar, convertStringToColorHex, setLibravatarOptions } from '@opentalk/common';
import { EventInvite, InviteStatus } from '@opentalk/rest-api-rtk-query';

import { useAppSelector } from '../../../hooks';
import { selectLibravatarDefaultImage } from '../../../store/slices/configSlice';

const StyledChip = styled(Chip)({
  marginRight: 0,
  borderColor: 'transparent',
  backgroundColor: 'transparent',
  '& .MuiSvgIcon-root': {
    fontSize: '0.7rem',
  },
  minHeight: '3rem',
});

type UserRowProps = {
  user: EventInvite;
  onRevokeUserInvite?: (invitee: EventInvite) => void;
  onRemoveUser?: (invitee: EventInvite) => void;
  showDeleteIcon: boolean;
};

const UserRow = ({ showDeleteIcon, user, onRevokeUserInvite, onRemoveUser }: UserRowProps) => {
  const color = convertStringToColorHex('');
  const avatarDefaultImage = useAppSelector(selectLibravatarDefaultImage);
  const setAvatarSrc = (url: string | undefined) => {
    return setLibravatarOptions(url, { defaultImage: avatarDefaultImage });
  };

  const onDelete = () => {
    if (onRemoveUser) {
      return onRemoveUser(user);
    }
    if (onRevokeUserInvite) {
      return onRevokeUserInvite(user);
    }
  };

  return (
    <StyledChip
      key={user.profile.email}
      label={
        <Stack>
          {(user.profile.firstname || user.profile.lastname) && (
            <Typography noWrap>
              {user.profile.firstname} {user.profile.lastname}
            </Typography>
          )}
          <Typography variant="caption" noWrap>
            {user.profile.email}
          </Typography>
        </Stack>
      }
      avatar={
        user.status !== InviteStatus.Added || user.profile.displayName ? (
          <ParticipantAvatar src={setAvatarSrc(user.profile.avatarUrl)} />
        ) : (
          <ParticipantAvatar style={{ fontSize: '1.2rem', color: color }} specialCharacter="@" />
        )
      }
      deleteIcon={<CloseIcon data-testid={'InvitedParticipants-deleteButton'} />}
      onDelete={showDeleteIcon ? onDelete : undefined}
    />
  );
};

export default UserRow;
