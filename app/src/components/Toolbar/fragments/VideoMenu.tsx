// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Divider,
  FormControlLabel as MuiFormControlLabel,
  ListItem,
  Slider,
  styled,
  Switch,
  ThemeProvider,
  Typography,
  Avatar,
  Stack,
  MenuItem as MuiMenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CameraOnIcon,
  ErrorIcon,
  SettingsIcon,
  WarningIcon,
  CloseIcon,
  VideoSetting,
  notifications,
} from '@opentalk/common';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { createOpenTalkTheme } from '../../../assets/themes/opentalk';
import { useAppSelector, useAppDispatch } from '../../../hooks';
import browser from '../../../modules/BrowserSupport';
import { DeviceId } from '../../../modules/Media/MediaUtils';
import { useFullscreenContext } from '../../../provider/FullscreenProvider';
import { selectVideoBackgrounds } from '../../../store/slices/configSlice';
import { selectQualityCap, selectVideoDeviceId, selectVideoBackgroundEffects } from '../../../store/slices/mediaSlice';
import { mirroredVideoSet, selectMirroredVideoEnabled } from '../../../store/slices/uiSlice';
import { useMediaContext } from '../../MediaProvider';
import DeviceList from './DeviceList';
import { MenuTitle, ToolbarMenu, ToolbarMenuProps } from './ToolbarMenuUtils';

const SliderContainer = styled(ListItem)(({ theme }) => ({
  background: theme.palette.secondary.lightest,
  borderRadius: theme.borderRadius.medium,
  margin: theme.spacing(0, 2),
  width: 'auto',
}));

const MenuItem = styled(MuiMenuItem)({
  '&.MuiMenuItem-root:hover': {
    backgroundColor: 'transparent',
  },
});

const FormControlLabel = styled(MuiFormControlLabel)({
  flex: 1,
  margin: 0,
  justifyContent: 'space-between',
});

const VideoBackgroundImage = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active, theme }) => ({
  aspectRatio: '16/9',
  height: '3.5rem',
  width: 'auto',
  cursor: 'pointer',
  borderRadius: active ? theme.borderRadius.small : 0,
  outline: ` ${active ? '3px' : 0} solid ${theme.palette.warning.main}`,
}));

const ClearBackground = styled(VideoBackgroundImage)(({ theme }) => ({
  border: `1px solid ${theme.palette.secondary.main}`,
  backgroundColor: theme.palette.secondary.lightest,
  color: theme.palette.secondary.main,
}));

const MultilineTypography = styled(Typography)({
  whiteSpace: 'pre-wrap',
});

const VideoMenu = ({ anchorEl, onClose, open }: ToolbarMenuProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const videoInDevice = useAppSelector(selectVideoDeviceId);
  const qualityCap = useAppSelector(selectQualityCap);
  const backgroundEffects = useAppSelector(selectVideoBackgroundEffects);
  const mirroringEnabled = useAppSelector(selectMirroredVideoEnabled);
  const videoBackgrounds = useAppSelector(selectVideoBackgrounds);

  const fullscreenHandle = useFullscreenContext();

  const mediaContext = useMediaContext();
  const selectedDevice = videoInDevice || mediaContext.defaultVideoDevice;
  const devices = mediaContext.videoDevices;
  const [loadingList, setLoadingList] = useState<boolean>(false);
  const [loadingChange, setLoadingChange] = useState<boolean>(false);

  const isBlurred = backgroundEffects.style === 'blur';

  const isBrowserSafari = browser.isSafari();
  const setBlur = useCallback(
    (enabled: boolean) => {
      if (!loadingChange) {
        setLoadingChange(true);
        mediaContext.trySetBackground({ style: enabled ? 'blur' : 'off' }).finally(() => setLoadingChange(false));
      }
    },
    [mediaContext, loadingChange]
  );

  const setImageBackground = useCallback(
    (imageUrl: string) => {
      if (!loadingChange) {
        setLoadingChange(true);
        mediaContext.trySetBackground({ style: 'image', imageUrl }).finally(() => {
          setLoadingChange(false);
        });
      }
    },
    [mediaContext, loadingChange]
  );

  const toggleMirroring = () => dispatch(mirroredVideoSet(!mirroringEnabled));

  // todo remove this here @s.sydow
  useEffect(() => {
    const shouldFetchDevices =
      open &&
      !mediaContext.permissionDenied &&
      (!mediaContext.hasAllVideoDetails || mediaContext.defaultVideoDevice === undefined);
    if (!loadingList && shouldFetchDevices) {
      setLoadingList(true);
      mediaContext
        .getDeviceDetails({ video: true })
        .catch((e) => notifications.error(`Get video devices failed: ${e}`))
        .finally(() => setLoadingList(false));
    }
  }, [loadingList, setLoadingList, mediaContext, open]);

  const qualityMarks = [
    {
      value: VideoSetting.Off,
      label: t('quality-audio-only'),
    },
    {
      value: VideoSetting.Low,
      id: 'quality-low',
      label: t('quality-low'),
    },
    {
      value: VideoSetting.Medium,
      label: t('quality-medium'),
    },
    {
      value: VideoSetting.High,
      label: t('quality-high'),
    },
  ];

  const handleClick = (deviceId: DeviceId) => {
    if (!loadingChange) {
      setLoadingChange(true);
      mediaContext
        .changeVideoInput(deviceId)
        .then(onClose)
        .finally(() => setLoadingChange(false));
    }
  };

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
        id="video-context-menu"
      >
        <MenuItem>
          <MenuTitle>
            <CameraOnIcon />
            {t('videomenu-choose-input')}
          </MenuTitle>
        </MenuItem>
        {mediaContext.permissionDenied && (
          <MenuItem>
            <ListItemIcon>
              <ErrorIcon />
            </ListItemIcon>

            <MultilineTypography variant="body2">{t('device-permission-denied')}</MultilineTypography>
          </MenuItem>
        )}

        {devices === undefined || !mediaContext.hasAllVideoDetails ? (
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
        <Divider sx={{ mb: 0 }} />

        <MenuItem>
          <MenuTitle>
            <SettingsIcon />
            {t('videomenu-settings')}
          </MenuTitle>
        </MenuItem>
        <Typography fontWeight={'normal'} id="quality-slider" sx={{ pt: 0, pb: 2, px: 2 }}>
          {t('quality-cap-setting')}
        </Typography>
        <SliderContainer sx={{ px: 5 }}>
          <Slider
            value={qualityCap}
            onChangeCommitted={(ev, value) => mediaContext.setMaxQuality(value as VideoSetting)}
            aria-labelledby="quality-slider"
            valueLabelDisplay="off"
            step={1}
            marks={qualityMarks}
            min={VideoSetting.Off}
            max={VideoSetting.High}
          />
        </SliderContainer>
        <Divider sx={{ mb: 0 }} />

        <MenuItem>
          <MenuTitle>{t('videomenu-background')}</MenuTitle>
        </MenuItem>
        {!isBrowserSafari && (
          <MenuItem>
            <FormControlLabel
              control={<Switch onChange={(_, enabled) => setBlur(enabled)} value={isBlurred} checked={isBlurred} />}
              label={
                <Typography fontWeight={'normal'}>
                  {t(isBlurred ? 'videomenu-blur-on' : 'videomenu-blur-off')}
                </Typography>
              }
              labelPlacement="start"
            />
          </MenuItem>
        )}
        <MenuItem>
          <FormControlLabel
            control={<Switch onChange={toggleMirroring} value={mirroringEnabled} checked={mirroringEnabled} />}
            label={
              <Typography fontWeight={'normal'}>
                {t(mirroringEnabled ? 'videomenu-mirroring-on' : 'videomenu-mirroring-off')}
              </Typography>
            }
            labelPlacement="start"
          />
        </MenuItem>
        <Divider variant="middle" />
        {!isBrowserSafari && videoBackgrounds.length > 0 && (
          <Stack>
            <Typography fontWeight={'normal'} px={2}>
              {t('videomenu-background-images')}
            </Typography>

            <Stack direction="row" spacing={2} p={2} flexWrap="wrap">
              <ClearBackground
                variant="square"
                onClick={() => setBlur(false)}
                active={backgroundEffects.style === 'off'}
              >
                <CloseIcon />
              </ClearBackground>
              {videoBackgrounds.map((image) => {
                const selectedEnabled = backgroundEffects.imageUrl === image.url;
                return (
                  <VideoBackgroundImage
                    src={image.thumb}
                    key={image.url}
                    alt={image.altText}
                    variant="square"
                    onClick={() => (!selectedEnabled ? setImageBackground(image.url) : setBlur(false))}
                    active={selectedEnabled}
                  />
                );
              })}
            </Stack>

            <Divider variant="middle" />
          </Stack>
        )}
      </ToolbarMenu>
    </ThemeProvider>
  );
};

export default VideoMenu;
