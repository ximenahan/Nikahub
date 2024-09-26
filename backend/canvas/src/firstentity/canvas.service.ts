// src/firstentity/canvas.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canvas } from './entities/canvas.entity';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { Card } from './entities/card.entity';

@Injectable()
export class CanvasService {
  constructor(
    @InjectRepository(Canvas)
    private canvasRepository: Repository<Canvas>,
    @InjectRepository(Card)
    private cardRepository: Repository<Card>, // Inject Card repository
  ) {}

  findAll(): Promise<Canvas[]> {
    return this.canvasRepository.find({ relations: ['cards'] });
  }

  async findOne(id: number): Promise<Canvas> {
    const canvas = await this.canvasRepository.findOne({
      where: { id },
      relations: ['cards'],
    });
    if (!canvas) {
      throw new NotFoundException(`Canvas with ID ${id} not found`);
    }
    return canvas;
  }

  create(createCanvasDto: CreateCanvasDto): Promise<Canvas> {
    const canvas = this.canvasRepository.create(createCanvasDto);
    return this.canvasRepository.save(canvas);
  }

  async update(id: number, updateCanvasDto: UpdateCanvasDto): Promise<Canvas> {
    await this.canvasRepository.update(id, updateCanvasDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const canvas = await this.canvasRepository.findOne({
      where: { id },
      relations: ['cards'],
    });
    if (!canvas) {
      throw new NotFoundException(`Canvas with ID ${id} not found`);
    }

    if (canvas.cards && canvas.cards.length > 0) {
      throw new BadRequestException(
        'Cannot delete canvas with associated cards',
      );
    }

    await this.canvasRepository.delete(id);
  }
}
