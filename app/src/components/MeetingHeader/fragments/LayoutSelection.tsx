// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  ListItemIcon,
  MenuItem as MuiMenuItem,
  MenuList,
  Popover,
  Stack,
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { FullscreenViewIcon, GridViewIcon, IconButton, ProtocolIcon, SpeakerViewIcon } from '@opentalk/common';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../hooks/useFullscreenContext';
import { selectIsProtocolAvailable } from '../../../store/slices/protocolSlice';
import {
  selectCinemaLayout,
  selectIsCurrentProtocolHighlighted,
  toggledFullScreenMode,
  updatedCinemaLayout,
} from '../../../store/slices/uiSlice';
import { Indicator } from './Indicator';

const ViewPopperContainer = styled(Stack)(({ theme }) => ({
  position: 'relative',
  background: theme.palette.background.video,
  borderRadius: '0.25rem',
  justifyContent: 'center',
  alignItems: 'center',
  '& .MuiPopover-paper': {
    marginTop: '0.3rem',
    background: theme.palette.background.defaultGradient,
  },
  '& .MuiIconButton-root .MuiSvgIcon-root': {
    [theme.breakpoints.down('md')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
}));

const PopoverContainer = styled(MenuList)(({ theme }) => ({
  background: theme.palette.background.video,
}));

const MenuItem = styled(MuiMenuItem, {
  shouldForwardProp: (prop) => prop !== 'hasIndicator',
})<{ hasIndicator?: boolean }>(({ theme, hasIndicator }) => ({
  padding: theme.spacing(1),
  '& .MuiListItemIcon-root .MuiSvgIcon-root': {
    position: 'relative',
    fontSize: theme.typography.pxToRem(16),
    [theme.breakpoints.down('md')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
  '&:after': {
    content: '""',
    display: hasIndicator ? 'block' : 'none',
    width: '0.5rem',
    height: '0.5rem',
    background: theme.palette.primary.main,
    borderRadius: '50%',
    marginLeft: '0.5rem',
  },
}));

const ButtonIndicator = styled(Indicator)({
  position: 'absolute',
  top: '0.1rem',
  right: '0.1rem',
});

const LayoutSelection = () => {
  const dispatch = useAppDispatch();
  const fullscreenHandle = useFullscreenContext();
  const selectedLayout = useAppSelector(selectCinemaLayout);
  const { t } = useTranslation();
  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);
  const isViewPopoverOpen = Boolean(anchorElement);
  const isProtocolAvailable = useAppSelector(selectIsProtocolAvailable);
  const isCurrentProtocolHighlighted = useAppSelector(selectIsCurrentProtocolHighlighted);
  const isProtocolActive = selectedLayout === LayoutOptions.Protocol;

  /**
   * Placeholder condition for all features that has to show indicator.
   */
  const showButtonIndicator = isCurrentProtocolHighlighted;

  const openFullscreenView = useCallback(() => {
    setAnchorElement(null);
    fullscreenHandle.enter();
    dispatch(toggledFullScreenMode());
  }, [fullscreenHandle]);

  const handleSelectedView = (layout: LayoutOptions) => {
    setAnchorElement(null);
    dispatch(updatedCinemaLayout(layout));
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const ViewIcon = useMemo(() => {
    switch (selectedLayout) {
      case LayoutOptions.Grid:
        return <GridViewIcon />;
      case LayoutOptions.Protocol:
        return isMobile ? <ProtocolIcon /> : <Typography noWrap>{t('protocol-hide')}</Typography>;
      case LayoutOptions.Whiteboard:
        return <Typography noWrap>{t('whiteboard-hide')}</Typography>;
      case LayoutOptions.Speaker:
      default:
        return <SpeakerViewIcon />;
    }
  }, [selectedLayout]);

  return (
    <ViewPopperContainer>
      <IconButton
        aria-expanded={isViewPopoverOpen ? 'true' : undefined}
        aria-haspopup="true"
        aria-controls={isViewPopoverOpen ? 'view-popover-menu' : undefined}
        aria-label={t('conference-view-trigger-button')}
        onClick={(event) =>
          [LayoutOptions.Whiteboard].includes(selectedLayout)
            ? handleSelectedView(LayoutOptions.Grid)
            : setAnchorElement(event.currentTarget)
        }
      >
        {ViewIcon}
        {showButtonIndicator && isMobile && <ButtonIndicator />}
      </IconButton>
      <Popover
        open={isViewPopoverOpen}
        anchorEl={anchorElement}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => setAnchorElement(null)}
        disablePortal
      >
        <PopoverContainer id="view-popover-menu" autoFocusItem={isViewPopoverOpen}>
          <MenuItem onClick={() => handleSelectedView(LayoutOptions.Grid)}>
            <ListItemIcon aria-hidden={true}>
              <GridViewIcon />
            </ListItemIcon>
            {t('conference-view-grid')}
          </MenuItem>
          <MenuItem onClick={() => handleSelectedView(LayoutOptions.Speaker)}>
            <ListItemIcon aria-hidden={true}>
              <SpeakerViewIcon />
            </ListItemIcon>
            {t('conference-view-speaker')}
          </MenuItem>
          <MenuItem onClick={openFullscreenView}>
            <ListItemIcon aria-hidden={true}>
              <FullscreenViewIcon />
            </ListItemIcon>
            {t('conference-view-fullscreen')}
          </MenuItem>
          {isMobile && isProtocolAvailable && (
            <MenuItem
              onClick={() => {
                handleSelectedView(
                  selectedLayout === LayoutOptions.Protocol ? LayoutOptions.Grid : LayoutOptions.Protocol
                );
              }}
              hasIndicator={isCurrentProtocolHighlighted}
            >
              <ListItemIcon aria-hidden={true}>
                <ProtocolIcon />
              </ListItemIcon>
              {t(isProtocolActive ? 'protocol-hide' : 'protocol-open')}
            </MenuItem>
          )}
        </PopoverContainer>
      </Popover>
    </ViewPopperContainer>
  );
};

export default LayoutSelection;
