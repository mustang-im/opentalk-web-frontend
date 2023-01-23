// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ThemeProvider, Typography, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { MicOnIcon } from '@opentalk/common';
import { ErrorIcon, WarningIcon } from '@opentalk/common';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppSelector } from '../../../hooks';
import { DeviceId } from '../../../modules/Media/MediaUtils';
import { useFullscreenContext } from '../../../provider/FullscreenProvider';
import { selectAudioDeviceId } from '../../../store/slices/mediaSlice';
import notifications from '../../../utils/snackBarUtils';
import { useMediaContext } from '../../MediaProvider';
import DeviceList from './DeviceList';
import { MenuTitle, ToolbarMenu, ToolbarMenuProps } from './ToolbarMenuUtils';

const AudioMenu = ({ anchorEl, onClose, open }: ToolbarMenuProps) => {
  const { t } = useTranslation();
  const audioIn = useAppSelector(selectAudioDeviceId);
  const mediaContext = useMediaContext();
  const selectedDevice = audioIn || mediaContext.defaultAudioDevice;
  const devices = mediaContext.audioInDevices;
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingChange, setLoadingChange] = useState<boolean>(false);

  const fullscreenHandle = useFullscreenContext();

  // todo remove this here @s.sydow
  useEffect(() => {
    const shouldFetchDevices =
      open &&
      !mediaContext.permissionDenied &&
      (!mediaContext.hasAllAudioDetails || mediaContext.defaultAudioDevice === undefined);
    if (!loadingList && shouldFetchDevices) {
      setLoadingList(true);
      mediaContext
        .getDeviceDetails({ audio: true })
        .catch((e) => notifications.error(`Get audio devices failed: ${e}`))
        .finally(() => setLoadingList(false));
    }
  }, [loadingList, setLoadingList, mediaContext, open]);

  const handleClick = (deviceId: DeviceId) => {
    if (!loadingChange) {
      setLoadingChange(true);
      mediaContext
        .changeAudioInput(deviceId)
        .then(onClose)
        .finally(() => setLoadingChange(false));
    }
  };

  // Todo show spinner while we fetch the permissions?
  return (
    <ThemeProvider theme={createOpenTalkTheme()}>
      <ToolbarMenu
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: -4,
          horizontal: 'center',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        disablePortal={fullscreenHandle.active}
        data-testid="toolbarAudioMenu"
      >
        <MenuItem>
          <MenuTitle fontWeight={'bold'}>
            <MicOnIcon />
            {t('audiomenu-choose-input')}
          </MenuTitle>
        </MenuItem>
        {mediaContext.permissionDenied && (
          <MenuItem>
            <ListItemIcon>
              <ErrorIcon />
            </ListItemIcon>

            <Typography variant="body2" noWrap>
              {t('device-permission-denied')}
            </Typography>
          </MenuItem>
        )}
        {devices === undefined || !mediaContext.hasAllAudioDetails ? (
          <MenuItem>
            <ListItemIcon>
              <WarningIcon />
            </ListItemIcon>
            <ListItemText>{t('devicemenu-wait-for-permission')}</ListItemText>
          </MenuItem>
        ) : (
          <DeviceList
            devices={devices}
            selectedDevice={selectedDevice}
            onClick={(deviceId: DeviceId) => handleClick(deviceId)}
          />
        )}
      </ToolbarMenu>
    </ThemeProvider>
  );
};
export default AudioMenu;
