// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, Stack, Typography } from '@mui/material';
import { notifications } from '@opentalk/common';
import { SnackbarKey, SnackbarMessage } from '@opentalk/notistack';
import { isEmpty } from 'lodash';
import React, { useState } from 'react';

import Countdown from './Countdown';

export interface Action {
  variant?: 'text' | 'outlined' | 'contained';
  text: string;
  onClick: () => void;
}

interface CountDown {
  duration: number;
  action: () => void;
}

interface IJoinNotificationProps {
  message: SnackbarMessage;
  iconComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  actions: Action[];
  snackbarKey: SnackbarKey;
  countdown?: CountDown;
}

const BreakoutRoomNotification = React.forwardRef<HTMLDivElement, IJoinNotificationProps>(
  ({ message, actions, iconComponent: Icon, countdown, snackbarKey }, ref) => {
    const [alreadyClicked, setAlreadyClicked] = useState(false);
    const handleOnClick = (onClick: () => void) => {
      !alreadyClicked && onClick();
      setAlreadyClicked(true);
      notifications.close(snackbarKey);
    };

    const handleCountdownEnds = () => {
      if (countdown !== undefined) {
        countdown.action();
        notifications.close(snackbarKey);
      }
    };

    const renderActions = () =>
      actions.map(({ text, onClick, variant }, index) => (
        <Button onClick={() => handleOnClick(onClick)} variant={variant} key={index}>
          {text}
        </Button>
      ));

    return (
      <div className="SnackbarItem-variantInfo SnackbarContent-root" ref={ref}>
        <Stack direction="row" spacing={2} className="SnackbarItem-message">
          <Icon width="2rem" height="2rem" />
          <Typography>{message}</Typography>
        </Stack>
        <Stack direction="row" spacing={2} className="SnackbarItem-action">
          {renderActions()}
          {!isEmpty(countdown) && <Countdown duration={countdown?.duration} onCountdownEnds={handleCountdownEnds} />}
        </Stack>
      </div>
    );
  }
);

export default BreakoutRoomNotification;
