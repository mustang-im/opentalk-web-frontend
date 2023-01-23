// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, createStore } from '../../../utils/testUtils';
import MoreButton from './MoreButton';

describe('<MoreButton />', () => {
  const { store } = createStore();

  test('render MoreButton component', async () => {
    await render(<MoreButton />, store);
    expect(screen.getByTestId('toolbarMenuButton')).toBeInTheDocument();
  });
});
