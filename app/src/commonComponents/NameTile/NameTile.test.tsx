// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { MediaSessionType, ParticipantId } from '../../types';
import { render, screen, configureStore, mockSubscriberState } from '../../utils/testUtils';
import NameTile from './NameTile';

describe('render <NameTile />', () => {
  const displayName = 'Test User Name';
  const participantId = 'xxxx-xxxxxx-xxxx-xxxxxx' as ParticipantId;
  const descriptor = `${participantId}/${MediaSessionType.Video}`;

  test('render NameTile component with audio on', async () => {
    const { store } = configureStore({
      initialState: {
        subscribers: mockSubscriberState({ descriptor, participantId, audioOn: true, videoOn: false }),
      },
    });
    await render(<NameTile displayName={displayName} participantId={participantId} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('micOff')).not.toBeInTheDocument();
  });

  test('render NameTile component with audio off', async () => {
    const { store } = configureStore({
      initialState: {
        subscribers: mockSubscriberState({ descriptor, participantId, audioOn: false, videoOn: true }),
      },
    });
    await render(<NameTile displayName={displayName} participantId={participantId} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.getByTestId('micOff')).toBeInTheDocument();
  });

  test('render NameTile component with video on', async () => {
    const { store } = configureStore({
      initialState: {
        subscribers: mockSubscriberState({ descriptor, participantId, audioOn: false, videoOn: true }),
      },
    });
    await render(<NameTile displayName={displayName} participantId={participantId} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('camOff')).not.toBeInTheDocument();
  });

  test('render NameTile component with video and audio on', async () => {
    const { store } = configureStore({
      initialState: {
        subscribers: mockSubscriberState({ descriptor, participantId, audioOn: true, videoOn: true }),
      },
    });
    await render(<NameTile displayName={displayName} participantId={participantId} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('iconBox')).not.toBeInTheDocument();
  });

  test('render NameTile component with local video on', async () => {
    const { store } = configureStore();
    console.log(store.getState());
    await render(<NameTile localVideoOn localAudioOn={false} displayName={displayName} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('micOff')).toBeInTheDocument();
    expect(screen.queryByTestId('camOff')).not.toBeInTheDocument();
  });

  test('render NameTile component with local audio on', async () => {
    const { store } = configureStore();
    await render(<NameTile localAudioOn localVideoOn={false} displayName={displayName} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('micOff')).not.toBeInTheDocument();
    expect(screen.queryByTestId('camOff')).toBeInTheDocument();
  });

  test('render NameTile component with local video and audio on', async () => {
    const { store } = configureStore();
    await render(<NameTile localVideoOn localAudioOn displayName={displayName} />, store);

    expect(screen.getByTestId('nameTile')).toBeInTheDocument();
    expect(screen.getByText(displayName)).toBeInTheDocument();
    expect(screen.queryByTestId('micOff')).not.toBeInTheDocument();
    expect(screen.queryByTestId('camOff')).not.toBeInTheDocument();
  });
});
