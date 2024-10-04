/// <reference types="cypress" />

// Ensure Cypress is globally available
/* global cy */

// Ensure Cypress is globally available
/* global Cypress */

describe('App E2E', () => {
  beforeEach(() => {
    // Navigate to the app after setting up intercept
    cy.visit('http://localhost:3000');
  });

  it('should load the app and display the canvas', () => {
    // Check if the main container is present
    cy.get('div.bg-gray-200').should('be.visible');

    // Check if the Canvas component is rendered
    cy.get('[data-testid="canvas-component"]').should('be.visible');
  });

  it('should display at least one canvas', () => {
    // Wait for the canvas to load
    cy.get('[data-testid="canvas-component"]').should('be.visible');

    // Check if at least one canvas is displayed
    cy.get('[data-testid^="canvas-"]').should('have.length.greaterThan', 0);
  });

  it('should display cards within the canvas', () => {
    // Wait for the canvas to load
    cy.get('[data-testid="canvas-component"]').should('be.visible');

    // Check if at least one card is displayed
    cy.get('[data-testid^="card-"]').should('have.length.greaterThan', 0);
  });

  it('should handle errors gracefully', () => {
    // Intercept API calls and simulate an error before the app loads
    cy.intercept('GET', '**/api/canvases', {
      statusCode: 500,
      body: { error: 'Internal Server Error' }
    }).as('getCanvases');

    // Visit the app after setting up the intercept
    cy.visit('http://localhost:3000');

    // Wait for the API call to ensure the intercept works
    cy.wait('@getCanvases');

    // Log the current HTML to the Cypress console
    cy.document().then((doc) => {
      cy.log(doc.body.innerHTML);
    });

    // Check if an error message is displayed
    cy.contains('Error loading canvases').should('be.visible');
  });

  it('should use the correct API URL from environment variables', () => {
    // Get the API URL from the environment variable
    const apiUrl = Cypress.env('API_BASE_URL'); // Changed from REACT_APP_API_URL to API_BASE_URL
    expect(apiUrl).to.not.be.undefined;

    // Intercept API calls and check if they use the correct URL
    cy.intercept(`${apiUrl}/**`).as('apiCall'); // Updated to use API_BASE_URL

    // Trigger a canvas load to make an API call
    cy.reload();

    // Wait for the API call and check the URL
    cy.wait('@apiCall').its('request.url').should('include', apiUrl);
  });
});
