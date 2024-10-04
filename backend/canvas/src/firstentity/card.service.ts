// src/firstentity/card.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { Canvas } from './entities/canvas.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    @InjectRepository(Canvas)
    private readonly canvasRepository: Repository<Canvas>, // Inject Canvas repository
  ) {}

  findAll(): Promise<Card[]> {
    return this.cardRepository.find({ relations: ['canvas'] });
  }

  async findOne(id: number): Promise<Card> {
    // eslint-disable-next-line prettier/prettier
    const card = await this.cardRepository.findOne({ where: { id }, relations: ['canvas'] });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    // Check if the associated canvas exists
    const canvas = await this.canvasRepository.findOne({
      where: { id: createCardDto.canvasId },
    });
    if (!canvas) {
      throw new BadRequestException(
        `Canvas with ID ${createCardDto.canvasId} does not exist`,
      );
    }

    const card = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(card);
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardRepository.preload({
      id,
      ...updateCardDto,
    });
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return this.cardRepository.save(card);
  }

  async remove(id: number): Promise<void> {
    const result = await this.cardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
  }
}
