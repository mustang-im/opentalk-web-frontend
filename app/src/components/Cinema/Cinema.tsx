// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Container as MuiContainer } from '@mui/material';
import { useSnackbarFacade } from '@opentalk/common';
import { FullScreen as ReactFullScreen } from 'react-full-screen';

import LayoutOptions from '../../enums/LayoutOptions';
import { useAppSelector } from '../../hooks';
import { useFullscreenContext } from '../../provider/FullscreenProvider';
import { selectParticipantsLayout } from '../../store/slices/uiSlice';
import FullscreenView from '../FullscreenView/index';
import GridView from '../GridView';
import SpeakerView from '../SpeakerView';
import WhiteboardView from '../Whiteboard';

const FullScreen = styled(ReactFullScreen)({
  width: '100%',
});

const Container = styled(MuiContainer)({
  height: '100%',
  overflow: 'auto',
  display: 'flex',
});

const Cinema = () => {
  const userLayout = useAppSelector(selectParticipantsLayout);
  const fullscreenHandle = useFullscreenContext();
  const { snackbars } = useSnackbarFacade();

  const renderView = () => {
    if (fullscreenHandle.active) {
      return <FullscreenView />;
    } else {
      switch (userLayout) {
        case LayoutOptions.Speaker:
          return <SpeakerView />;
        case LayoutOptions.Whiteboard:
          return <WhiteboardView />;
        case LayoutOptions.Grid:
        default:
          return <GridView />;
      }
    }
  };

  return (
    <Container disableGutters maxWidth={false}>
      <FullScreen handle={fullscreenHandle}>
        {fullscreenHandle.active && snackbars}
        {renderView()}
      </FullScreen>
    </Container>
  );
};

export default Cinema;
