const nextJest = require('next/jest');

const createJestConfig = nextJest({
    dir: './',
});

const customJestConfig = {
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.{js,jsx}'],
    coveragePathIgnorePatterns: [
        'pages/',
        '.stories.jsx',
        'components/.*index.js',
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
        '^test-helpers/(.*)': '<rootDir>/tests/helpers/$1',
        '^services/(.*)$': '<rootDir>/src/services/$1',
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
module.exports = createJestConfig(customJestConfig);
