// jest.config.js

module.exports = {
  // Define the root directories for Jest to scan
  roots: ['<rootDir>/src'],
  
  // Specify file extensions Jest should process
  moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
  // Transform settings using babel-jest for JS and JSX files
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  
  // Ignore transforming all node_modules except for react-markdown
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown)/)',
  ],
  
  // Setup files after the testing environment is set up
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
  // Mock static assets like CSS modules and react-markdown
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react-markdown$': '<rootDir>/node_modules/react-markdown/__mocks__/index.js',
    '^react-markdown/(.*)$': '<rootDir>/node_modules/react-markdown/__mocks__/index.js', // Handle subpaths
  },

  // Specify the test environment (optional, defaults to 'jsdom')
  testEnvironment: 'jsdom',
};
