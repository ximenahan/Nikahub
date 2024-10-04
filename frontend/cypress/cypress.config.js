const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 720,
  video: false,
  screenshotOnRunFailure: false,

  env: {
    REACT_APP_API_URL: "http://localhost:3000/api",
    API_BASE_URL: "http://localhost:3001" // Added API_BASE_URL
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'e2e/tests/**/*.e2e.spec.js', // Ensure this matches your test files
    supportFile: 'e2e/support/index.js',
  },

  fixturesFolder: false,

  retries: {
    runMode: 2,
    openMode: 0,
  },
});
