// src/firstentity/firstentity.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canvas } from './entities/canvas.entity';
import { Card } from './entities/card.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Canvas, Card])],
  
  controllers: [],  // Add controllers if they handle HTTP requests
  providers: [],  // Add services if they contain business logic
})
export class FirstentityModule {}
