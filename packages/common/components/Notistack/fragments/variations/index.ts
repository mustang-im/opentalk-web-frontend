// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
import BinaryActionNotification from "./BinaryActionNotification";
import type { VariantType } from 'notistack';

interface NotistackCustomComponents {
  binaryAction: typeof BinaryActionNotification;
}

type ComponentsParameter = {
  [variant in VariantType]?: React.JSXElementConstructor<unknown>
}

export function getNotistackComponents(components: ComponentsParameter = {}): NotistackCustomComponents {
  return {
    ...components,
    binaryAction: BinaryActionNotification
  } as const;
}