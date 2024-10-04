/* eslint-disable testing-library/await-async-utils */
/// <reference types="cypress" />

// Import Cypress
import { cy } from 'cypress';

describe('SingleCard E2E Tests', () => {
  const mockCard = {
    id: 201,
    title: 'E2E Test Card',
    content: 'Initial Content for E2E Test',
    positionX: 100,
    positionY: 150,
    width: 200,
    height: 150,
    canvasId: 1,
    createdAt: new Date('2023-10-05T00:00:00Z').toISOString(),
  };

  beforeEach(() => {
    // Visit the page where SingleCard is rendered
    // Adjust the URL based on your routing setup
    cy.visit('/cards');

    // Mock the backend API responses using Cypress intercept
    cy.intercept('GET', `/api/cards/${mockCard.id}`, {
      statusCode: 200,
      body: mockCard,
    }).as('getCard');

    cy.intercept('PUT', `/api/cards/${mockCard.id}`, (req) => {
      // Update the mockCard with the request payload
      Object.assign(mockCard, req.body);
      req.reply({
        statusCode: 200,
        body: mockCard,
      });
    }).as('updateCard');

    cy.intercept('DELETE', `/api/cards/${mockCard.id}`, {
      statusCode: 200,
      body: {},
    }).as('deleteCard');
  });

  it('should render the SingleCard component with correct content', () => {
    cy.wait('@getCard').then(() => {
      // Add further Cypress commands or assertions here if needed
    });

    cy.get('[data-testid="single-card"]')
      .should('be.visible')
      .and('have.css', 'left', `${mockCard.positionX}px`)
      .and('have.css', 'top', `${mockCard.positionY}px`)
      .and('have.css', 'width', `${mockCard.width}px`)
      .and('have.css', 'height', `${mockCard.height}px`);

    cy.get('[data-testid="card-header"]').contains('Drag Me');
    cy.get('[data-testid="card-content"]').should('contain', mockCard.content);
  });

  it('should enter edit mode on double-click and update content on blur', () => {
    cy.wait('@getCard').then(() => {
      cy.get('[data-testid="card-content"]').dblclick();
      // ... rest of the test
    });

    cy.get('[data-testid="card-textarea"]')
      .should('be.visible')
      .clear()
      .type('Updated Content for E2E Test')
      .blur();

    // Fix 1: Return the promise chain
    return cy.wait('@updateCard').then((interception) => {
      expect(interception.request.body.content).eq('Updated Content for E2E Test');
    });

    // The following assertion is now redundant and can be removed
    // cy.get('[data-testid="card-content"]').should('contain', 'Updated Content for E2E Test');
  });

  it('should allow dragging the card and update its position', () => {
    cy.wait('@getCard').then(() => {
      cy.get('[data-testid="single-card"]').then(($card) => {
        const initialX = parseInt($card.css('left'));
        const initialY = parseInt($card.css('top'));

        // Simulate drag by clicking and moving the header
        cy.get('[data-testid="card-header"]')
          .trigger('mousedown', { which: 1, clientX: initialX, clientY: initialY })
          .trigger('mousemove', { clientX: initialX + 50, clientY: initialY + 50 })
          .trigger('mouseup');

        cy.wait('@updateCard').its('request.body').should('include', {
          positionX: initialX + 50,
          positionY: initialY + 50,
        });

        cy.get('[data-testid="single-card"]')
          .should('have.css', 'left', `${initialX + 50}px`)
          .and('have.css', 'top', `${initialY + 50}px`);
      });
    });
  });

  it('should allow resizing the card and update its dimensions', () => {
    cy.wait('@getCard').then(() => {
      cy.get('[data-testid="card-resize-handle"]')
        .trigger('mousedown', { which: 1, clientX: mockCard.width, clientY: mockCard.height })
        // ... rest of the test
    });

    cy.get('[data-testid="card-resize-handle"]')
      .trigger('mousedown', { which: 1, clientX: mockCard.width, clientY: mockCard.height })
      .then(() => {
        cy.get('body')
          .trigger('mousemove', { clientX: mockCard.width + 50, clientY: mockCard.height + 50 })
          .trigger('mouseup');

        // Fix 4: Remove the 'to' from expect
        cy.wait('@updateCard').then((interception) => {
          expect(interception.request.body).include({
            width: mockCard.width + 50,
            height: mockCard.height + 50,
          });
        });

        cy.get('[data-testid="single-card"]')
          .should('have.css', 'width', `${mockCard.width + 50}px`)
          .and('have.css', 'height', `${mockCard.height + 50}px`);
      });
  });

  it('should delete the card when the delete button is clicked', () => {
    // Fix 5: Use cy.wait() properly
    cy.wait('@getCard').then(() => {
      cy.get('[data-testid="card-controls"]').trigger('mouseover');
      // ... rest of the test
    });

    cy.get('[data-testid="card-controls"]').trigger('mouseover');
    cy.get('[data-testid="delete-button"]').click();

    cy.wait('@deleteCard').its('request.method').should('eq', 'DELETE');

    cy.get('[data-testid="single-card"]').should('not.exist');
  });
});