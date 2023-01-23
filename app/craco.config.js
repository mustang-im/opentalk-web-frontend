// SPDX-FileCopyrightText: OpenTalk GmbH <mail@opentalk.eu>
//
// SPDX-License-Identifier: EUPL-1.2

const CracoEsbuildPlugin = require('craco-esbuild');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = ({ env }) => {
    const isProductionBuild = process.env.NODE_ENV === "production"
    const analyzerMode = process.env.REACT_APP_INTERACTIVE_ANALYZE
        ? "server" : "json";

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
        },
    };
};
