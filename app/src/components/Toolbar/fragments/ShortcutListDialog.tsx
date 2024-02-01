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
  useTheme,
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

interface ShortcutListDialogProps {
  onClose: () => void;
  open: boolean;
}

const CloseButton = styled(IconButton)(({ theme }) => ({
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
  const theme = useTheme();
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
      {/* TODO: Make shortcuts dynamic. */}
      <TableContainer component={Paper}>
        <Table padding="normal">
          <TableHead>
            <TableRow>
              <TableCell>{t('global-shortcut')}</TableCell>
              <TableCell>{t('global-description')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <code>m</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>
                  {t('global-microphone')}&nbsp;{t('global-on')}/{t('global-off')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>v</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>
                  {t('global-video')}&nbsp;{t('global-on')}/{t('global-off')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>f</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>
                  {t('global-fullscreen')}&nbsp;{t('global-on')}/{t('global-off')}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>n</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>{t('shortcut-pass-talking-stick')}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <code>{t('global-space')}</code>
              </TableCell>
              <TableCell>
                <Typography fontWeight={300}>{t('shortcut-hold-to-speak')}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Dialog>
  );
};

export default ShortcutListDialog;
