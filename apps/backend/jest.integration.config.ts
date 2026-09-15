import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: 'test/integration/.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  setupFiles: [
    '<rootDir>/src/test/integration/helpers/setup-integration-env.ts',
  ],
  testEnvironment: 'node',
};

export default config;
