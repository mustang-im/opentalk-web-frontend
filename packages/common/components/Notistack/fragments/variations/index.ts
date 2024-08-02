// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import type { VariantType } from 'notistack';

import BinaryActionNotification from './BinaryActionNotification';
import { ConsentNotification } from './ConsentNotification';
import { TalkingStickMutedNotification } from './TalkingStickMutedNotification';
import { TalkingStickUnmutedNotification } from './TalkingStickUnmutedNotification';

interface NotistackCustomComponents {
  binaryAction: typeof BinaryActionNotification;
  consent: typeof ConsentNotification;
  talkingStickMuted: typeof TalkingStickMutedNotification;
  talkingStickUnmuted: typeof TalkingStickUnmutedNotification;
}

type ComponentsParameter = {
  [variant in VariantType]?: React.JSXElementConstructor<unknown>;
};

export function getNotistackComponents(components: ComponentsParameter = {}): NotistackCustomComponents {
  return {
    ...components,
    binaryAction: BinaryActionNotification,
    consent: ConsentNotification,
    talkingStickMuted: TalkingStickMutedNotification,
    talkingStickUnmuted: TalkingStickUnmutedNotification,
  };
}
