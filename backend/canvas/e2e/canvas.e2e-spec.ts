// e2e/canvas.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirstentityModule } from '../src/firstentity/firstentity.module';
import { Canvas } from '../src/firstentity/entities/canvas.entity';
import { Card } from '../src/firstentity/entities/card.entity';

describe('CanvasController (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  let createdCanvasId: number;

  describe('/GET canvases', () => {
    it('should return an empty array initially', () => {
      return request(app.getHttpServer())
        .get('/canvases')
        .expect(200)
        .expect([]);
    });
  });

  describe('/POST canvases', () => {
    it('should create a new canvas', () => {
      const newCanvas = { name: 'Test Canvas' };
      return request(app.getHttpServer())
        .post('/canvases')
        .send(newCanvas)
        .expect(201)
        .then((response) => {
          expect(response.body).toHaveProperty('id');
          expect(response.body.name).toBe(newCanvas.name);
          createdCanvasId = response.body.id;
        });
    });

    it('should fail when name is missing', () => {
      const newCanvas = {};
      return request(app.getHttpServer())
        .post('/canvases')
        .send(newCanvas)
        .expect(400);
    });
  });

  describe('/GET canvases/:id', () => {
    it('should retrieve the created canvas', () => {
      return request(app.getHttpServer())
        .get(`/canvases/${createdCanvasId}`)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdCanvasId);
          expect(response.body.name).toBe('Test Canvas');
        });
    });

    it('should return 404 for non-existing canvas', () => {
      return request(app.getHttpServer()).get('/canvases/9999').expect(404);
    });
  });

  describe('/PUT canvases/:id', () => {
    it('should update the existing canvas', () => {
      const updatedCanvas = { name: 'Updated Canvas' };
      return request(app.getHttpServer())
        .put(`/canvases/${createdCanvasId}`)
        .send(updatedCanvas)
        .expect(200)
        .then((response) => {
          expect(response.body.id).toBe(createdCanvasId);
          expect(response.body.name).toBe(updatedCanvas.name);
        });
    });

    it('should return 404 when updating non-existing canvas', () => {
      const updatedCanvas = { name: 'Non-Existing Canvas' };
      return request(app.getHttpServer())
        .put('/canvases/9999')
        .send(updatedCanvas)
        .expect(404);
    });

    it('should fail when name is invalid', () => {
      const updatedCanvas = { name: '' };
      return request(app.getHttpServer())
        .put(`/canvases/${createdCanvasId}`)
        .send(updatedCanvas)
        .expect(400);
    });
  });

  describe('/DELETE canvases/:id', () => {
    it('should delete the existing canvas', () => {
      return request(app.getHttpServer())
        .delete(`/canvases/${createdCanvasId}`)
        .expect(200);
    });

    it('should return 404 when deleting non-existing canvas', () => {
      return request(app.getHttpServer()).delete('/canvases/9999').expect(404);
    });

    it('should not delete a canvas with associated cards', async () => {
      // Create a new canvas
      const newCanvas = { name: 'Canvas with Cards' };
      const response = await request(app.getHttpServer())
        .post('/canvases')
        .send(newCanvas)
        .expect(201);
      const canvasId = response.body.id;

      // Add a card to the canvas
      await request(app.getHttpServer())
        .post('/cards')
        .send({
          title: 'Test Card',
          content: 'This is a test card',
          positionX: 100,
          positionY: 100,
          width: 200,
          height: 200,
          canvasId: canvasId,
          createdAt: new Date().toISOString(),
        })
        .expect(201);

      // Attempt to delete the canvas
      return request(app.getHttpServer())
        .delete(`/canvases/${canvasId}`)
        .expect(400)
        .expect({
          statusCode: 400,
          message: 'Cannot delete canvas with associated cards',
          error: 'Bad Request',
        });
    });
  });
});
