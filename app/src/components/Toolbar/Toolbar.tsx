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
export enum ToolbarButtonIds {
  Handraise = 'toolbar-handraise',
  ShareScreen = 'toolbar-share-screen',
  Audio = 'toolbar-audio',
  Video = 'toolbar-video',
  More = 'toolbar-more',
  EndCall = 'toolbar-endcall',
}
const MainContainer = styled('aside')(({ theme }) => ({
  display: 'flex',
  background: 'transparent',
  justifyContent: 'space-evenly',
  padding: theme.spacing(2, 0),
  '&.fullscreen': {
    display: 'grid',
    gridAutoFlow: 'column',
    gap: theme.spacing(1.25),
  },
  [theme.breakpoints.down('md')]: {
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
    <MainContainer aria-label={t('landmark-complementary-toolbar')} className={layout} data-testid="Toolbar">
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
