// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { notificationAction } from '@opentalk/common';

import { getNotificationContent } from '../../components/Notification5MinutesBeforeEnd';

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;

export const notifyBeforeEndConference = (closeAt: string) => {
  const closesAt = new Date(closeAt);
  const leftTime = closesAt.getTime() - Date.now();
  const minutesLeft = Math.floor(leftTime / MINUTES);

  let isOpenNotification = false;

  // this times are the 5 minutes times before end the conference, and filtered
  const timesLeft = Array(5)
    .fill(0)
    .map((_, index) => leftTime - MINUTES * (index + 1))
    .filter((time) => time > 0);

  const setIsOpenNotification = (state: boolean) => {
    isOpenNotification = state;
  };

  const handleNotification = (minute: number) => {
    if (!isOpenNotification) {
      setIsOpenNotification(true);
      notificationAction({
        msg: '',
        content: getNotificationContent(setIsOpenNotification, minute, timesLeft),
        persist: true,
      });
    }
  };

  if (minutesLeft < 5) {
    handleNotification(minutesLeft + 1);
  }

  timesLeft.forEach((time, index) => {
    setTimeout(() => {
      handleNotification(index + 1);
    }, time);
  });
};
