// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { screen, render, fireEvent, mockStore, waitFor } from '../../utils/testUtils';
import FeedbackDialog from './FeedbackDialog';

describe('FeedbackDialog', () => {
  const { store } = mockStore(1);
  test('dialog will render properly with flag open={true}', async () => {
    await render(<FeedbackDialog open />, store);
    expect(screen.getByText('feedback-dialog-title')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-rating-function-range')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-rating-handling')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-rating-video-quality')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-rating-audio-quality')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-headline')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-label-liked')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-label-problems')).toBeInTheDocument();
    expect(screen.getByText('feedback-dialog-label-critic')).toBeInTheDocument();

    const cancelButton = screen.getByRole('button', { name: /feedback-button-close/i });
    expect(cancelButton).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /feedback-button-submit/i });
    expect(submitButton).toBeInTheDocument();
  });

  test('changing description input value should have new value', async () => {
    await render(<FeedbackDialog open />, store);
    const descriptionInput = screen.getByRole('textbox', { name: /feedback-dialog-label-liked/i });
    expect(descriptionInput).toBeInTheDocument();

    fireEvent.change(descriptionInput, { target: { value: 'feedback description testing' } });
    await waitFor(() => {
      expect(descriptionInput).toHaveValue('feedback description testing');
    });
  });

  test('rating component should have 5 stars, and on click should make it checked', async () => {
    await render(<FeedbackDialog open />, store);
    const rating = screen.getByText('feedback-dialog-rating-handling');
    expect(rating).toBeInTheDocument();

    const ratingStars = screen.getAllByRole('radio', { checked: false });

    expect(ratingStars).toHaveLength(24);

    const ratingStar4 = screen.getByText('feedback-dialog-rating-handling');
    expect(ratingStar4).toBeInTheDocument();

    fireEvent.click(ratingStar4);
    await waitFor(() => {
      expect(screen.getAllByRole('radio', { checked: true })).toHaveLength(1);
    });
  });

  test('component with flag open={false}, should not render component', async () => {
    await render(<FeedbackDialog open={false} />, store);
    expect(screen.queryByText('feedback-dialog-title')).not.toBeInTheDocument();
    expect(screen.queryByText('feedback-dialog-headline')).not.toBeInTheDocument();

    const cancelButton = screen.queryByRole('button', { name: /feedback-button-close/i });
    expect(cancelButton).not.toBeInTheDocument();

    const submitButton = screen.queryByRole('button', { name: /feedback-button-submit/i });
    expect(submitButton).not.toBeInTheDocument();
  });
});
