// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
const path = require('path');
const { throwUnexpectedConfigError } = require('@craco/craco');

const throwError = (message) =>
  throwUnexpectedConfigError({
    packageName: 'craco',
    githubRepo: 'gsoft-inc/craco',
    message,
    githubIssueQuery: 'webpack',
  });

module.exports = {
  overrideWebpackConfig: ({ webpackConfig }) => {
    if (process.env.REACT_HOT_MODE === 'hot') {
      const configTs = require('./components.tsconfig.json');
      if (!configTs) {
        throwError('Please create components.tsconfig.json in hotReload repository');
      }
      console.log('adding ts-loader');
      const tsLoader = {
        test: /\.tsx?$/,
        exclude: [/node_modules/],
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.json',
        },
      };
      webpackConfig.module.rules.push(tsLoader);
      console.log('ts-loader added');

      const localDependenvies = {
        react: path.resolve(__dirname, '../../node_modules/react'),
        'react-dom': path.resolve(__dirname, '../../node_modules/react-dom'),
        'react-redux': path.resolve(__dirname, '../../node_modules/react-redux'),
        '@mui/styles': path.resolve(__dirname, '../../node_modules/@mui/styles'),
        '@mui/material': path.resolve(__dirname, '../../node_modules/@mui/material'),
        'react-i18next': path.resolve(__dirname, '../../node_modules/react-i18next'),
        '@opentalk/common': path.resolve(__dirname, '../../node_modules/@opentalk/common'),
        '@opentalk/components': path.resolve(__dirname, configTs.compilerOptions.paths['@opentalk/components'][0]),
      };
      webpackConfig.resolve.alias = localDependenvies;

      return webpackConfig;
    }

    return webpackConfig;
  },
};
