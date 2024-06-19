// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Button, styled, Typography, useTheme } from '@mui/material';
import { useDateFormat } from '@opentalk/common';
import { LegalVoteType } from '@opentalk/components';
import { useTranslation } from 'react-i18next';

interface VoteResultDateProps {
  date: Date;
  state: LegalVoteType['state'];
  showTableHint: boolean;
  showResultsHandler: () => void;
}

const TokenTypography = styled(Typography)(({ theme }) => ({
  whiteSpace: 'pre-wrap',
  paddingBottom: theme.spacing(1),
}));

const VoteResultDate = ({ state, date, showTableHint, showResultsHandler }: VoteResultDateProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const tokenKey = 'legal-vote-share-token-' + (state === 'active' ? 'active' : 'inactive');

  return (
    <>
      <TokenTypography color={'primary'}>
        {t('legal-vote-success', {
          atVoteTime: useDateFormat(date, 'time'),
          onVoteDate: useDateFormat(date, 'date'),
          newLine: '\n',
        })}
      </TokenTypography>
      <TokenTypography color={theme.palette.warning.main}>{t(tokenKey)}</TokenTypography>
      {showTableHint && (
        <Button
          sx={{ width: '100%' }}
          data-testid="legal-vote-show-results-button"
          type="button"
          onClick={() => {
            showResultsHandler();
          }}
        >
          {t('legal-vote-popover-results-button')}
        </Button>
      )}
    </>
  );
};
export default VoteResultDate;
