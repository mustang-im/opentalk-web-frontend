// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ShareScreenOffIcon, ShareScreenOnIcon } from '@opentalk/common';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import {
  selectMediaChangeInProgress,
  selectPresenterRole,
  selectShareScreenEnabled,
} from '../../../store/slices/mediaSlice';
import { selectIsModerator } from '../../../store/slices/userSlice';
import { useMediaContext } from '../../MediaProvider';
import ToolbarButton from './ToolbarButton';

const BlurScreenButton = () => {
  const { t } = useTranslation();
  const mediaContext = useMediaContext();
  const presenterRole = useAppSelector(selectPresenterRole);
  const isModerator = useAppSelector(selectIsModerator);
  const screenSharing = useAppSelector(selectShareScreenEnabled);
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);

  const grantedPresenterRole = isModerator ? true : presenterRole;

  const tooltipText = !grantedPresenterRole
    ? t('toolbar-button-screen-share-tooltip-request-moderator-presenter-role')
    : mediaContext.permissionDenied
    ? t('device-permission-denied')
    : screenSharing
    ? t('toolbar-button-screen-share-turn-off-tooltip-title')
    : t('toolbar-button-screen-share-turn-on-tooltip-title');

  return (
    <ToolbarButton
      onClick={() => {
        if (!isLoadingMedia && grantedPresenterRole) {
          mediaContext.trySetScreenShare(!screenSharing);
        }
      }}
      tooltipTitle={tooltipText}
      active={screenSharing && grantedPresenterRole}
      disabled={isLoadingMedia || !grantedPresenterRole}
      data-testid="toolbarBlurScreenButton"
    >
      {screenSharing ? <ShareScreenOnIcon /> : <ShareScreenOffIcon />}
    </ToolbarButton>
  );
};

export default BlurScreenButton;
