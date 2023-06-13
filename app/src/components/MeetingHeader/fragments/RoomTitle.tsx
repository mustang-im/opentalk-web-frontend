// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography, styled, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const ROOM_TITLE_MAX_LENGTH = 25;

const RoomTitleTypograhy = styled(Typography)(({ theme }) => ({
  textTransform: 'inherit',
  padding: theme.spacing(0.5, 1),
  fontSize: theme.typography.pxToRem(14),
}));

const RoomTitle = (props: { title: string | undefined }) => {
  const { t } = useTranslation();
  const title = props.title !== undefined ? props.title : t('fallback-room-title');

  const getLimitedRoomTitle = () => {
    if (title && title.length > ROOM_TITLE_MAX_LENGTH) {
      return title.slice(0, ROOM_TITLE_MAX_LENGTH) + '...';
    }
    return title;
  };

  return (
    <Tooltip translate="no" title={title} describeChild>
      <RoomTitleTypograhy translate="no">{getLimitedRoomTitle()}</RoomTitleTypograhy>
    </Tooltip>
  );
};

export default RoomTitle;
