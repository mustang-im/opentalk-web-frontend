// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled } from '@mui/material';
import { useTranslation } from 'react-i18next';

import AudioButton from './fragments/AudioButton';
import EndCallButton from './fragments/EndCallButton';
import HandraiseButton from './fragments/HandraiseButton';
import MoreButton from './fragments/MoreButton';
import ShareScreenButton from './fragments/ShareScreenButton';
import VideoButton from './fragments/VideoButton';

type LayoutTypes = 'fullscreen';

const MainContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  background: 'transparent',
  justifyContent: 'space-evenly',
  padding: theme.spacing(2, 0),
  '&.fullscreen': {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: theme.spacing(1.25),
  },
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
    background: theme.palette.background.paper,
  },
  [`${theme.breakpoints.down('md')} and (orientation: landscape)`]: {
    gap: theme.spacing(1),
    background: theme.palette.background.paper,
  },
}));

const Toolbar = ({ layout }: { layout?: LayoutTypes }) => {
  const { t } = useTranslation();
  return (
    <MainContainer role={'tablist'} aria-label={t('toolbar-aria-label')} className={layout} data-testid={'Toolbar'}>
      <HandraiseButton />
      <ShareScreenButton />
      <AudioButton />
      <VideoButton />
      <MoreButton />
      <EndCallButton />
    </MainContainer>
  );
};

export default Toolbar;
