// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { generateInstanceId } from '../../utils/eventUtils';
import { configureStore, render, screen, mockedSingleEvent, mockedRecurringEvent } from '../../utils/testUtils';
import CloseMeetingDialog, { CloseMeetingDialogProps } from './CloseMeetingDialog';

const TEST_DATE = '2024-02-16T10:30:00Z';
const VERIFY_TODAY_DATE = '20240216T103000Z';

const dialogProps: CloseMeetingDialogProps = {
  open: true,
  onClose: jest.fn(),
  container: null,
};

describe('generate instance id', () => {
  it('should generate an instance id with the date of test date', () => {
    const startTimeInEventFormat = new Date(TEST_DATE);

    const instanceId = generateInstanceId({
      datetime: startTimeInEventFormat.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
    expect(instanceId).toEqual(VERIFY_TODAY_DATE);
    jest.useRealTimers();
  });
});

describe('CloseMeetingDialog', () => {
  const { store } = configureStore();

  it('should not render with open={false}', async () => {
    await render(<CloseMeetingDialog {...dialogProps} open={false} />, store);
    expect(screen.queryByText('meeting-delete-metadata-dialog-title')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-dialog-message')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-dialog-checkbox')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-button-leave-and-delete')).not.toBeInTheDocument();
    expect(screen.queryByText('meeting-delete-metadata-button-leave-without-delete')).not.toBeInTheDocument();
  });

  it('should render properly for single events', async () => {
    await render(<CloseMeetingDialog {...dialogProps} eventData={mockedSingleEvent} />, store);
    expect(screen.getByText('meeting-delete-metadata-dialog-title')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-dialog-message')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-dialog-checkbox')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-and-delete')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-without-delete')).toBeInTheDocument();
  });

  it('should render properly for recurring events', async () => {
    await render(<CloseMeetingDialog {...dialogProps} eventData={mockedRecurringEvent} />, store);
    expect(screen.getByText('meeting-delete-metadata-dialog-title')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-recurring-metadata-dialog-message')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-recurring-dialog-radio-single')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-recurring-dialog-radio-all')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-and-delete')).toBeInTheDocument();
    expect(screen.getByText('meeting-delete-metadata-button-leave-without-delete')).toBeInTheDocument();
  });
});
