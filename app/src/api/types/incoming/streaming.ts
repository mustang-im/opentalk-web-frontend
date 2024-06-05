// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { NamespacedIncoming, StreamUpdatedMessage } from '@opentalk/common';

type StreamingErrorMessage = 'error' | 'recorder_error';
type StreamingErrorType = 'insufficient_permissions' | 'invalid_recording_id' | 'already_recording' | 'timeout';

export interface StreamingError {
  message: StreamingErrorMessage;
  error: StreamingErrorType;
}

export type Message = StreamUpdatedMessage | StreamingError;

export type Streaming = NamespacedIncoming<Message, 'recording'>;

export default Streaming;
