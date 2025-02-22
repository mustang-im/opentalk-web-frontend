// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

const CracoEsbuildPlugin = require('craco-esbuild');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HotReloadPlugin = require('./hotReload/hot.plugin');

module.exports = ({ env }) => {
    const isProductionBuild = process.env.NODE_ENV === "production"
    const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE
        ? "server" : "json";

    return {
        plugins: [
			{
				plugin: HotReloadPlugin
			},
            {
                plugin: CracoEsbuildPlugin,
                options: {
                    skipEsbuildJest: true,
                    enableSvgr: true,
                },
            },
        ],
        webpack: {
            plugins: {
                add: isProductionBuild ? [new BundleAnalyzerPlugin({ analyzerMode })] : []
            },
            configure: webpackConfig => {
                const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
                  ({ constructor }) => constructor && constructor.name === "ModuleScopePlugin",
                );
                webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);
                return webpackConfig;
            },
        },
        devServer: {
          client: {
            overlay: {
              errors: true,
              warnings: true,
              // runtime errors are caught by the Glitchtip in the app
              // and shouldn't be additionally displayed
              runtimeErrors: false,
            },
          },
        },         
    };

};
