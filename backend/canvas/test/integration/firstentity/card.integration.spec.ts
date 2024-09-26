// test/integration/firstentity/card.integration.spec.ts

import { INestApplication } from '@nestjs/common';
import {
  initializeTestApp,
  getCanvasRepository,
  getCardRepository,
} from '../../setup';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Card } from '../../../src/firstentity/entities/card.entity';
import { Canvas } from '../../../src/firstentity/entities/canvas.entity';

describe('CardModule Integration Tests', () => {
  let app: INestApplication;
  let cardRepository: Repository<Card>;
  let canvasRepository: Repository<Canvas>;

  beforeAll(async () => {
    app = await initializeTestApp();
    cardRepository = getCardRepository();
    canvasRepository = getCanvasRepository();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /cards', () => {
    it('should create a new card', async () => {
      // Step 1: Create a new canvas to associate with the card
      const canvas = await canvasRepository.save({
        name: 'Canvas for Card Creation',
        // Add other necessary properties if any
      });

      const newCard = {
        title: 'Integration Test Card',
        content: 'This is a card created during an integration test.',
        canvasId: canvas.id, // Use the created canvas's ID
        positionX: 100,
        positionY: 150,
        width: 200,
        height: 100,
        createdAt: new Date(),
      };

      const response = await request(app.getHttpServer())
        .post('/cards')
        .send(newCard)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        title: newCard.title,
        content: newCard.content,
        canvasId: newCard.canvasId,
        positionX: newCard.positionX,
        positionY: newCard.positionY,
        width: newCard.width,
        height: newCard.height,
      });

      // Verify the card exists in the database
      const savedCard = await cardRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedCard).toBeDefined();
      expect(savedCard.title).toBe(newCard.title);

      // Cleanup: Delete the created card and canvas
      await cardRepository.delete(savedCard.id);
      await canvasRepository.delete(canvas.id);
    });

    it('should fail to create a card with invalid data', async () => {
      // Step 1: Create a canvas to associate with the card
      const canvas = await canvasRepository.save({
        name: 'Canvas for Invalid Card Creation',
        // Add other necessary properties if any
      });

      const invalidCard = {
        // Missing required fields like title, positionX, etc.
        content: 'Missing title and other required fields.',
        canvasId: canvas.id,
        // positionX, positionY, width, height, createdAt are missing
      };

      const response = await request(app.getHttpServer())
        .post('/cards')
        .send(invalidCard)
        .expect(400);

      expect(response.body.message).toEqual(
        expect.arrayContaining([
          expect.stringContaining('title should not be empty'),
          expect.stringContaining(
            'positionX must be a number conforming to the specified constraints',
          ),
          expect.stringContaining(
            'positionY must be a number conforming to the specified constraints',
          ),
          expect.stringContaining(
            'width must be a number conforming to the specified constraints',
          ),
          expect.stringContaining(
            'height must be a number conforming to the specified constraints',
          ),
          expect.stringContaining('createdAt should not be empty'),
          expect.stringContaining('createdAt must be a Date instance'),
        ]),
      );
      // Add more assertions based on your validation rules if any

      // Cleanup: Delete the created canvas
      await canvasRepository.delete(canvas.id);
    });
  });

  describe('GET /cards', () => {
    it('should retrieve all cards', async () => {
      // Step 1: Create a new canvas and card to ensure at least one card exists
      const canvas = await canvasRepository.save({
        name: 'Canvas for Retrieving Cards',
        // Add other necessary properties if any
      });

      const card = await cardRepository.save({
        title: 'Card for Retrieval',
        content: 'This card is created to test retrieval.',
        canvasId: canvas.id,
        positionX: 50,
        positionY: 75,
        width: 150,
        height: 100,
        createdAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .get('/cards')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);

      // Cleanup: Delete the created card and canvas
      await cardRepository.delete(card.id);
      await canvasRepository.delete(canvas.id);
    });
  });

  describe('GET /cards/:id', () => {
    it('should retrieve a single card by ID', async () => {
      // Step 1: Create a new canvas and card
      const canvas = await canvasRepository.save({
        name: 'Canvas for Single Card Retrieval',
        // Add other necessary properties if any
      });

      const card = await cardRepository.save({
        title: 'Card for Single Retrieval',
        content: 'This card is created to test single retrieval.',
        canvasId: canvas.id,
        positionX: 75,
        positionY: 125,
        width: 175,
        height: 125,
        createdAt: new Date(),
      });

      const response = await request(app.getHttpServer())
        .get(`/cards/${card.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: card.id,
        title: card.title,
        content: card.content,
        canvasId: card.canvasId,
        positionX: card.positionX,
        positionY: card.positionY,
        width: card.width,
        height: card.height,
        createdAt: card.createdAt.toISOString(), // Ensure date is correctly formatted
      });

      // Cleanup: Delete the created card and canvas
      await cardRepository.delete(card.id);
      await canvasRepository.delete(canvas.id);
    });

    it('should return 404 for a non-existent card', async () => {
      const nonExistentId = 9999;

      await request(app.getHttpServer())
        .get(`/cards/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /cards/:id', () => {
    it('should update an existing card', async () => {
      // Step 1: Create a new canvas and card
      const canvas = await canvasRepository.save({
        name: 'Canvas for Card Update',
        // Add other necessary properties if any
      });

      const card = await cardRepository.save({
        title: 'Card to Update',
        content: 'This card is created to test updates.',
        canvasId: canvas.id,
        positionX: 60,
        positionY: 90,
        width: 160,
        height: 110,
        createdAt: new Date(),
      });

      const updateData = {
        title: 'Updated Integration Test Card',
        content: 'Updated content.',
      };

      const response = await request(app.getHttpServer())
        .put(`/cards/${card.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: card.id,
        title: updateData.title,
        content: updateData.content,
      });

      // Verify the update in the database
      const updatedCard = await cardRepository.findOne({
        where: { id: card.id },
      });
      expect(updatedCard.title).toBe(updateData.title);
      expect(updatedCard.content).toBe(updateData.content);

      // Cleanup: Delete the created card and canvas
      await cardRepository.delete(card.id);
      await canvasRepository.delete(canvas.id);
    });

    it('should return 404 when updating a non-existent card', async () => {
      const nonExistentId = 9999;
      const updateData = {
        title: 'Non-existent Card',
      };

      await request(app.getHttpServer())
        .put(`/cards/${nonExistentId}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /cards/:id', () => {
    it('should delete an existing card', async () => {
      // Step 1: Create a new canvas and card
      const canvas = await canvasRepository.save({
        name: 'Canvas for Card Deletion',
        // Add other necessary properties if any
      });

      const card = await cardRepository.save({
        title: 'Card to Delete',
        content: 'This card is created to test deletion.',
        canvasId: canvas.id,
        positionX: 80,
        positionY: 120,
        width: 180,
        height: 130,
        createdAt: new Date(),
      });

      // Step 2: Attempt to delete the card
      await request(app.getHttpServer())
        .delete(`/cards/${card.id}`)
        .expect(200);

      // Step 3: Verify the card is deleted
      const deletedCard = await cardRepository.findOne({
        where: { id: card.id },
      });
      expect(deletedCard).toBeNull();

      // Cleanup: Delete the canvas
      await canvasRepository.delete(canvas.id);
    });

    it('should return 404 when deleting a non-existent card', async () => {
      const nonExistentId = 9999;

      await request(app.getHttpServer())
        .delete(`/cards/${nonExistentId}`)
        .expect(404);
    });
  });
});
