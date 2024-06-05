module.exports = {
    verbose: true,
    maxWorkers: '50%',
    coverageReporters: ['cobertura', 'lcov', 'json', 'text'],
    reporters: ['default', 'jest-junit'],
    collectCoverageFrom: [
        'packages/**/*.{ts,js,jsx,tsx}',
        'app/**/*.{ts,js,jsx,tsx}',
        '!packages/notistack/**',
        '!**/node_modules/**',
        '!**/assets/**',
        '!**/types/**',
        '!**/dist/**',
        '!**/build/**',
        '!**/public/**',
        '!**/devPublic/**',
        '!**/tests/**',
        '!**/test/**',
        '!**/example/**',
        '!**/stories/**',
        '!**/hotReload/**',
        '!**/.storybook/**',
        '!**/coverage/**',
        '!**/__tests__/**',
        '!**/craco.config.js',
        '!**/*.test.*',
        '!**/*.d.ts',
        '!**/setupTests.{ts,js}',
        '!**/.eslintrc.{ts,js,cjs}',
        '!**/babel.config.cjs',
        '!**/rollup.config.js',
        '!**/banner.js',
        '!**/tsHelper.ts',
        '!**/setupProxy.ts',
        '!**/reportWebVitals.ts',
        '!**/glitchtip.ts',
    ],
    projects: [
        {
            displayName: 'app',
            testEnvironment: 'jsdom',
            roots: ['<rootDir>/app/src'],
            setupFiles: [
                '<rootDir>/jest.config.js',
                '<rootDir>/node_modules/react-app-polyfill/jsdom.js'
            ],
            setupFilesAfterEnv: [ '<rootDir>/app/src/setupTests.ts' ],
            testMatch: ['<rootDir>/app/src/**/?(*.)+(spec|test).[jt]s?(x)'],
            modulePathIgnorePatterns: ['<rootDir>/packages/*'],
            moduleDirectories: ['node_modules', '../app/node_modules'],
            moduleNameMapper: {
                '\\.(png|jpg|webp|ttf|woff|woff2|mp4)$': '<rootDir>/mocks/fileMock.js',
                '@mui/styled-engine': '<rootDir>/app/node_modules/@mui/styled-engine'
            },
            modulePaths: [],
            transformIgnorePatterns: [
                '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs|cjs|ts|tsx)$',
                '^.+\\.module\\.(css|sass|scss)$'
            ],
            resetMocks: true,
        },
        {
            displayName: 'packages/common',
            testEnvironment: 'jsdom',
            setupFilesAfterEnv: ['./packages/common/setupTests.ts'],
            testMatch: ['<rootDir>/packages/common/**/?(*.)+(spec|test).[jt]s?(x)'],
            moduleDirectories: ['node_modules', '../app/node_modules'],
        },
        {
            displayName: 'packages/fluent_conv',
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/packages/fluent_conv/**/?(*.)+(spec|test).[jt]s?(x)'],
        },
        {
            displayName: 'packages/i18next-fluent',
            testEnvironment: 'jsdom',
            testMatch: ['<rootDir>/packages/i18next-fluent/**/?(*.)+(spec|test).[jt]s?(x)'],
        },
        {
            displayName: 'packages/rtk-rest-api',
            testEnvironment: 'jsdom',
            setupFilesAfterEnv: ['./packages/rtk-rest-api/src/setupTests.js'],
            testMatch: ['<rootDir>/packages/rtk-rest-api/**/?(*.)+(spec|test).[jt]s?(x)'],
        }
    ]
}
