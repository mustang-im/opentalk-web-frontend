// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { RoomId, AssetId } from '@opentalk/rest-api-rtk-query';
import { useTranslation } from 'react-i18next';

import { useGetRoomAssetsQuery, useDeleteRoomAssetMutation } from '../../../../api/rest';
import { notifications } from '../../../../commonComponents';
import SuspenseLoading from '../../../../commonComponents/SuspenseLoading/SuspenseLoading';
import AssetTable from '../../../../components/AssetTable';
import { useDownloadAction } from '../../../../hooks/download';

interface RoomAssetTableProps {
  roomId: RoomId;
  isMeetingCreator: boolean;
}

const RoomAssetTable = ({ roomId, isMeetingCreator }: RoomAssetTableProps) => {
  const { t } = useTranslation();
  const { data: assets, isLoading, isError } = useGetRoomAssetsQuery(roomId, { refetchOnMountOrArgChange: true });
  const [deleteRoomAsset] = useDeleteRoomAssetMutation();
  const downloadRoomAsset = useDownloadAction();

  const handleDownload = async (assetId: AssetId, filename: string) => {
    return downloadRoomAsset(roomId, assetId, filename);
  };

  const handleDelete = async (assetId: AssetId) => {
    return await deleteRoomAsset({ roomId, assetId }).catch((error) => {
      console.error(`Error occured when deleting asset ${assetId}: `, error);
      notifications.error(t('asset-delete-error'));
    });
  };

  if (isLoading) return <SuspenseLoading />;

  if (isError || !assets || assets.length === 0) return null;

  return (
    <AssetTable
      assets={assets}
      onDownload={handleDownload}
      onDelete={isMeetingCreator ? handleDelete : undefined}
      maxHeight="17rem"
    />
  );
};

export default RoomAssetTable;
