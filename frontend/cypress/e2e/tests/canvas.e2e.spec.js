// frontend/e2e/tests/canvas.e2e.spec.js

/// <reference types="cypress" />

// Ensure Cypress is globally available
/* global cy */

// Ensure Cypress is globally available
/* global Cypress */

describe('Canvas E2E Tests', () => {
    const apiUrl = Cypress.env('API_BASE_URL') || 'http://localhost:3001';

    beforeEach(() => {
        cy.clearLocalStorage(); // Clear any stored data

        // Mock canvases
        const mockCanvases = [
            { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
            { id: 2, name: 'Canvas 2', createdAt: '2023-10-02T00:00:00Z' },
        ];

        // Mock GET /canvases
        cy.intercept('GET', `${apiUrl}/canvases`, (req) => {
            console.log('Intercepted GET /canvases');
            req.reply({
                statusCode: 200,
                body: mockCanvases,
            });
        }).as('getCanvases');

        // Mock GET /cards for any canvasId
        cy.intercept('GET', `${apiUrl}/cards?canvasId=*`, (req) => {
            console.log(`Intercepted GET /cards?canvasId=${req.query.canvasId}`);
            req.reply({
                statusCode: 200,
                body: [],
            });
        }).as('getCards');

        // Add network request spy for POST /cards
        cy.intercept('POST', `${apiUrl}/cards`).as('createCard');

        // Visit the Canvas page
        cy.visit('/canvas');

        // Wait for canvases and initial cards to load
        cy.wait(['@getCanvases', '@getCards']).then(() => {
            // Ensure that canvasId=1 is selected
            cy.get('[data-testid="canvas-item-1"]').click();
        });
    });

    it('should display the sidebar with canvases', () => {
        cy.get('[data-testid="sidebar"]').should('be.visible');
        cy.get('[data-testid="canvas-list"]').within(() => {
            cy.get('[data-testid^="canvas-item-"]').should('have.length', 2);
            cy.contains('Canvas 1').should('have.class', 'bg-blue-200');
            cy.contains('Canvas 2').should('not.have.class', 'bg-blue-200');
        });
    });

    it('should toggle the sidebar open and close', () => {
        // Sidebar should be visible initially
        cy.get('[data-testid="sidebar"]').should('be.visible');

        // Click the toggle button to close sidebar
        cy.get('[data-testid="sidebar-toggle-button"]').click();

        // Sidebar should be hidden
        cy.get('[data-testid="sidebar"]').should('not.exist');

        // Click the toggle button to open sidebar again
        cy.get('[data-testid="sidebar-toggle-button"]').click();

        // Sidebar should be visible again
        cy.get('[data-testid="sidebar"]').should('be.visible');
    });

    it('should create a new card on double-click', () => {
        // Variables to hold expected positions
        let expectedX;
        let expectedY;

        // Get the bounding rect and calculate expected positionX and positionY
        cy.get('[data-testid="canvas-area"]').then($canvasArea => {
            const rect = $canvasArea[0].getBoundingClientRect();
            expectedX = 150 - rect.left;
            expectedY = 200 - rect.top;
            console.log('Test - rect.top:', rect.top);
            console.log('Test - expectedX:', expectedX);
            console.log('Test - expectedY:', expectedY);
        }).then(() => {
            // Double-click on the canvas area at specific coordinates
            cy.get('[data-testid="canvas-area"]').click({ clickCount: 2, clientX: 150, clientY: 200 });

            // Wait for the POST request to complete
            cy.wait('@createCard').then((interception) => {
                console.log('Intercepted request:', interception);
                expect(interception.response.statusCode).to.equal(201);
            });

            // Verify the new card appears in the DOM
            cy.get('[data-testid="cards-container"]')
                .within(() => {
                    cy.get('[data-testid="single-card"]').should('have.length', 1);
                    cy.contains('New Card').should('be.visible');
                });
        });
    });

    it('should delete a card from the display', () => {
        // First, create a card to delete
        const cardToDelete = {
            id: 102,
            title: 'Card to Delete',
            content: 'Content of Card to Delete',
            positionX: 200,
            positionY: 250,
            width: 200,
            height: 150,
            canvasId: 1,
            createdAt: '2023-10-06T00:00:00Z',
        };

        // Mock GET /cards for Canvas 1 with one card
        cy.intercept('GET', `${apiUrl}/cards?canvasId=1`, {
            statusCode: 200,
            body: [cardToDelete],
        }).as('getCardsCanvas1WithCard');

        // Reload the page to load the card
        cy.visit('/canvas');
        cy.wait(['@getCanvases', '@getCardsCanvas1WithCard']).then(() => {
            // Ensure the card is displayed
            cy.get('[data-testid="cards-container"]')
                .within(() => {
                    cy.get('[data-testid="single-card"]').should('have.length', 1);
                    cy.contains('Card to Delete').should('be.visible');
                });
        });

        // Ensure the card is displayed
        cy.get('[data-testid="cards-container"]')
            .within(() => {
                cy.get('[data-testid="single-card"]').should('have.length', 1);
                cy.contains('Card to Delete').should('be.visible');
            });

        // Mock DELETE /cards/102
        cy.intercept('DELETE', `${apiUrl}/cards/${cardToDelete.id}`, {
            statusCode: 200,
            body: {},
        }).as('deleteCard');

        // Click the delete button within the card
        cy.get('[data-testid="single-card"]')
            .within(() => {
                cy.get('[data-testid="delete-button"]').click();
            });

        // Wait for the DELETE request to complete
        cy.wait('@deleteCard').then(() => {
            // Verify the card is removed from the DOM
            cy.get('[data-testid="cards-container"]')
                .within(() => {
                    cy.get('[data-testid="single-card"]').should('have.length', 0);
                });
        });

        // Verify the card is removed from the DOM
        cy.get('[data-testid="cards-container"]')
            .within(() => {
                cy.get('[data-testid="single-card"]').should('have.length', 0);
            });
    });

    it('should drag the canvas area and update the offset', () => {
        // Mock GET /canvases and /cards
        cy.intercept('GET', `${apiUrl}/canvases`, {
            statusCode: 200,
            body: [
                { id: 1, name: 'Canvas 1', createdAt: '2023-10-01T00:00:00Z' },
            ],
        }).as('getCanvases');

        cy.intercept('GET', `${apiUrl}/cards?canvasId=1`, {
            statusCode: 200,
            body: [],
        }).as('getCardsCanvas1');

        // Visit the Canvas page
        cy.visit('/canvas');
        cy.wait(['@getCanvases', '@getCardsCanvas1']).then(() => {
            // Add any necessary actions to be performed after the wait
        });

        // Find the cards container
        cy.get('[data-testid="cards-container"]').as('cardsContainer');

        // Log initial transform
        cy.get('@cardsContainer').should('have.css', 'transform', 'matrix(1, 0, 0, 1, 0, 0)');

        // Perform drag
        cy.get('@cardsContainer')
            .trigger('mousedown', { which: 1, clientX: 100, clientY: 100 })
            .trigger('mousemove', { clientX: 150, clientY: 150 })
            .trigger('mouseup');

        // Assert that the transform has been updated
        cy.get('@cardsContainer')
            .should('have.attr', 'style')
            .and('match', /transform: translate\(50px, 50px\)/);
    });

    it('should switch between canvases when a different canvas is selected', () => {
        // Mock GET /cards for Canvas 2
        const mockCardsCanvas2 = [
            {
                id: 103,
                title: 'Canvas 2 Card',
                content: 'Content for Canvas 2',
                positionX: 300,
                positionY: 350,
                width: 200,
                height: 150,
                canvasId: 2,
                createdAt: '2023-10-07T00:00:00Z',
            },
        ];

        cy.intercept('GET', `${apiUrl}/cards?canvasId=2`, {
            statusCode: 200,
            body: mockCardsCanvas2,
        }).as('getCardsCanvas2');

        // Click on the second canvas in the sidebar
        cy.get('[data-testid="canvas-item-2"]').click();

        // Wait for the cards to load for Canvas 2
        cy.wait('@getCardsCanvas2').then(() => {
            // Add any necessary actions to be performed after the wait
        });

        // Verify that Canvas 2 is selected
        cy.get('[data-testid="canvas-item-2"]').should('have.class', 'bg-blue-200');
        cy.get('[data-testid="canvas-item-1"]').should('not.have.class', 'bg-blue-200');

        // Verify that the card for Canvas 2 is displayed
        cy.get('[data-testid="cards-container"]')
            .within(() => {
                cy.get('[data-testid="single-card"]').should('have.length', 1);
                cy.contains('Canvas 2 Card').should('be.visible');
            });
    });

    it('should render all canvas elements correctly', () => {
        // Check for the main canvas component
        cy.get('[data-testid="canvas-component"]').should('be.visible');

        // Check for the canvas element
        cy.get('[data-testid="canvas-element"]').should('be.visible');

        // Check for the move icon container
        cy.get('[data-testid="move-icon-container"]').should('be.visible');

        // The error message should not be visible by default
        cy.get('[data-testid="error-message"]').should('not.exist');
    });

    it('should display error message when loading fails', () => {
        // Mock a failed API call
        cy.intercept('GET', `${apiUrl}/canvases`, {
            statusCode: 500,
            body: { error: 'Server error' }
        }).as('getCanvasesFailed');

        // Visit the Canvas page
        cy.visit('/canvas');

        // Wait for the failed request
        cy.wait('@getCanvasesFailed');

        // Check if the error message is displayed
        cy.get('[data-testid="error-message"]').should('be.visible');
    });
});