//app.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FirstentityModule } from './firstentity/firstentity.module';
import { Canvas } from './firstentity/entities/canvas.entity';
import { Card } from './firstentity/entities/card.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: process.env.NODE_ENV === 'test' ? 'sqlite' : 'postgres', // Conditional database type
      ...(process.env.NODE_ENV === 'test'
        ? {
            database: ':memory:', // In-memory SQLite database
            entities: [Canvas, Card], // Your entities
            synchronize: true, // Auto-create schema
            logging: false, // Disable logging in tests
          }
        : {
            host: 'localhost', // PostgreSQL host
            port: 5432, // PostgreSQL port
            username: 'bruce', // PostgreSQL username
            password: 'bruce12345', // PostgreSQL password
            database: 'firstdatabase', // PostgreSQL database name
            entities: [Canvas, Card], // Your entities
            synchronize: true, // Auto-create schema
            logging: true, // Enable logging in development
          }),
    }),
    FirstentityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
