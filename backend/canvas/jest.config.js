// jest.config.js

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  coverageDirectory: './coverage/unit',
  testEnvironment: 'node',
  // Exclude integration tests from unit test runs
  testPathIgnorePatterns: ['/test/integration/'],
};
