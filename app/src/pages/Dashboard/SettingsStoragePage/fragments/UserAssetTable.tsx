// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { AssetId, RoomId, notifications } from '@opentalk/common';
import { BaseAsset, UserOwnedAsset } from '@opentalk/rest-api-rtk-query';
import { useTranslation } from 'react-i18next';

import { useGetUserOwnedAssetsQuery, useDeleteRoomAssetMutation } from '../../../../api/rest';
import SuspenseLoading from '../../../../commonComponents/SuspenseLoading';
import AssetTable from '../../../../components/AssetTable';
import { useDownloadAction } from '../../../../hooks/download';

export const UserAssetTable = () => {
  const { t } = useTranslation();
  const { data, isLoading, isError } = useGetUserOwnedAssetsQuery(undefined, { refetchOnMountOrArgChange: true });
  const userAssets = data?.ownedAssets;
  const [deleteRoomAsset] = useDeleteRoomAssetMutation();
  const downloadRoomAsset = useDownloadAction();

  const mapUserOwnedAssetToBaseAsset = ({
    id,
    filename,
    createdAt,
    namespace,
    kind,
    size,
  }: UserOwnedAsset): BaseAsset => ({ id, filename, createdAt, namespace, kind, size });

  const getRoomId = (assetId: AssetId): RoomId | undefined => {
    if (userAssets && userAssets.length > 0) {
      const userAssetWithId = userAssets.find((userAsset) => userAsset.id === assetId);
      if (userAssetWithId) {
        return userAssetWithId.roomId;
      }
    }
  };

  const handleDownload = async (assetId: AssetId, filename: string) => {
    const roomId = getRoomId(assetId);
    if (roomId) {
      return downloadRoomAsset(roomId, assetId, filename);
    }
  };

  const handleDelete = async (assetId: AssetId) => {
    const roomId = getRoomId(assetId);
    if (roomId) {
      return await deleteRoomAsset({ roomId, assetId }).catch((error) => {
        console.error(`Error occured when deleting asset ${assetId}: `, error);
        notifications.error(t('asset-delete-error'));
      });
    }
  };

  if (isLoading) return <SuspenseLoading />;

  if (isError || !userAssets || userAssets.length === 0) return null;

  const assets = userAssets.map(mapUserOwnedAssetToBaseAsset);

  return <AssetTable assets={assets} onDownload={handleDownload} onDelete={handleDelete} maxHeight="37rem" />;
};
