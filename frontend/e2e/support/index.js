// frontend/e2e/support/index.js
/* global Cypress */

// Import custom Cypress commands
import './commands'

// Optionally, set up global configurations similar to src/setupTests.js

// Example: Mock console.log globally to prevent cluttering test output
Cypress.on('window:before:load', (window) => {
  // Override the console.log method
  window.console.log = () => {}
})

// If you need to load environment variables from a specific file,
// consider configuring Cypress.env in the Cypress configuration files instead of using dotenv here.
