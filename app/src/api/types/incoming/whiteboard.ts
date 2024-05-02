// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { NamespacedIncoming, AssetId } from '@opentalk/common';

export interface SpaceUrl {
  message: 'space_url';
  url: string;
}

export interface AssetRef {
  assetId: AssetId;
  filename: string;
}

export interface PdfUrl extends AssetRef {
  message: 'pdf_asset';
}

export type Message = SpaceUrl | PdfUrl;

export type Whiteboard = NamespacedIncoming<Message, 'whiteboard'>;

export default Whiteboard;
