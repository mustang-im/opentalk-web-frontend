// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Dialog,
  DialogTitle,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableHead,
  Typography,
  TableRow,
  TableCell,
  TableBody,
  Stack,
  Box,
  styled,
  Switch,
  FormLabel,
} from '@mui/material';
import { CloseIcon } from '@opentalk/common';
import { useTranslation } from 'react-i18next';
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

const ShortcutListDialog = (props: ShortcutListDialogProps) => {
  const { t } = useTranslation();
  const { onClose, open } = props;
  const switchId = 'switch-shortcut-activation';

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
          <Switch id={switchId} value={false} />
        </Box>
      </Stack>
      <ShortcutTable />
    </Dialog>
  );
};

export default ShortcutListDialog;
