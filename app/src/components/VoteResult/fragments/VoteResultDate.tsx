// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Typography, useTheme } from '@mui/material';
import { useDateFormat } from '@opentalk/common';
import { LegalVoteType } from '@opentalk/components';
import { useTranslation } from 'react-i18next';

interface VoteResultDateProps {
  date: Date;
  state: LegalVoteType['state'];
}

const TokenTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  paddingBottom: theme.spacing(2),
}));

const VoteResultDate = ({ state, date }: VoteResultDateProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tokenKey = 'legal-vote-share-token-' + (state === 'active' ? 'active' : 'inactive');

  return (
    <>
      <TokenTypography color={'primary'}>
        {t('legal-vote-success', {
          atVoteTime: useDateFormat(date, 'time'),
          onVoteDate: useDateFormat(date, 'date'),
          newLine: '\n\n',
        })}
      </TokenTypography>
      <TokenTypography color={theme.palette.warning.main}>{t(tokenKey)}</TokenTypography>
    </>
  );
};
export default VoteResultDate;
