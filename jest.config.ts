import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true, // Enables code coverage reporting
  coverageProvider: "v8", // Use V8 as the provider for coverage
  testEnvironment: 'jsdom', // Simulates a browser-like environment for React components
  moduleDirectories: ['node_modules', '<rootDir>/src'], // Includes 'src' for resolving modules
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // Mock CSS/SASS module imports
    '^@/(.*)$': '<rootDir>/src/$1', // Maps `@/` alias to `src/` directory
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Includes any custom Jest setup
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/', // Ignore dependencies
    '<rootDir>/.next/', // Ignore built Next.js files
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest', // Transforms JS/TS files using Babel
  },
};

export default config;

