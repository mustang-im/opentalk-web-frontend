// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ShareScreenOffIcon, ShareScreenOnIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../hooks';
import { selectMediaChangeInProgress, selectShareScreenEnabled } from '../../../store/slices/mediaSlice';
import { selectIsModerator, selectIsPresenter } from '../../../store/slices/userSlice';
import { useMediaContext } from '../../MediaProvider';
import { ToolbarButtonIds } from '../Toolbar';
import ToolbarButton from './ToolbarButton';

const ShareScreenButton = () => {
  const { t } = useTranslation();
  const mediaContext = useMediaContext();
  const isPresenter = useAppSelector(selectIsPresenter);
  const isModerator = useAppSelector(selectIsModerator);
  const screenSharing = useAppSelector(selectShareScreenEnabled);
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);

  const isModeratorOrPresenter = isModerator || isPresenter;

  const getToolTipTitle = () => {
    if (!isModeratorOrPresenter) {
      return t('toolbar-button-screen-share-tooltip-request-moderator-presenter-role');
    }
    if (mediaContext.permissionDenied) {
      return t('device-permission-denied');
    }
    if (screenSharing) {
      return t('toolbar-button-screen-share-turn-off-tooltip-title');
    }
    return t('toolbar-button-screen-share-turn-on-tooltip-title');
  };

  return (
    <ToolbarButton
      onClick={() => {
        if (!isLoadingMedia && isModeratorOrPresenter) {
          // this promise must be awaited, oterwise Safari will not allow screenshare
          mediaContext.trySetScreenShare(!screenSharing).catch(() => {
            console.error('failed to start screenshare');
          });
        }
      }}
      tooltipTitle={getToolTipTitle()}
      active={screenSharing && isModeratorOrPresenter}
      disabled={isLoadingMedia || !isModeratorOrPresenter}
      data-testid="toolbarBlurScreenButton"
      id={ToolbarButtonIds.ShareScreen}
    >
      {screenSharing ? <ShareScreenOnIcon /> : <ShareScreenOffIcon />}
    </ToolbarButton>
  );
};

export default ShareScreenButton;
