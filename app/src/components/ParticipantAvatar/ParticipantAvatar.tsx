// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Avatar as MuiAvatar, AvatarProps, styled } from '@mui/material';
import { PhoneIcon } from '@opentalk/common';
import React from 'react';

import { avatarBg } from '../../assets/themes/opentalk/palette';
import { useAppSelector } from '../../hooks';
import { selectLibravatarDefaultImage } from '../../store/slices/configSlice';
import { addParameterToLibravatarUrl } from '../../utils/apiUtils';
import { convertStringToColorHex } from '../../utils/colorUtils';
import { getInitials } from '../../utils/stringUtils';

const Avatar = styled(MuiAvatar, {
  shouldForwardProp: (prop) => !['bgColor', 'color'].includes(prop as string),
})<{ color: string; bgColor: string }>(({ color, bgColor }) => ({
  backgroundColor: bgColor,
  border: `2px solid ${color}`,
  color: color,

  '& svg': {
    fill: color,
    width: '40%',
  },
}));

interface ParticipantAvatarProps extends AvatarProps {
  iconAvatar?: boolean;
  specialCharacter?: string;
  isSipParticipant?: boolean;
}

const ParticipantAvatar = ({ isSipParticipant, specialCharacter, ...props }: ParticipantAvatarProps) => {
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

  const defaultImage = useAppSelector(selectLibravatarDefaultImage);
  const src = props.src ? addParameterToLibravatarUrl(props.src, { defaultImage }) : undefined;

  return (
    <Avatar
      translate="no"
      {...props}
      bgColor={avatarBg}
      color={color}
      alt={displayName}
      src={src}
      data-testid="participantAvatar"
    >
      {specialCharacter ? specialCharacter : renderIconOrInitials()}
    </Avatar>
  );
};

export default ParticipantAvatar;
