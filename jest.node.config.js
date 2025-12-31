/**
 * Jest Configuration for Node.js Tests
 *
 * Configuração separada para testes que rodam em ambiente Node.js
 * (agents, services, utils que não usam APIs de browser)
 *
 * Uso: npm run test:node
 */

const { pathsToModuleNameMapper } = require('ts-jest');

/** @type {import('jest').Config} */
module.exports = {
    displayName: 'node',
    testEnvironment: 'node',
    preset: 'ts-jest',

    // Roots a serem testados
    roots: ['<rootDir>/lib'],

    // Match apenas testes que explicitamente declarem @jest-environment node
    // ou que estejam em pastas específicas
    testMatch: [
        '<rootDir>/lib/agents/**/*.test.ts',
        '<rootDir>/lib/shared/utils/**/*.test.ts',
        '<rootDir>/lib/shared/adapters/**/*.test.ts',
    ],

    // Module aliases
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
    },

    // Transformações
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                useESM: false,
                tsconfig: 'tsconfig.json',
            },
        ],
    },

    // Setup mínimo para Node.js (sem window mocks)
    setupFilesAfterEnv: ['<rootDir>/jest.node.setup.js'],

    // Ignorar node_modules
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],

    // Coverage
    collectCoverageFrom: [
        'lib/agents/**/*.ts',
        'lib/shared/utils/**/*.ts',
        '!**/*.d.ts',
        '!**/__tests__/**',
    ],

    // Verbose output
    verbose: true,
};
