// test/setup.ts

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import {
  TypeOrmModule,
  getRepositoryToken,
  getDataSourceToken,
} from '@nestjs/typeorm';
import { Card } from '../src/firstentity/entities/card.entity';
import { Canvas } from '../src/firstentity/entities/canvas.entity';
import { Repository, DataSource, QueryRunner } from 'typeorm';

let app: INestApplication;
let cardRepository: Repository<Card>;
let canvasRepository: Repository<Canvas>;
let dataSource: DataSource;
let queryRunner: QueryRunner;

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

  // Retrieve the DataSource to create QueryRunner
  dataSource = moduleFixture.get<DataSource>(getDataSourceToken());

  // Create a QueryRunner for transactions
  queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  return app;
};

export const getApp = (): INestApplication => app;
export const getCardRepository = (): Repository<Card> => cardRepository;
export const getCanvasRepository = (): Repository<Canvas> => canvasRepository;

// Functions to manage transactions
export const startTransaction = async (): Promise<void> => {
  if (!queryRunner.isReleased && !queryRunner.isTransactionActive) {
    await queryRunner.startTransaction();
  }
};

export const rollbackTransaction = async (): Promise<void> => {
  if (queryRunner.isTransactionActive) {
    await queryRunner.rollbackTransaction();
  }
};

// Function to clean up the app and release the QueryRunner
export const cleanupTestApp = async () => {
  if (queryRunner && !queryRunner.isReleased) {
    await queryRunner.release();
  }
  if (app) {
    await app.close();
  }
};
