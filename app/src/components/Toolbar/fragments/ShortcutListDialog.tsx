// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Dialog, DialogTitle, IconButton, Paper, Stack, Box, styled, Switch, FormLabel } from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

import { useAppDispatch, useAppSelector } from '../../../hooks/index';
import { selectHotkeysEnabled, setHotkeysEnabled } from '../../../store/slices/uiSlice';
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
  const hotkeysEnabled = useAppSelector(selectHotkeysEnabled);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth={'xs'} PaperComponent={Paper}>
      <Stack component="header">
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2} position="relative">
          <DialogTitle sx={{ p: 0 }}>{t('my-meeting-menu-keyboard-shortcuts')}</DialogTitle>
          <CloseButton aria-label="close-button" onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" p={2} position="relative">
          <SwitchLabel htmlFor={switchId}>{t('my-meeting-menu-keyboard-shortcuts')}</SwitchLabel>
          <Switch
            id={switchId}
            checked={hotkeysEnabled}
            onChange={() => dispatch(setHotkeysEnabled(!hotkeysEnabled))}
            onKeyDown={(e) => e.stopPropagation()}
            onKeyUp={(e) => e.stopPropagation()}
          />
        </Box>
      </Stack>
      {hotkeysEnabled ? (
        <ShortcutTable />
      ) : (
        <DeactivatedContainer>{t('shortcut-deactive-message')}</DeactivatedContainer>
      )}
    </Dialog>
  );
};

export default ShortcutListDialog;
