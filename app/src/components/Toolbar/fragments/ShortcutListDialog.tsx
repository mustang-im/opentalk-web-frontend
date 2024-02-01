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
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

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

  const shortcuts = useMemo(() => {
    return [
      {
        key: 'm',
        description: `${t('global-microphone')} ${t('global-on')}/${t('global-off')}`,
      },
      {
        key: 'v',
        description: `${t('global-video')} ${t('global-on')}/${t('global-off')}`,
      },
      {
        key: 'f',
        description: `${t('global-fullscreen')} ${t('global-on')}/${t('global-off')}`,
      },
      {
        key: 'n',
        description: t('shortcut-pass-talking-stick'),
      },
      {
        key: t('global-space'),
        description: t('shortcut-hold-to-speak'),
      },
    ];
  }, [t]);

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
      <TableContainer component={Paper}>
        <Table padding="normal">
          <TableHead>
            <TableRow>
              <TableCell>{t('global-shortcut')}</TableCell>
              <TableCell>{t('global-description')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shortcuts.map((shortcut) => (
              <TableRow key={shortcut.key}>
                <TableCell>
                  <code>{shortcut.key}</code>
                </TableCell>
                <TableCell>
                  <Typography fontWeight={300}>{shortcut.description}</Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default ShortcutListDialog;
