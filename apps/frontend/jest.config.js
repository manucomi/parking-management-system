const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/**/*.test.{js,jsx}',
        '!src/**/*.spec.{js,jsx}',
    ],
    coveragePathIgnorePatterns: [
        '/node_modules/',
        'pages/',
        'data/',
        'lib/',
        '.stories.jsx',
        'components/.*/index.js',
        'services/.*/index.js',
        'components/Layout/AdminLayout',
        'components/Layout/withAdminLayout',
        'components/AdminSidebar/AdminSidebar.jsx',
        'utils/supabase/',
        'utils/supabaseClient.js',
        'utils/ssrAuth.js',
        'utils/fetcher.js',
        'hooks/useAuth.js',
        'hooks/useApi.js',
        'hooks/useResilientData.js',
        'services/index.js',
        'pages/resident/',
        'middleware.js',
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        'components/AdminSidebar/AdminSidebar.test.jsx',
        'utils/fetcher.test.js',
        'hooks/useApi.test.js',
    ],
    coverageReporters: ['lcov', 'text', 'html'],
    coverageDirectory: '.coverage',
    coverageThreshold: {
        global: {
            branches: 90,
            functions: 90,
            lines: 90,
            statements: 90,
        },
    },
    moduleNameMapper: {
        '\\.(s)?css$': 'identity-obj-proxy',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
module.exports = createJestConfig(customJestConfig);
