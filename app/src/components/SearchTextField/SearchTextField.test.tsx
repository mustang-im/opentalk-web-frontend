// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { render, screen, fireEvent, waitFor, createStore, cleanup } from '../../utils/testUtils';
import SearchTextField from './SearchTextField';
import { sortOptionItems } from './fragments/SortPopover';

describe('SearchTextField', () => {
  const { store, dispatch } = createStore();
  const mockOnSearch = jest.fn();
  afterEach(() => cleanup());

  test('render SearchTextField component without crashing', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} />, store);

    const searchInput = screen.getByPlaceholderText('input-search-placehoder');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveAttribute('type', 'text');
    expect(screen.queryByRole('button', { name: /sort-by/i })).not.toBeInTheDocument();
  });

  test('render SearchTextField component with showSort flag', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} showSort />, store);
    const sortButton = screen.getByRole('button', { name: /sort-by/i });
    expect(sortButton).toBeInTheDocument();
  });

  test('add value into input should trigger onSearch()', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} showSort />, store);
    const searchInput = screen.getByPlaceholderText('input-search-placehoder');
    expect(searchInput).toBeInTheDocument();
    expect(searchInput).toHaveValue('');

    fireEvent.change(searchInput, { target: { value: 'testing...' } });
    await waitFor(() => {
      expect(searchInput).toHaveValue('testing...');
    });
    expect(mockOnSearch).toBeCalledTimes(1);
  });

  test('when input get focus, it should dispatch setHotkeysEnabled with payload:false', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} />, store);
    const searchInput = screen.getByPlaceholderText('input-search-placehoder');
    expect(searchInput).toBeInTheDocument();

    fireEvent.focus(searchInput);
    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([{ payload: false, type: 'media/setHotkeysEnabled' }]);
    });
  });

  test('when input get blur, it should dispatch setHotkeysEnabled with payload: true', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} />, store);
    const searchInput = screen.getByPlaceholderText('input-search-placehoder');
    expect(searchInput).toBeInTheDocument();

    fireEvent.blur(searchInput);
    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([{ payload: true, type: 'media/setHotkeysEnabled' }]);
    });
  });

  test('click on sortButton should open menu with list of sortOptionItems', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} showSort />, store);
    const sortButton = screen.getByRole('button', { name: /sort-by/i });
    expect(sortButton).toBeInTheDocument();

    fireEvent.click(sortButton);
    await waitFor(() => {
      sortOptionItems.map((option) =>
        expect(screen.getByRole('menuitem', { name: option.i18nKey })).toBeInTheDocument()
      );
    });
  });

  test('click on sort-raised-hand item should dispatch setParticipantsSortOption with raisedHandFirst', async () => {
    await render(<SearchTextField onSearch={mockOnSearch} showSort />, store);
    const sortButton = screen.getByRole('button', { name: /sort-by/i });
    expect(sortButton).toBeInTheDocument();

    await fireEvent.click(sortButton);
    const raisedHandButton = screen.getByRole('menuitem', { name: 'sort-raised-hand' });
    expect(raisedHandButton).toBeInTheDocument();

    fireEvent.click(raisedHandButton);
    await waitFor(() => {
      expect(dispatch.mock.calls).toContainEqual([
        { payload: 'raisedHandFirst', type: 'ui/setParticipantsSortOption' },
      ]);
    });
  });
});
