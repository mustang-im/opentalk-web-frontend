// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

module.exports = {
  root: true,
  env: {
    "browser": false,
    "es6": true,
    "node": true
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.eslint.json",
    sourceType: "module",
    tsconfigRootDir: __dirname
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "prettier"
  ],
  rules: {
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/no-empty-function": 0,
    "react/prop-types": 0,
    "@typescript-eslint/no-non-null-assertion": 0
  },
  settings: {
    "react": {
      "version": "17.0"
    }
  }
};

