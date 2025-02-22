// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Avatar as MuiAvatar, AvatarProps, styled } from '@mui/material';

import { PhoneIcon } from '../../assets/icons';
import { LibravatarDefaultImage } from '../../types';
import { convertStringToColorHex } from '../../utils/colorUtils';
import { getInitials } from '../../utils/stringUtils';

const DEFAULT_IMAGE_SIZE = 512;

// Options to modify image size and the default image, if no image is provided.
// See "Picture size" and "Default URL for missing images" section in the documentation https://wiki.libravatar.org/api/
export type LibravatarOptions = {
  size?: number;
  defaultImage?: LibravatarDefaultImage;
};

/**
 * Add options to specify picture size and default image of an avatar
 *
 * @param url     An avatar URL
 * @param options size and default image
 */
export const setLibravatarOptions = (
  url: string | undefined,
  { size = DEFAULT_IMAGE_SIZE, defaultImage = 'robohash' }: LibravatarOptions
) => {
  return url ? `${url}?d=${defaultImage}&s=${size}` : undefined;
};

const Avatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => !['color'].includes(prop as string),
})<{ color: string }>(({ theme, color }) => ({
  backgroundColor: theme.palette.avatar.background,
  border: `2px solid ${color}`,
  color: color,

  '& svg': {
    fill: color,
    width: '40%',
  },
}));

interface ParticipantAvatarProps extends AvatarProps {
  defaultImage?: LibravatarDefaultImage;
  iconAvatar?: boolean;
  specialCharacter?: string;
  isSipParticipant?: boolean;
}

const ParticipantAvatar = ({ src, isSipParticipant, specialCharacter, ...props }: ParticipantAvatarProps) => {
  let displayName: string;
  if (typeof props.children === 'string') {
    displayName = props.children;
  } else {
    displayName = props.alt || '';
  }
  const renderIconOrInitials = () => {
    if (isSipParticipant) {
      return <PhoneIcon data-testid="phoneIcon" />;
    }
    return getInitials(displayName as string, 3);
  };

  const color = convertStringToColorHex(displayName);

  return (
    <Avatar {...props} color={color} alt={displayName} translate="no" src={src} data-testid="participantAvatar">
      {specialCharacter ? specialCharacter : renderIconOrInitials()}
    </Avatar>
  );
};

export default ParticipantAvatar;
