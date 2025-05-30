//src/app.module.ts

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
            host: process.env.DATABASE_HOST || 'localhost', // Fallback to localhost if not set
            port: parseInt(process.env.DATABASE_PORT, 10) || 5432, // Fallback to 5432
            username: process.env.DATABASE_USER || 'default_user', // Fallback to default_user
            password: process.env.DATABASE_PASSWORD || 'default_password', // Fallback to default_password
            database: process.env.DATABASE_NAME || 'default_database', // Fallback to default_database
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
