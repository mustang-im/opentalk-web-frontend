<!--
SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>

SPDX-License-Identifier: EUPL-1.2
-->

# Hot reload module

## Configuration

1. Change the path to your local component library in `path.alias.json`

2. Delete node_modules in your local @opentalk/component library

3. run `yarn start:hot`

## Additional info

- If you are still getting errors just uninstall the @opentalk/common in your local @opetanlk/components library
  and re-install it again

`cd <path_to_components_library>`
`yarn uninstall @opentalk/common && yarn install @opentalk/common`
