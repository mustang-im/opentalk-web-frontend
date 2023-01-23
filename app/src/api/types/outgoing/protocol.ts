// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule, Namespaced, ParticipantId } from '@opentalk/common';

import { RootState } from '../../../store';
import { createSignalingApiCall } from '../../createSignalingApiCall';
import { sendMessage } from '../../index';

export interface SelectWriter {
  action: 'select_writer';
  participantIds: Array<ParticipantId>;
}

export interface GeneratePdf {
  action: 'generate_pdf';
}

export type Action = SelectWriter | GeneratePdf;
export type Protocol = Namespaced<Action, 'protocol'>;

export const selectWriter = createSignalingApiCall<SelectWriter>('protocol', 'select_writer');
export const uploadPdf = createSignalingApiCall<GeneratePdf>('protocol', 'generate_pdf');

export const handler = createModule<RootState>((builder) => {
  builder.addCase(selectWriter.action, (_state, action) => {
    sendMessage(selectWriter(action.payload));
  });
  builder.addCase(uploadPdf.action, (_state, action) => {
    sendMessage(uploadPdf(action.payload));
  });
});

export default Protocol;
