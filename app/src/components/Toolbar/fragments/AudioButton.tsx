// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { useCallback, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { MicOffIcon, MicOnIcon } from '../../../assets/icons';
import { useAppSelector } from '../../../hooks';
import { selectIsUserMicDisabled } from '../../../store/selectors';
import { selectAudioEnabled, selectMediaChangeInProgress } from '../../../store/slices/mediaSlice';
import { useMediaContext } from '../../MediaProvider';
import { ToolbarButtonIds } from '../Toolbar';
import AudioIndicator from './AudioIndicator';
import AudioMenu from './AudioMenu';
import ToolbarButton from './ToolbarButton';

const MicOnStyled = styled(MicOnIcon)({
  zIndex: 1,
});

const AudioButton = ({ isLobby }: { isLobby?: boolean }) => {
  const mediaContext = useMediaContext();
  const audioEnabled = useAppSelector(selectAudioEnabled);
  const hasMicrophoneDisabledInState = useAppSelector(selectIsUserMicDisabled);
  const hasMicrophoneDisabled = !isLobby && hasMicrophoneDisabledInState;
  const isAudioOn = audioEnabled && mediaContext.hasMicrophone;
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const isLoadingMedia = useAppSelector(selectMediaChangeInProgress);
  const controlEnabled = mediaContext.hasMicrophone && !hasMicrophoneDisabled;

  const closeMenu = () => setShowMenu(false);
  const openMenu = () => setShowMenu(true);
  const { t } = useTranslation();

  const switchAudio = useCallback((value: boolean) => mediaContext.trySetAudio(value), [mediaContext]);

  const toggleAudio = useCallback(() => {
    if (!isLoadingMedia) {
      switchAudio(!audioEnabled);
    }
  }, [isLoadingMedia, switchAudio, audioEnabled]);

  const indicator = useMemo(
    () =>
      isAudioOn ? (
        <>
          <AudioIndicator shape="circle" />
          <MicOnStyled data-testid="toolbarAudioButtonOn" />
        </>
      ) : (
        <MicOffIcon data-testid="toolbarAudioButtonOff" />
      ),
    [isAudioOn]
  );

  const tooltipText = () => {
    if (mediaContext.permissionDenied) {
      return t('device-permission-denied');
    }
    if (hasMicrophoneDisabled) {
      return t('toolbar-button-audio-disabled-tooltip');
    }
    if (audioEnabled) {
      return t('toolbar-button-audio-turn-off-tooltip-title');
    }
    return t('toolbar-button-audio-turn-on-tooltip-title');
  };

  const contextTitle = t('toolbar-button-audio-context-title');

  return (
    <div ref={menuRef}>
      <ToolbarButton
        tooltipTitle={tooltipText()}
        onClick={toggleAudio}
        hasContext
        contextDisabled={!mediaContext.hasMicrophone}
        disabled={!controlEnabled || isLoadingMedia}
        openMenu={openMenu}
        active={audioEnabled}
        isLobby={isLobby}
        data-testid="toolbarAudioButton"
        contextTitle={contextTitle}
        contextMenuId="audio-context-menu"
        contextMenuExpanded={showMenu}
        id={ToolbarButtonIds.Audio}
      >
        {indicator}
      </ToolbarButton>
      <AudioMenu open={showMenu} onClose={closeMenu} anchorEl={menuRef.current} />
    </div>
  );
};

export default AudioButton;
