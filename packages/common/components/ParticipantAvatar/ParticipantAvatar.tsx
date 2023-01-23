// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Avatar as MuiAvatar, AvatarProps, styled, useTheme } from '@mui/material';
import React from 'react';

import { PhoneIcon } from '../../assets/icons';
import { DefaultAvatarImage } from '../../types/common';
import { addParameterToLibravatarUrl, convertStringToColorHex, getInitials } from '../../utils';

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
  defaultImage?: DefaultAvatarImage;
  iconAvatar?: boolean;
  specialCharacter?: string;
  isSipParticipant?: boolean;
}

const ParticipantAvatar = ({
  defaultImage = 'robohash',
  isSipParticipant,
  specialCharacter,
  ...props
}: ParticipantAvatarProps) => {
  const theme = useTheme();
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

  const src = props.src ? addParameterToLibravatarUrl(props.src, { defaultImage }) : undefined;

  return (
    <Avatar
      {...props}
      bgColor={theme.palette.avatar.background}
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
