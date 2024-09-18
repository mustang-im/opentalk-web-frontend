// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Grid, Typography, Popover, styled, Theme } from '@mui/material';
import { uniq } from 'lodash';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { SecureIcon as DefaultSecureIcon, DoneIcon } from '../../assets/icons';
import { useAppSelector } from '../../hooks';
import { selectCombinedParticipantsAndUser } from '../../store/selectors';
import { Participant, ParticipationKind } from '../../types';

const ARIA_ID = 'secure-connection-popover';

const getColor = (theme: Theme, warning?: boolean) =>
  warning ? theme.palette.warning.main : theme.palette.primary.main;

const isParticipantUnsafe = (participant: Participant) =>
  participant.participationKind === ParticipationKind.Guest || participant.participationKind === ParticipationKind.Sip;

const SecureIconSmall = styled(DefaultSecureIcon, { shouldForwardProp: (prop) => prop !== 'warning' })<{
  warning?: boolean;
}>(({ theme, warning }) => ({
  color: getColor(theme, warning),
  '&.MuiSvgIcon-root': {
    fontSize: theme.typography.pxToRem(24),
  },
}));

const SecureIconBig = styled(DefaultSecureIcon, { shouldForwardProp: (prop) => prop !== 'warning' })<{
  warning?: boolean;
}>(({ theme, warning }) => ({
  color: getColor(theme, warning),
  width: '6rem',
  height: '6rem',
  padding: theme.spacing(1),
}));

const CheckmarkIconBig = styled(DoneIcon, { shouldForwardProp: (prop) => prop !== 'warning' })<{ warning?: boolean }>(
  ({ theme, warning }) => ({
    color: getColor(theme, warning),
    width: '3rem',
    height: '3rem',
    padding: theme.spacing(1),
  })
);

const SecureConnectionPopover = styled(Popover)(({ theme }) => ({
  pointerEvents: 'none',
  '& .MuiPopover-paper': {
    backgroundColor: theme.palette.background.voteResult,
    padding: theme.spacing(1),
  },
}));

const PopoverParagraph = styled(Typography)(({ theme }) => ({
  fontWeight: 'lighter',
  marginTop: theme.spacing(2),
}));

const CenteredGrid = styled(Grid)(() => ({ textAlign: 'center' }));

const SecurityBadge = () => {
  const allParticipants = useAppSelector(selectCombinedParticipantsAndUser);
  const unsafeParticipantKinds = useMemo(
    () => uniq(allParticipants.filter(isParticipantUnsafe).map((participant) => participant.participationKind)),
    [allParticipants]
  );
  const isUnsafeParticipantConnected = unsafeParticipantKinds.length > 0;

  const [anchorEl, setAnchorEl] = useState<SVGSVGElement | null>(null);
  const { t } = useTranslation();

  const getBadgeTranslationKey = () => {
    if (
      unsafeParticipantKinds.includes(ParticipationKind.Guest) &&
      unsafeParticipantKinds.includes(ParticipationKind.Sip)
    ) {
      return 'secure-connection-contaminated';
    }
    if (unsafeParticipantKinds.includes(ParticipationKind.Guest)) {
      return 'secure-connection-guests';
    }
    if (unsafeParticipantKinds.includes(ParticipationKind.Sip)) {
      return 'secure-connection-sip';
    }
    //ideally this case should not be reached, ever
    return '';
  };

  const handlePopoverOpen = (event: React.MouseEvent<SVGSVGElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const renderWarningPopoverContent = () => (
    <Grid container spacing={2} columns={6} maxWidth="24rem" alignItems="center">
      <Grid item xs={2}>
        <SecureIconBig warning />
      </Grid>
      <Grid item xs={4}>
        <Typography>{t('secure-connection-message')}</Typography>
        <PopoverParagraph>{t(getBadgeTranslationKey())}</PopoverParagraph>
      </Grid>
    </Grid>
  );
  const renderSecurePopoverContent = () => (
    <Grid container columns={6} maxWidth="24rem" alignItems="center">
      <CenteredGrid item xs={2}>
        <SecureIconBig />
      </CenteredGrid>
      <Grid item xs={4}>
        <Typography>{t('secure-connection-message')}</Typography>
      </Grid>
      <CenteredGrid item xs={2}>
        <CheckmarkIconBig />
      </CenteredGrid>
      <Grid item xs={4}>
        <Typography>{t('secure-connection-registered-only')}</Typography>
      </Grid>
      <CenteredGrid item xs={2}>
        <CheckmarkIconBig />
      </CenteredGrid>
      <Grid item xs={4}>
        <Typography>{t('secure-connection-no-sip')}</Typography>
      </Grid>
    </Grid>
  );

  return (
    <>
      <SecureIconSmall
        aria-label="secure-connection-icon"
        aria-owns={open ? ARIA_ID : undefined}
        aria-haspopup="true"
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        warning={isUnsafeParticipantConnected}
      />
      <SecureConnectionPopover
        id={ARIA_ID}
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        {isUnsafeParticipantConnected ? renderWarningPopoverContent() : renderSecurePopoverContent()}
      </SecureConnectionPopover>
    </>
  );
};

export default SecurityBadge;
