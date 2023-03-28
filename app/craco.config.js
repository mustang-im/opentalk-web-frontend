// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

const CracoEsbuildPlugin = require('craco-esbuild');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path')

/* ENABLE HOT RELOADING FEATURE
 - Setting ENABLE_LOCAL_LIB_HOT_RELOAD to true will connect this app directly to the local library and
   enable hot reload
*/
const ENABLE_LOCAL_LIB_HOT_RELOAD = false
/* COMPONENTS_LIBRARY_PATH
 - Set your local path to the component library
*/
const COMPONENTS_LIBRARY_PATH = '../../module-component'


module.exports = ({ env }) => {
    const isProductionBuild = process.env.NODE_ENV === "production"
    const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE
        ? "server" : "json";
	const externalLibraryResolver = {
				react: path.resolve(__dirname, "../node_modules/react"),
				"react-dom": path.resolve(__dirname, "../node_modules/react-dom"),
				"react-redux": path.resolve(__dirname, "../node_modules/react-redux"),
				"@opentalk/notistack": path.resolve(__dirname, "../node_modules/@opentalk/notistack"),
				"@opentalk/common": path.resolve(__dirname, "../node_modules/@opentalk/common"),
				"@mui/styles": path.resolve(__dirname, "../node_modules/@mui/styles"),
				"@mui/material": path.resolve(__dirname, "../node_modules/@mui/material"),
				"react-i18next": path.resolve(__dirname, "../node_modules/react-i18next"),
				"@opentalk/components": path.resolve(__dirname, COMPONENTS_LIBRARY_PATH)
	}

    return {
        plugins: [
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
			alias: !isProductionBuild && ENABLE_LOCAL_LIB_HOT_RELOAD ?  externalLibraryResolver : {},
			configure: webpackConfig => {
				const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
				({ constructor }) => constructor && constructor.name === "ModuleScopePlugin",
				);

				webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

				webpackConfig.module.rules.push({
					test: /\.tsx?$/,
					loader: 'ts-loader',
					exclude: /node_modules/,
					options: {
						transpileOnly: true,
						configFile: 'tsconfig.json',
					},
				})

				return webpackConfig;
			},
        },
		jest: {
			configure: (jestConfig) => {
				jestConfig.moduleNameMapper = { "@mui/styled-engine": "<rootDir>/node_modules/@mui/styled-engine"};
				return jestConfig;
			}
		}
    };

};
