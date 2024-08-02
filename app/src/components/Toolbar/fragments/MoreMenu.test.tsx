// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { waitFor } from '@testing-library/dom';

import { render, screen, configureStore, fireEvent } from '../../../utils/testUtils';
import MenuButton from './MoreButton';
import MoreMenu from './MoreMenu';

describe('<MoreButton />', () => {
  const { store } = configureStore();

  test('render MoreMenuButton component', async () => {
    await render(<MenuButton />, store);
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
    expect(screen.queryByTestId('moreMenu')).not.toBeInTheDocument();
  });

  test('render moreMenu after clicking on MoreMenuButton', async () => {
    await render(<MenuButton />, store);
    const button = screen.getByTestId('toolbarMenuButton');
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(screen.getByTestId('moreMenu')).toBeInTheDocument();
  });

  describe.only('additional development options', () => {
    beforeEach(() => {
      jest.spyOn(Storage.prototype, 'getItem');
      (Storage.prototype.getItem as jest.Mock).mockReturnValue('true');
    });

    it('shows success notification when show test info option is clicked', async () => {
      await render(<MoreMenu open anchorEl={document.createElement('div')} onClose={jest.fn()} />, store);
      fireEvent.click(screen.getByText('Show Test Info'));
      await waitFor(() => {
        const notificationMessage = screen.getByText('You just triggered this notification. Success!');
        expect(notificationMessage).toBeInTheDocument();
        expect(notificationMessage.parentElement).toHaveAttribute('role', 'alert');
        expect(notificationMessage.parentElement).toHaveClass('notistack-MuiContent-success');
      });
    });

    it('shows error notification when show test error option is clicked', async () => {
      await render(<MoreMenu open anchorEl={document.createElement('div')} onClose={jest.fn()} />, store);
      fireEvent.click(screen.getByText('Show Test Error'));
      await waitFor(() => {
        const notificationMessage = screen.getByText('Test error context: Error: Test Error');
        expect(notificationMessage).toBeInTheDocument();
        expect(notificationMessage.parentElement).toHaveAttribute('role', 'alert');
        expect(notificationMessage.parentElement).toHaveClass('notistack-MuiContent-error');
      });
    });
  });
});
