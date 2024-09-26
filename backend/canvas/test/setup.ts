// test/setup.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Card } from '../src/firstentity/entities/card.entity';
import { Canvas } from '../src/firstentity/entities/canvas.entity';
import { Repository } from 'typeorm';

let app: INestApplication;
let cardRepository: Repository<Card>;
let canvasRepository: Repository<Canvas>;

export const initializeTestApp = async (): Promise<INestApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: ':memory:',
        entities: [Card, Canvas],
        synchronize: true,
      }),
      AppModule, // Ensure AppModule imports all necessary modules
    ],
  }).compile();

  app = moduleFixture.createNestApplication();

  // Use global validation pipes if used in your main.ts
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.init();

  // Correctly retrieve repositories using getRepositoryToken
  cardRepository = moduleFixture.get<Repository<Card>>(
    getRepositoryToken(Card),
  );
  canvasRepository = moduleFixture.get<Repository<Canvas>>(
    getRepositoryToken(Canvas),
  );

  // Seed initial data if necessary
  await seedInitialData();

  return app;
};

const seedInitialData = async () => {
  // Example: Seed a Canvas entity
  const canvas = canvasRepository.create({
    id: 1,
    name: 'Default Canvas',
    // Add other necessary properties if any
  });
  await canvasRepository.save(canvas);

  // Example: Seed a Card entity if needed
  const card = cardRepository.create({
    id: 1,
    title: 'Initial Card',
    content: 'This is an initial card for integration testing.',
    canvasId: canvas.id,
    positionX: 50,
    positionY: 50,
    width: 200,
    height: 150,
    createdAt: new Date(),
  });
  await cardRepository.save(card);
};

export const getApp = (): INestApplication => app;
export const getCardRepository = (): Repository<Card> => cardRepository;
export const getCanvasRepository = (): Repository<Canvas> => canvasRepository;
