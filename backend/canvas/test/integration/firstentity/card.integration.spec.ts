// test/integration/firstentity/card.integration.spec.ts

import { INestApplication } from '@nestjs/common';
import { initializeTestApp, getCardRepository } from '../../setup';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Card } from '../../../src/firstentity/entities/card.entity';

describe('CardModule Integration Tests', () => {
  let app: INestApplication;
  let cardRepository: Repository<Card>;

  beforeAll(async () => {
    app = await initializeTestApp();
    cardRepository = getCardRepository();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /cards', () => {
    it('should create a new card', async () => {
      const newCard = {
        title: 'Integration Test Card',
        content: 'This is a card created during an integration test.',
        canvasId: 1, // Assuming canvas with ID 1 exists from seed
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
    });

    it('should fail to create a card with invalid data', async () => {
      const invalidCard = {
        content: 'Missing title and other required fields.',
        canvasId: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/cards')
        .send(invalidCard)
        .expect(400);

      expect(response.body.message).toContain('title should not be empty');
      expect(response.body.message).toContain('positionX must be a number');
      // Add more assertions based on your validation rules
    });
  });

  describe('GET /cards', () => {
    it('should retrieve all cards', async () => {
      // Ensure there is at least one card (from seed)
      const response = await request(app.getHttpServer())
        .get('/cards')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /cards/:id', () => {
    it('should retrieve a single card by ID', async () => {
      const card = await cardRepository.findOne({ where: {} });
      expect(card).toBeDefined();

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
      });
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
      const card = await cardRepository.findOne({ where: {} });
      expect(card).toBeDefined();

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
      const card = await cardRepository.findOne({ where: {} });
      expect(card).toBeDefined();

      await request(app.getHttpServer())
        .delete(`/cards/${card.id}`)
        .expect(200);

      // Verify the card is deleted
      const deletedCard = await cardRepository.findOne({
        where: { id: card.id },
      });
      expect(deletedCard).toBeUndefined();
    });

    it('should return 404 when deleting a non-existent card', async () => {
      const nonExistentId = 9999;

      await request(app.getHttpServer())
        .delete(`/cards/${nonExistentId}`)
        .expect(404);
    });
  });
});
