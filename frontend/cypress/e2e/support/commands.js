/// <reference types="cypress" />

/* global cy */

/* global Cypress */

// Import necessary services if needed for custom commands
// Note: Typically, in Cypress, API interactions are handled via cy.request or cy.intercept

// Custom command to load canvases and select the first one
Cypress.Commands.add('loadAndSelectCanvas', () => {
  cy.intercept('GET', '**/canvases').as('fetchCanvases');
  cy.visit('/');
  cy.wait('@fetchCanvases').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
    const canvases = interception.response.body;
    if (canvases.length > 0) {
      cy.get(`[data-testid="canvas-item-${canvases[0].id}"]`).click();
      cy.wrap(canvases[0].id).as('selectedCanvasId');
    }
  });
});

// Custom command to create a new card on the canvas
Cypress.Commands.add('createNewCard', (title = 'New Card', content = '# New Card\n\nClick to edit') => {
  cy.get('[data-testid="canvas-area"]').dblclick((event) => {
    // Calculate click coordinates relative to the canvas
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Store coordinates for assertion if needed
    cy.wrap({ x, y }).as('newCardPosition');
  });

  // Intercept the POST request to create a card
  cy.intercept('POST', '**/cards').as('createCard');

  // Trigger the double-click event at a specific position
  cy.get('[data-testid="canvas-area"]').trigger('dblclick', {
    clientX: 100,
    clientY: 100,
  });

  cy.wait('@createCard').then((interception) => {
    expect(interception.response.statusCode).to.eq(201);
    const newCard = interception.response.body;
    cy.wrap(newCard).as('newCard');
  });
});

// Custom command to update a card's content
Cypress.Commands.add('updateCardContent', (cardId, newContent) => {
  cy.intercept('PUT', `**/cards/${cardId}`).as('updateCard');

  cy.get(`[data-testid="single-card"][data-id="${cardId}"] [data-testid="card-content"]`)
    .dblclick()
    .type('{selectall}{backspace}')
    .type(newContent)
    .blur();

  cy.wait('@updateCard').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
    const updatedCard = interception.response.body;
    expect(updatedCard.content).to.equal(newContent);
  });
});

// Custom command to delete a card
Cypress.Commands.add('deleteCard', (cardId) => {
  cy.intercept('DELETE', `**/cards/${cardId}`).as('deleteCard');

  cy.get(`[data-testid="single-card"][data-id="${cardId}"] [data-testid="delete-button"]`)
    .click();

  cy.wait('@deleteCard').then((interception) => {
    expect(interception.response.statusCode).to.eq(200);
  });

  // Assert the card is no longer in the DOM
  cy.get(`[data-testid="single-card"][data-id="${cardId}"]`).should('not.exist');
});

// Custom command to toggle the sidebar
Cypress.Commands.add('toggleSidebar', () => {
  cy.get('[data-testid="sidebar-toggle-button"]').click();
  cy.get('[data-testid="sidebar"]').should('have.class', 'hidden').or('not.exist');
});

// Custom command to drag a card to a new position
Cypress.Commands.add('dragCard', (cardId, deltaX, deltaY) => {
  cy.get(`[data-testid="single-card"][data-id="${cardId}"] [data-testid="card-header"]`)
    .trigger('mousedown', { which: 1, pageX: 0, pageY: 0 });

  cy.get('body')
    .trigger('mousemove', { clientX: deltaX, clientY: deltaY })
    .trigger('mouseup');
  
  // Optionally, verify the new position
  cy.get(`[data-testid="single-card"][data-id="${cardId}"]`).should(($card) => {
    const left = parseInt($card.css('left'), 10);
    const top = parseInt($card.css('top'), 10);
    expect(left).to.be.greaterThan(0);
    expect(top).to.be.greaterThan(0);
  });
});

// Custom command to reset the database (if an API endpoint exists)
Cypress.Commands.add('resetDatabase', () => {
  cy.request('POST', '/api/testing/reset');
});

// Example usage of the above commands in tests
// This section is optional and provided for context

// describe('Canvas and Card Functionality', () => {
//   beforeEach(() => {
//     cy.resetDatabase();
//     cy.loadAndSelectCanvas();
//   });

//   it('should create a new card', () => {
//     cy.createNewCard().then((newCard) => {
//       cy.get(`[data-testid="single-card"][data-id="${newCard.id}"]`).should('exist');
//     });
//   });

//   it('should update a card\'s content', () => {
//     cy.createNewCard().then((newCard) => {
//       cy.updateCardContent(newCard.id, 'Updated Content');
//     });
//   });

//   it('should delete a card', () => {
//     cy.createNewCard().then((newCard) => {
//       cy.deleteCard(newCard.id);
//     });
//   });

//   it('should toggle the sidebar', () => {
//     cy.toggleSidebar();
//   });

//   it('should drag a card to a new position', () => {
//     cy.createNewCard().then((newCard) => {
//       cy.dragCard(newCard.id, 50, 50);
//     });
//   });
// });

