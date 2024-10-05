/* eslint-disable testing-library/await-async-utils */
/// <reference types="cypress" />

// Import Cypress
/* global cy */

describe('SingleCard E2E Tests', () => {
  const mockCard = {
    id: 201,
    title: 'E2E Test Card',
    content: 'Initial Content for E2E Test',
    positionX: 100,
    positionY: 150,
    width: 200,
    height: 150,
    canvasId: 1, // Ensure this matches the mocked canvas id
    createdAt: new Date('2023-10-05T00:00:00Z').toISOString(),
  };

  beforeEach(() => {
    // Define the API URL using the environment variable
    const apiUrl = Cypress.env('API_BASE_URL') || 'http://localhost:3001';

    // 1. Intercept GET /canvases to return a single canvas with id=1
    cy.intercept('GET', `${apiUrl}/canvases`, {
      statusCode: 200,
      body: [
        { id: 1, name: 'Test Canvas' },
      ],
    }).as('getCanvases');

    // 2. Intercept GET /cards?canvasId=1 to return [mockCard]
    cy.intercept('GET', `${apiUrl}/cards?canvasId=${mockCard.canvasId}`, {
      statusCode: 200,
      body: [mockCard],
    }).as('getCards');

    // 3. Intercept PUT /cards/201 to handle card updates
    cy.intercept('PUT', `${apiUrl}/cards/${mockCard.id}`, (req) => {
      // Update the mockCard with the request payload
      Object.assign(mockCard, req.body);
      req.reply({
        statusCode: 200,
        body: mockCard,
      });
    }).as('updateCard');

    // 4. Intercept DELETE /cards/201 to handle card deletion
    cy.intercept('DELETE', `${apiUrl}/cards/${mockCard.id}`, {
      statusCode: 200,
      body: {},
    }).as('deleteCard');

    // 5. Visit the root path where the Canvas component is rendered
    cy.visit('/');

    // 6. Wait for /canvases to be fetched and selected
    cy.wait('@getCanvases');

    // 7. Wait for /cards?canvasId=1 to be fetched
    cy.wait('@getCards');

    // 8. Ensure the SingleCard component is visible
    cy.get(`[data-testid="card-${mockCard.id}"]`).should('be.visible');
  });

  it('should render the SingleCard component with correct content', () => {
    // Select the specific card using its data-testid
    cy.get(`[data-testid="card-${mockCard.id}"]`)
      .should('be.visible')
      .and('have.css', 'left', `${mockCard.positionX}px`)
      .and('have.css', 'top', `${mockCard.positionY}px`)
      .and('have.css', 'width', `${mockCard.width}px`)
      .and('have.css', 'height', `${mockCard.height}px`);

    // Check the header content
    cy.get('[data-testid="card-header"]').contains('Drag Me');

    // Check the card content
    cy.get('[data-testid="card-content"]').should('contain', mockCard.content);
  });

  it('should enter edit mode on double-click and update content on blur', () => {
    // Double-click to enter edit mode
    cy.get('[data-testid="card-content"]').dblclick();

    // Ensure the textarea is visible, clear it, type new content, and blur
    cy.get('[data-testid="card-textarea"]')
      .should('be.visible')
      .clear()
      .type('Updated Content for E2E Test')
      .blur();

    // Wait for the updateCard intercept and verify the request body
    cy.wait('@updateCard').then((interception) => {
      expect(interception.request.body.content).to.eq('Updated Content for E2E Test');
    });

    // Verify that the card content has been updated in the UI
    cy.get('[data-testid="card-content"]').should('contain', 'Updated Content for E2E Test');
  });

  it('should allow dragging the card and update its position', () => {
    cy.get(`[data-testid="card-${mockCard.id}"]`).then(($card) => {
      const initialX = parseInt($card.css('left'));
      const initialY = parseInt($card.css('top'));

      // Simulate drag by clicking and moving the header
      cy.get('[data-testid="card-header"]')
        .trigger('mousedown', { which: 1, clientX: initialX, clientY: initialY })
        .trigger('mousemove', { clientX: initialX + 50, clientY: initialY + 50 })
        .trigger('mouseup');

      // Wait for the updateCard intercept and verify the request body
      cy.wait('@updateCard').its('request.body').should('include', {
        positionX: initialX + 50,
        positionY: initialY + 50,
      });

      // Verify that the card's position has been updated in the UI
      cy.get(`[data-testid="card-${mockCard.id}"]`)
        .should('have.css', 'left', `${initialX + 50}px`)
        .and('have.css', 'top', `${initialY + 50}px`);
    });
  });

  it('should allow resizing the card and update its dimensions', () => {
    // Trigger mousedown on the resize handle
    cy.get('[data-testid="card-resize-handle"]')
      .trigger('mousedown', { which: 1, clientX: mockCard.width, clientY: mockCard.height });

    // Trigger mousemove and mouseup to simulate resizing
    cy.get('body')
      .trigger('mousemove', { clientX: mockCard.width + 50, clientY: mockCard.height + 50 })
      .trigger('mouseup');

    // Wait for the updateCard intercept and verify the request body
    cy.wait('@updateCard').then((interception) => {
      expect(interception.request.body).to.include({
        width: mockCard.width + 50,
        height: mockCard.height + 50,
      });
    });

    // Verify that the card's dimensions have been updated in the UI
    cy.get(`[data-testid="card-${mockCard.id}"]`)
      .should('have.css', 'width', `${mockCard.width + 50}px`)
      .and('have.css', 'height', `${mockCard.height + 50}px`);
  });

  it('should delete the card when the delete button is clicked', () => {
    // Trigger mouseover to reveal the delete button
    cy.get('[data-testid="card-controls"]').trigger('mouseover');

    // Click the delete button
    cy.get('[data-testid="delete-button"]').click();

    // Wait for the deleteCard intercept and verify the request method
    cy.wait('@deleteCard').its('request.method').should('eq', 'DELETE');

    // Verify that the card no longer exists in the UI
    cy.get(`[data-testid="card-${mockCard.id}"]`).should('not.exist');
  });
});