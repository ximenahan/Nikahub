// test/integration/firstentity/canvas.integration.spec.ts

import { INestApplication } from '@nestjs/common';
import {
  initializeTestApp,
  getCanvasRepository,
  getCardRepository,
} from '../../setup';
import * as request from 'supertest';
import { Repository } from 'typeorm';
import { Canvas } from '../../../src/firstentity/entities/canvas.entity';
import { Card } from '../../../src/firstentity/entities/card.entity';

describe('CanvasModule Integration Tests', () => {
  let app: INestApplication;
  let canvasRepository: Repository<Canvas>;
  let cardRepository: Repository<Card>;

  beforeAll(async () => {
    app = await initializeTestApp();
    canvasRepository = getCanvasRepository();
    cardRepository = getCardRepository();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('POST /canvases', () => {
    it('should create a new canvas', async () => {
      const newCanvas = {
        name: 'Integration Test Canvas',
        // Add other necessary properties if any
      };

      const response = await request(app.getHttpServer())
        .post('/canvases')
        .send(newCanvas)
        .expect(201);

      expect(response.body).toMatchObject({
        id: expect.any(Number),
        name: newCanvas.name,
        // Verify other properties if any
      });

      // Verify the canvas exists in the database
      const savedCanvas = await canvasRepository.findOne({
        where: { id: response.body.id },
      });
      expect(savedCanvas).toBeDefined();
      expect(savedCanvas.name).toBe(newCanvas.name);
    });

    it('should fail to create a canvas with invalid data', async () => {
      const invalidCanvas = {
        // Missing required fields like 'name'
      };

      const response = await request(app.getHttpServer())
        .post('/canvases')
        .send(invalidCanvas)
        .expect(400);

      expect(response.body.message).toContain('name should not be empty');
      // Add more assertions based on your validation rules if any
    });
  });

  describe('GET /canvases', () => {
    it('should retrieve all canvases', async () => {
      // Ensure there is at least one canvas (from previous test)
      const response = await request(app.getHttpServer())
        .get('/canvases')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /canvases/:id', () => {
    it('should retrieve a single canvas by ID', async () => {
      const canvas = await canvasRepository.findOne({ where: {} });
      expect(canvas).toBeDefined();

      const response = await request(app.getHttpServer())
        .get(`/canvases/${canvas.id}`)
        .expect(200);

      expect(response.body).toMatchObject({
        id: canvas.id,
        name: canvas.name,
        // Verify other properties if any
      });
    });

    it('should return 404 for a non-existent canvas', async () => {
      const nonExistentId = 9999;

      await request(app.getHttpServer())
        .get(`/canvases/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('PUT /canvases/:id', () => {
    it('should update an existing canvas', async () => {
      const canvas = await canvasRepository.findOne({ where: {} });
      expect(canvas).toBeDefined();

      const updateData = {
        name: 'Updated Integration Test Canvas',
        // Add other fields to update if any
      };

      const response = await request(app.getHttpServer())
        .put(`/canvases/${canvas.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toMatchObject({
        id: canvas.id,
        name: updateData.name,
        // Verify other updated properties if any
      });

      // Verify the update in the database
      const updatedCanvas = await canvasRepository.findOne({
        where: { id: canvas.id },
      });
      expect(updatedCanvas.name).toBe(updateData.name);
      // Verify other updated properties if any
    });

    it('should return 404 when updating a non-existent canvas', async () => {
      const nonExistentId = 9999;
      const updateData = {
        name: 'Non-existent Canvas',
      };

      await request(app.getHttpServer())
        .put(`/canvases/${nonExistentId}`)
        .send(updateData)
        .expect(404);
    });
  });

  describe('DELETE /canvases/:id', () => {
    it('should prevent deleting a canvas with associated cards', async () => {
      // Step 1: Create a new canvas
      const canvas = await canvasRepository.save({
        name: 'Canvas with Cards',
        // Add other necessary properties if any
      });

      // Step 2: Create a card associated with the canvas
      const card = await cardRepository.save({
        title: 'Associated Card',
        content: 'This card is associated with the canvas.',
        canvasId: canvas.id,
        positionX: 100,
        positionY: 100,
        width: 200,
        height: 150,
        createdAt: new Date(),
      });

      // Step 3: Attempt to delete the canvas
      const response = await request(app.getHttpServer())
        .delete(`/canvases/${canvas.id}`)
        .expect(400); // Expecting Bad Request

      expect(response.body.message).toContain(
        'Cannot delete canvas with associated cards',
      );

      // Cleanup: Delete the associated card and canvas
      await cardRepository.delete(card.id);
      await canvasRepository.delete(canvas.id);
    });

    it('should delete an existing canvas without associated cards', async () => {
      // Step 1: Create a new canvas without associated cards
      const newCanvas = await canvasRepository.save({
        name: 'Canvas Without Cards',
        // Add other necessary properties if any
      });

      // Step 2: Attempt to delete the canvas
      await request(app.getHttpServer())
        .delete(`/canvases/${newCanvas.id}`)
        .expect(200);

      // Step 3: Verify the canvas is deleted
      const deletedCanvas = await canvasRepository.findOne({
        where: { id: newCanvas.id },
      });
      expect(deletedCanvas).toBeNull();
    });

    it('should return 404 when deleting a non-existent canvas', async () => {
      const nonExistentId = 9999;

      await request(app.getHttpServer())
        .delete(`/canvases/${nonExistentId}`)
        .expect(404);
    });
  });
});
