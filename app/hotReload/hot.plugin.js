const { getPlugin, pluginByName, throwUnexpectedConfigError } = require('@craco/craco');
const path = require('path');
const configTs = require('./path.alias.json');

// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2
module.exports = {
  overrideWebpackConfig: ({ webpackConfig, pluginOptions = {}, context: { env, paths } }) => {
    if (process.env.REACT_HOT_MODE === 'hot') {
      //   const { tsConfigFileName = 'tsconfig.hot.json' } = pluginOptions;
      //   paths.appTsConfig.replace('tsconfig.json', tsConfigFileName);

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
        '@opentalk/notistack': path.resolve(__dirname, '../../node_modules/@opentalk/notistack'),
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
