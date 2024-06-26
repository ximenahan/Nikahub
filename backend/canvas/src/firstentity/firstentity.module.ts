// src/firstentity/firstentity.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Canvas } from './entities/canvas.entity';
import { Card } from './entities/card.entity';
import { CanvasController } from './canvas.controller';
import { CardController } from './card.controller';
import { CanvasService } from './canvas.service';
import { CardService } from './card.service';

@Module({
  imports: [TypeOrmModule.forFeature([Canvas, Card])],
  controllers: [CanvasController, CardController], // Add controllers if they handle HTTP requests
  providers: [CanvasService, CardService], // Add services if they contain business logic
})
export class FirstentityModule {}
