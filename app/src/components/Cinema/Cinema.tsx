// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { styled, Container as MuiContainer } from '@mui/material';
import { FullScreen as ReactFullScreen } from 'react-full-screen';

import LayoutOptions from '../../enums/LayoutOptions';
import { useAppSelector } from '../../hooks';
import { useFullscreenContext } from '../../provider/FullscreenProvider';
import { selectCinemaLayout } from '../../store/slices/uiSlice';
import FullscreenView from '../FullscreenView/index';
import GridView from '../GridView';
import ProtocolView from '../ProtocolView';
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
  const userLayout = useAppSelector(selectCinemaLayout);
  const fullscreenHandle = useFullscreenContext();

  const renderView = () => {
    if (fullscreenHandle.active) {
      return <FullscreenView />;
    } else {
      switch (userLayout) {
        case LayoutOptions.Speaker:
          return <SpeakerView />;
        case LayoutOptions.Whiteboard:
          return <WhiteboardView />;
        case LayoutOptions.Protocol:
          return <ProtocolView />;
        case LayoutOptions.Grid:
        default:
          return <GridView />;
      }
    }
  };

  return (
    <Container disableGutters maxWidth={false}>
      <FullScreen handle={fullscreenHandle}>{renderView()}</FullScreen>
    </Container>
  );
};

export default Cinema;
