// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { Typography } from '@mui/material';
import { useDateFormat } from '@opentalk/common';
import { useTranslation } from 'react-i18next';

interface VoteResultDateProps {
  date: Date;
}

const VoteResultDate = (props: VoteResultDateProps) => {
  const { t } = useTranslation();
  const { date } = props;
  return (
    <Typography color={'primary'}>
      {t('legal-vote-success', {
        atVoteTime: useDateFormat(date, 'time'),
        onVoteDate: useDateFormat(date, 'date'),
      })}
    </Typography>
  );
};
export default VoteResultDate;
