// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import {
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  styled,
  Stack,
} from '@mui/material';
import { AssetId } from '@opentalk/common';
import { BaseAsset } from '@opentalk/rest-api-rtk-query';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { format } from 'date-fns';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { formatBytes } from '../../utils/numberUtils';

const DownloadButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

// `component` prop lost when wrapping with `styled`
// https://github.com/mui/material-ui/issues/29875
const AssetTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'maxHeight',
})<{ maxHeight?: string | number; component?: React.ElementType }>(({ theme, maxHeight }) => ({
  marginTop: theme.spacing(1),
  marginBottom: theme.spacing(1),
  maxHeight,
}));

interface AssetTableProps {
  assets: Array<BaseAsset>;
  onDownload: (assetId: AssetId, filename: string) => Promise<void>;
  onDelete?: (assetId: AssetId) => Promise<void | { data: void } | { error: FetchBaseQueryError | SerializedError }>;
  maxHeight?: string;
}

/*
  If onDelete function is set => the assets are deletable and `Delete` button will be exposed in the UI
  Otherwise we show only the `Download` button
*/
export const AssetTable = ({ assets, onDownload, onDelete, maxHeight = 'none' }: AssetTableProps) => {
  const { t } = useTranslation();
  const [disabledRows, setDisabledRows] = useState<AssetId[]>([]);

  const isRowDisabled = (assetId: AssetId) => disabledRows.includes(assetId);

  // While downloading we disable buttons in the relevant row
  const handleDownload = async (assetId: AssetId, assetFilename: string) => {
    setDisabledRows((disabledRows) => [...disabledRows, assetId]);
    await onDownload(assetId, assetFilename);
    setDisabledRows((disabledRows) => disabledRows.filter((id) => id !== assetId));
  };

  // While deleting we disable buttons in the relevant row
  const handleDelete = async (assetId: AssetId) => {
    if (onDelete) {
      setDisabledRows((disabledRows) => [...disabledRows, assetId]);
      await onDelete(assetId);
      setDisabledRows((disabledRows) => disabledRows.filter((id) => id !== assetId));
    }
  };

  const renderTableRows = () => {
    return assets?.map((asset) => {
      const isDisabled = isRowDisabled(asset.id);
      return (
        <TableRow key={asset.id}>
          <TableCell>{asset.filename}</TableCell>
          <TableCell>{format(new Date(asset.createdAt), 'HH:mm dd.MM.yyyy')}</TableCell>
          <TableCell>{formatBytes(asset.size)}</TableCell>
          <TableCell>
            <Stack spacing={0.5} direction="column">
              <DownloadButton
                color="secondary"
                onClick={() => handleDownload(asset.id, asset.filename)}
                disabled={isDisabled}
                fullWidth
              >
                {t('action-download')}
              </DownloadButton>
              {onDelete && (
                <Button color="error" onClick={() => handleDelete(asset.id)} disabled={isDisabled} fullWidth>
                  {t('action-delete')}
                </Button>
              )}
            </Stack>
          </TableCell>
        </TableRow>
      );
    });
  };

  return (
    <AssetTableContainer maxHeight={maxHeight} component={Paper}>
      <Table padding="normal" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>{t('asset-table-filename')}</TableCell>
            <TableCell>{t('asset-table-created')}</TableCell>
            <TableCell>{t('asset-table-size')}</TableCell>
            <TableCell>{t('asset-table-actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{renderTableRows()}</TableBody>
      </Table>
    </AssetTableContainer>
  );
};

export default AssetTable;
