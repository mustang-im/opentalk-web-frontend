// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Box, Button, Stack } from '@mui/material';
import React, { CSSProperties, ForwardedRef, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

import { DoneIcon } from '../../../../assets/icons';
import { generateUniquedId } from '../../../../utils';
import { CustomSnackbarContent } from '../CustomSnackbarContent';
import { NotificationHeading } from '../NotificationHeading';

interface TalkingStickMutedNotificationProps {
  style: CSSProperties;
  onUnmute(): void;
  onNext(): void;
}

export const TalkingStickMutedNotification = forwardRef(
  ({ style, onUnmute, onNext }: TalkingStickMutedNotificationProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { t } = useTranslation();
    const messageId = generateUniquedId();

    return (
      <CustomSnackbarContent role="alertdialog" aria-describedby={messageId} ref={ref} style={style}>
        <Stack spacing={1}>
          <NotificationHeading id={messageId} as="h3">
            <DoneIcon aria-hidden="true" />
            {t('talking-stick-speaker-announcement')}
          </NotificationHeading>
          <Box display="flex" gap={1}>
            <Button onClick={onUnmute} variant="contained" color="primary" fullWidth autoFocus={true}>
              {t('talking-stick-notification-unmute')}
            </Button>
            <Button onClick={onNext} variant="contained" color="secondary" fullWidth>
              {t('talking-stick-notification-next-speaker')}
            </Button>
          </Box>
        </Stack>
      </CustomSnackbarContent>
    );
  }
);
