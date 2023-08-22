/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.test.json',
        // This disables typechecking but significantly improves performance. Typechecking should be done via the
        // "npm run typecheck" command and doesn't need to happen during test execution.
        isolatedModules: true
      },
    ],
  },
  collectCoverage: true,
  coverageDirectory: 'test/coverage',
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
}
