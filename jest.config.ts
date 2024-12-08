import type { Config } from 'jest';

const config: Config = {
  collectCoverage: true,
  coverageProvider: "v8",
  testEnvironment: 'jsdom',
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|scss|sass)$': 'identity-obj-proxy', // Mock CSS imports
    '^@/(.*)$': '<rootDir>/src/$1', // Alias for absolute imports
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Move jest-fetch-mock to this setup
  testPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/.next/'],
};

export default config;
