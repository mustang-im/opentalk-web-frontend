// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { ListItemIcon, MenuItem as MuiMenuItem, MenuList, Popover, Stack, Typography, styled } from '@mui/material';
import { FullscreenViewIcon, GridViewIcon, IconButton, SpeakerViewIcon } from '@opentalk/common';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LayoutOptions from '../../../enums/LayoutOptions';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { useFullscreenContext } from '../../../provider/FullscreenProvider';
import { selectCinemaLayout, toggledFullScreenMode, updatedCinemaLayout } from '../../../store/slices/uiSlice';

const ViewPopperContainer = styled(Stack)(({ theme }) => ({
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

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  padding: theme.spacing(1),
  '& .MuiListItemIcon-root .MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(16),
    [theme.breakpoints.down('md')]: {
      fontSize: theme.typography.pxToRem(20),
    },
  },
}));

const LayoutSelection = () => {
  const dispatch = useAppDispatch();
  const fullscreenHandle = useFullscreenContext();
  const selectedLayout = useAppSelector(selectCinemaLayout);
  const { t } = useTranslation();
  const [viewEl, setViewEl] = useState<HTMLElement | null>(null);
  const isViewPopoverOpen = Boolean(viewEl);

  const openFullscreenView = useCallback(async () => {
    toggleLayoutSelectionPopover();
    await fullscreenHandle.enter();
    dispatch(toggledFullScreenMode());
  }, [fullscreenHandle]);

  const toggleLayoutSelectionPopover = (event?: React.MouseEvent<HTMLElement>) => {
    setViewEl(event ? event.currentTarget : null);
  };

  const handleSelectedView = (layout: LayoutOptions) => {
    toggleLayoutSelectionPopover();
    dispatch(updatedCinemaLayout(layout));
  };

  const ViewIcon = useMemo(() => {
    switch (selectedLayout) {
      case LayoutOptions.Grid:
        return <GridViewIcon />;
      case LayoutOptions.Protocol:
        return <Typography noWrap>{t('protocol-hide')}</Typography>;
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
          [LayoutOptions.Protocol, LayoutOptions.Whiteboard].includes(selectedLayout)
            ? handleSelectedView(LayoutOptions.Grid)
            : toggleLayoutSelectionPopover(event)
        }
      >
        {ViewIcon}
      </IconButton>
      <Popover
        open={isViewPopoverOpen}
        anchorEl={viewEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={() => toggleLayoutSelectionPopover()}
        disablePortal
      >
        <PopoverContainer
          id="view-popover-menu"
          autoFocusItem={isViewPopoverOpen}
        >
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
        </PopoverContainer>
      </Popover>
    </ViewPopperContainer>
  );
};

export default LayoutSelection;
