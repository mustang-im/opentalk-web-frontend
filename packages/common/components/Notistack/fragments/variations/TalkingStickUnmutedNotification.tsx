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
  isLastSpeaker: boolean;
  onNext(): void;
}

export const TalkingStickUnmutedNotification = forwardRef(
  ({ style, onNext, isLastSpeaker }: TalkingStickMutedNotificationProps, ref: ForwardedRef<HTMLDivElement>) => {
    const { t } = useTranslation();
    const messageId = generateUniquedId();

    return (
      <CustomSnackbarContent role="alertdialog" aria-describedby={messageId} ref={ref} style={style}>
        <Stack spacing={1}>
          <NotificationHeading id={messageId} as="h3">
            <DoneIcon aria-hidden="true" />
            {t(
              isLastSpeaker
                ? 'talking-stick-unmuted-notification-last-participant'
                : 'talking-stick-unmuted-notification'
            )}
          </NotificationHeading>
          <Box display="flex" justifyContent="flex-end">
            <Button onClick={onNext} variant="contained" color="primary" autoFocus={true}>
              {t('talking-stick-notification-next-speaker')}
            </Button>
          </Box>
        </Stack>
      </CustomSnackbarContent>
    );
  }
);
