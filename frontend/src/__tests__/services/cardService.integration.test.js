// cardService.integration.test.js

import {
    fetchCards,
    createCard,
    updateCard,
    deleteCard,
  } from '../../services/cardService';

  describe('Card Service Integration Tests', () => {
    let createdCardId;
    const testCanvasId = 1; // Ensure this canvas exists
  
    test('should fetch all cards', async () => {
      const response = await fetchCards();
      expect(response.status).toBe(200);
      expect(Array.isArray(response.data)).toBe(true);
    });
  
    test('should create a new card', async () => {
      const newCard = {
        canvasId: testCanvasId,
        title: 'Integration Test Card',
        content: 'Test content',
        positionX: 100,
        positionY: 100,
        width: 200,
        height: 150,
      };
      const response = await createCard(newCard);
      expect(response.status).toBe(201);
      expect(response.data.title).toBe(newCard.title);
  
      // Store the ID for later tests
      createdCardId = response.data.id;
    });
  
    test('should update the created card', async () => {
      const updatedCard = { title: 'Updated Test Card' };
      const response = await updateCard(createdCardId, updatedCard);
      expect(response.status).toBe(200);
      expect(response.data.title).toBe(updatedCard.title);
    });
  
    test('should delete the created card', async () => {
      const response = await deleteCard(createdCardId);
      expect(response.status).toBe(200);
  
      // Verify deletion
      const cards = await fetchCards();
      const cardExists = cards.data.some((card) => card.id === createdCardId);
      expect(cardExists).toBe(false);
    });
  });
  