<!--
SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>

SPDX-License-Identifier: EUPL-1.2
-->

# Opentalk common components and types

This includes:

- All common component that are used in the main application and the modules
- All common types and interfaces
- Common utility functions and helpers
- Common assets

## Requirments

> ```node >= 17.5```

# Getting Started

## Installing

> yarn - `yarn add __ `

> npm - `npm install __ `

## Usage

- Importing AccordionItem as React component and Add icon as an asset

`import {AccordionItem, AddIcon} from '@opentalk/common'`

## Development

This library includes common components and types. All components are inside /components folder in the root of the application.

# Components

When creating a new component in the /component folder, the component should be also imported and re-exported in /component/index.ts file as a named export.

# Types

All types and interfaces that are used in the main application and the module libraries are considered to be common types and are included in this library.
They can be found in the /types folder as barrel files which are then expored in the /types/index.ts.

# Provider

For now component provider is not used, but it's there in case there are situations when we want to prevent prop drilling.

# Ambient Modules

Ambient modules is a TypeScript feature that allows importing libraries written in JavaScript and using them seamlessly and safely as if they were written in TypeScript.
An ambient declaration file is a file that describes the module’s type but doesn’t contain its implementation. Ambient declaration files are not transpiled, so they are not converted to JavaScript.

For now we have SVG, DateTimeFormat, StatelessComponent and mui themes ambient modules implementation.

# Assets

`yarn build-svg `

For including icons in the library the only thing that needs to be done is for the source to be added in the /assets/source folder. Source must be in .svg format.
This library uses @svgr/cli for automatic creating a react components from svg source files by running `yarn build-svg ` command.

## Deployment

`yarn build`

After finishing the development phaze we need to build the distribution files.
This library uses rollup.js and all configuration can be found in /rollup.config.js.

For building a production version you can use `yarn build`.

(In case of need for a types build there are also `yarn build-ts` (for esm and cjs types build), or `yarn build:esm` and `yarn build:cjs` for building types accordingly).
