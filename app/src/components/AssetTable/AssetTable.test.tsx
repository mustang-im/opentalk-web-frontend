// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import format from 'date-fns/format';

import { formatBytes } from '../../utils/numberUtils';
import { render, screen, mockedRoomAssets, waitFor } from '../../utils/testUtils';
import { sleep } from '../../utils/timeUtils';
import AssetTable from './AssetTable';

const handleDownload = jest.fn(() => {
  return sleep(100);
});

const handleDelete = jest.fn(() => {
  return sleep(100);
});

// checks all the text content inside a row
const checkRowTextContent = (
  row: HTMLElement,
  isHeader: boolean,
  name: string,
  created: string,
  size: string,
  action?: string
) => {
  const columns = within(row).getAllByRole(isHeader ? 'columnheader' : 'cell');
  expect(columns).toHaveLength(4);
  expect(columns[0]).toHaveTextContent(name);
  expect(columns[1]).toHaveTextContent(created);
  expect(columns[2]).toHaveTextContent(size);
  // asset rows have buttons inside, we will check them separately
  action ? expect(columns[3]).toHaveTextContent(action) : null;
};

// checks specifically action buttons within an asset row
const checkAssetActionButtons = (row: HTMLElement, deletable: boolean) => {
  const cells = within(row).getAllByRole('cell');
  const actionCell = cells[3];
  const actionButtons = within(actionCell).getAllByRole('button');
  const expectedButtonsNumber = deletable ? 2 : 1;
  expect(actionButtons.length).toEqual(expectedButtonsNumber);
};

describe('Asset Table', () => {
  it('renders table correctly for one asset with both action buttons', async () => {
    const asset = mockedRoomAssets[0];
    const deletable = true;
    await render(<AssetTable assets={[asset]} onDownload={handleDownload} onDelete={handleDelete} />);
    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();

    // Should be 2 rows: header row + asset row
    const rows = screen.getAllByRole('row');
    expect(rows.length).toEqual(2);

    // check header row
    const headerRow = rows[0];
    let isHeader = true;
    checkRowTextContent(
      headerRow,
      isHeader,
      'asset-table-filename',
      'asset-table-created',
      'asset-table-size',
      'asset-table-actions'
    );

    // check asset row
    const assetRow = rows[1];
    isHeader = false;
    checkRowTextContent(
      assetRow,
      isHeader,
      asset.filename,
      format(new Date(asset.createdAt), 'HH:mm dd.MM.yyyy'),
      formatBytes(asset.size)
    );
    checkAssetActionButtons(assetRow, deletable);

    // check download button
    const downloadButton = within(assetRow).getByRole('button', { name: /action-download/i });
    userEvent.click(downloadButton);
    await waitFor(() => {
      expect(handleDownload).toHaveBeenCalledWith(asset.id, asset.filename);
    });

    // check delete button
    const deleteButton = within(assetRow).getByRole('button', { name: /action-delete/i });
    userEvent.click(deleteButton);
    await waitFor(() => {
      expect(handleDelete).toHaveBeenCalledWith(asset.id);
    });
  });

  it('renders table correctly for multiple assets and shows no delete button', async () => {
    await render(<AssetTable assets={mockedRoomAssets} onDownload={handleDownload} />);
    expect(screen.queryByRole('button', { name: /action-delete/i })).not.toBeInTheDocument();
  });
});
