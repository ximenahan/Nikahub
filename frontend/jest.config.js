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
      '/node_modules/(?!(react-markdown)/)', // Add other ESM modules here if necessary
    ],
    
    // Setup files after the testing environment is set up
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
    
    // Mock static assets like CSS modules
    moduleNameMapper: {
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
      '^react-markdown$': '<rootDir>/node_modules/react-markdown/__mocks__/index.js',
    },
    //This line tells Jest that whenever react-markdown is imported, it should use the mock file located at <rootDir>/node_modules/react-markdown/__mocks__/index.js instead of the actual module.


    // Optionally, you can specify other Jest configurations here
  };
  