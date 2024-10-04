// e2e/card.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstentityModule } from '../src/firstentity/firstentity.module';
import { Canvas } from '../src/firstentity/entities/canvas.entity';
import { Card } from '../src/firstentity/entities/card.entity';

describe('CardController (e2e)', () => {
  let app: INestApplication;
  let canvasId: number;
  let createdCardId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        FirstentityModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Canvas, Card],
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    // Enable validation pipe if used in the main application
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    // Create a Canvas to associate with Cards
    const response = await request(app.getHttpServer())
      .post('/canvases')
      .send({ name: 'Test Canvas for Cards' })
      .expect(201);
    canvasId = response.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/GET cards', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer()).get('/cards').expect(200).expect([]);
    });
  });

  describe('/POST cards', () => {
    it('should create a new card', () => {
      const newCard = {
        title: 'Test Card',
        content: 'This is a test card',
        positionX: 100,
        positionY: 150,
        width: 200,
        height: 300,
        canvasId: canvasId,
        createdAt: new Date().toISOString(),
      };
      return request(app.getHttpServer())
        .post('/cards')
        .send(newCard)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.title).toBe(newCard.title);
          expect(response.body.content).toBe(newCard.content);
          expect(response.body.canvasId).toBe(canvasId);
          createdCardId = response.body.id;
        });
    });

    it('should fail when required fields are missing', () => {
      const invalidCard = {
        title: '',
        content: '',
        positionX: null,
        positionY: null,
        width: null,
        height: null,
        canvasId: null,
      };
      return request(app.getHttpServer())
        .post('/cards')
        .send(invalidCard)
        .expect(400);
    });

    it('should fail when associated canvas does not exist', () => {
      const invalidCard = {
        title: 'Invalid Card',
        content: 'Invalid because canvas does not exist',
        positionX: 50,
        positionY: 50,
        width: 100,
        height: 100,
        canvasId: 9999, // Non-existing canvasId
        createdAt: new Date().toISOString(),
      };
      return request(app.getHttpServer())
        .post('/cards')
        .send(invalidCard)
        .expect(400); // Assuming validation or service throws an error
    });
  });

  describe('/GET cards/:id', () => {
    it('should retrieve the created card', () => {
      return request(app.getHttpServer())
        .get(`/cards/${createdCardId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdCardId);
          expect(response.body.title).toBe('Test Card');
          expect(response.body.canvasId).toBe(canvasId);
        });
    });

    it('should return 404 for non-existing card', () => {
      return request(app.getHttpServer()).get('/cards/9999').expect(404);
    });
  });

  describe('/PUT cards/:id', () => {
    it('should update the existing card', () => {
      const updatedCard = {
        title: 'Updated Test Card',
        content: 'Updated content',
        positionX: 120,
        positionY: 180,
        width: 220,
        height: 330,
        canvasId: canvasId,
        createdAt: new Date().toISOString(),
      };
      return request(app.getHttpServer())
        .put(`/cards/${createdCardId}`)
        .send(updatedCard)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdCardId);
          expect(response.body.title).toBe(updatedCard.title);
          expect(response.body.content).toBe(updatedCard.content);
        });
    });

    it('should return 404 when updating non-existing card', () => {
      const updatedCard = {
        title: 'Non-Existing Card',
        content: 'Does not exist',
        positionX: 0,
        positionY: 0,
        width: 0,
        height: 0,
        canvasId: canvasId,
        createdAt: new Date().toISOString(),
      };
      return request(app.getHttpServer())
        .put('/cards/9999')
        .send(updatedCard)
        .expect(404);
    });

    it('should fail when updating with invalid data', () => {
      const invalidUpdate = {
        title: '',
        content: '',
      };
      return request(app.getHttpServer())
        .put(`/cards/${createdCardId}`)
        .send(invalidUpdate)
        .expect(400);
    });
  });

  describe('/DELETE cards/:id', () => {
    it('should delete the existing card', () => {
      return request(app.getHttpServer())
        .delete(`/cards/${createdCardId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existing card', () => {
      return request(app.getHttpServer()).delete('/cards/9999').expect(404);
    });
  });

  describe('Association Tests', () => {
    let associatedCardId: number;

    beforeAll(async () => {
      const newCard = {
        title: 'Associated Card',
        content: 'This card is associated with a canvas',
        positionX: 200,
        positionY: 250,
        width: 300,
        height: 350,
        canvasId: canvasId,
        createdAt: new Date().toISOString(),
      };
      const response = await request(app.getHttpServer())
        .post('/cards')
        .send(newCard)
        .expect(201);
      associatedCardId = response.body.id;
    });

    it('should retrieve the canvas with associated cards', async () => {
      const response = await request(app.getHttpServer())
        .get(`/canvases/${canvasId}`)
        .expect(200);
      expect(response.body.cards).toBeDefined();
      expect(Array.isArray(response.body.cards)).toBe(true);
      expect(response.body.cards.length).toBeGreaterThan(0);
      const card = response.body.cards.find((c) => c.id === associatedCardId);
      expect(card).toBeDefined();
      expect(card.title).toBe('Associated Card');
    });

    it('should delete the canvas only after deleting associated cards', async () => {
      // Attempt to delete the canvas while it has associated cards
      await request(app.getHttpServer())
        .delete(`/canvases/${canvasId}`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Cannot delete canvas with associated cards',
          error: 'Bad Request',
        });

      // Delete the associated card
      await request(app.getHttpServer())
        .delete(`/cards/${associatedCardId}`)
        .expect(200);

      // Now, deleting the canvas should succeed
      await request(app.getHttpServer())
        .delete(`/canvases/${canvasId}`)
        .expect(200);
    });
  });
});
