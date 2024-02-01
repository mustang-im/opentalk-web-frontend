// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Dialog, DialogTitle, IconButton, Paper, Stack, Box, styled, Switch, FormLabel } from '@mui/material';
import { CloseIcon, TimerStyle } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { selectHotkeysEnabled, setHotkeysEnabled } from '../../../../../packages/common/store/hotkeysSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/index';
import { selectTimerStyle } from '../../../store/slices/timerSlice';
import { ShortcutTable } from './ShortcutTable';

interface ShortcutListDialogProps {
  onClose: () => void;
  open: boolean;
}

const CloseButton = styled(IconButton)(() => ({
  position: 'absolute',
  right: 0,
  top: '50%',
  transform: 'translateY(-50%)',
}));

const SwitchLabel = styled(FormLabel)(({ theme }) => ({
  color: theme.palette.secondary.dark,
  fontWeight: 300,
}));

const DeactivatedContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.secondary.light,
  fontWeight: 500,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  aspectRatio: '2/1',
}));

const ShortcutListDialog = (props: ShortcutListDialogProps) => {
  const { t } = useTranslation();
  const { onClose, open } = props;
  const switchId = 'switch-shortcut-activation';
  const dispatch = useAppDispatch();
  const shortcutsActive = useAppSelector(selectHotkeysEnabled);
  const timerStyle = useAppSelector(selectTimerStyle);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'} PaperComponent={Paper}>
      <Stack component="header">
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2} position="relative">
          <DialogTitle sx={{ p: 0 }}>{t('more-menu-keyboard-shortcuts')}</DialogTitle>
          {onClose && (
            <CloseButton aria-label="close-button" onClick={onClose}>
              <CloseIcon />
            </CloseButton>
          )}
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2} position="relative">
          <SwitchLabel htmlFor={switchId}>{t('more-menu-keyboard-shortcuts')}</SwitchLabel>
          <Switch
            id={switchId}
            checked={shortcutsActive}
            onChange={() => dispatch(setHotkeysEnabled(!shortcutsActive))}
            disabled={timerStyle === TimerStyle.CoffeeBreak}
          />
        </Box>
      </Stack>
      {shortcutsActive ? (
        <ShortcutTable />
      ) : (
        <DeactivatedContainer>{t('shortcut-deactive-message')}</DeactivatedContainer>
      )}
    </Dialog>
  );
};

export default ShortcutListDialog;
