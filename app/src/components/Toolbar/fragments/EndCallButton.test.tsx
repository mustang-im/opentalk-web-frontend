// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { UserId } from '@opentalk/rest-api-rtk-query';

import { render, screen, configureStore, fireEvent } from '../../../utils/testUtils';
import EndCallButton from './EndCallButton';

jest.mock('../../../api/rest', () => ({
  ...jest.requireActual('../../../api/rest'),
  useGetMeQuery: () => ({
    data: {
      id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
    },
  }),
  useGetRoomQuery: () => ({
    data: {
      createdBy: {
        id: '3645d74d-9a4b-4cd4-9d9f-f1871c970167' as UserId,
      },
    },
  }),
}));
describe('<EndCallButton />', () => {
  const { store /*, dispatch */ } = configureStore();
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render EndCallButton component', async () => {
    await render(<EndCallButton />, store);
    expect(screen.getByTestId('toolbarEndCallButton')).toBeInTheDocument();
  });

  test('If creator of meeting click on EndCallButton, popup should be displayed with delete room option', async () => {
    await render(<EndCallButton />, store);
    const endButton = screen.getByTestId('toolbarEndCallButton');
    expect(endButton).toBeInTheDocument();

    expect(screen.queryByLabelText('meeting-delete-metadata-dialog-title')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-dialog-message')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-button-leave-and-delete')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-button-leave-without-delete')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-dialog-checkbox')).not.toBeInTheDocument();

    fireEvent.click(endButton);

    const closeMeetingButton = screen.getByText('meeting-delete-metadata-button-leave-and-delete');

    expect(screen.getByLabelText('meeting-delete-metadata-dialog-title')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-dialog-message')).toBeInTheDocument();
    expect(closeMeetingButton).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-without-delete')).toBeInTheDocument();
  });

  test('should dispatch leave by clicking on leaveWithoutDeletingButton', async () => {
    await render(<EndCallButton />, store);
    const endButton = screen.getByTestId('toolbarEndCallButton');
    expect(endButton).toBeInTheDocument();

    fireEvent.click(endButton);

    const leaveWithoutDeletingButton = screen.getByText('meeting-delete-metadata-button-leave-and-delete');

    expect(leaveWithoutDeletingButton).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-without-delete')).toBeInTheDocument();

    fireEvent.click(leaveWithoutDeletingButton);

    /* TODO the hangup ('room/hangup/pending') async thunks is undefined here
    await waitFor(() => {
      expect(dispatch.mock.calls).toMatchObject([
        [{ payload: undefined, type: 'auth/loaded' }],
        [{ payload: undefined, type: 'room/hangup/pending' }],
      ]);
    });*/
  });

  test('should dispatch delete and leave by clicking on deleteMeeting button', async () => {
    await render(<EndCallButton />, store);
    const endButton = screen.getByTestId('toolbarEndCallButton');
    expect(endButton).toBeInTheDocument();
    await fireEvent.click(endButton);

    const deleteMeeting = screen.getByText('meeting-delete-metadata-button-leave-without-delete');
    expect(screen.getByText('meeting-delete-metadata-button-leave-and-delete')).toBeInTheDocument();
    expect(deleteMeeting).toBeInTheDocument();

    fireEvent.click(deleteMeeting);

    /* TODO the hangup ('room/hangup/pending') async thunks is undefined here
    await waitFor(() => {
      expect(dispatch.mock.calls).toEqual(
        expect.arrayContaining([
          [{ payload: undefined, type: 'auth/loaded' }],
          [{ payload: undefined, type: 'room/hangup/pending' }]
        ])
      );
    });*/
  });
});
