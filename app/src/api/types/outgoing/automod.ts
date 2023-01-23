// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import { createModule } from '@opentalk/common';
import { createOutgoingAutomod } from '@opentalk/components';

import { createSignalingApiCall } from '../../createSignalingApiCall';
import sendMessage from '../../sendMessage';

const automod = createOutgoingAutomod(createSignalingApiCall, createModule, sendMessage);

export default automod;
