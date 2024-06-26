import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardService {
  constructor(
    @InjectRepository(Card)
    private cardRepository: Repository<Card>,
  ) {}

  findAll(): Promise<Card[]> {
    return this.cardRepository.find();
  }

  findOne(id: number): Promise<Card> {
    return this.cardRepository.findOne({ where: { id } });
  }

  create(createCardDto: CreateCardDto): Promise<Card> {
    const card = this.cardRepository.create(createCardDto);
    return this.cardRepository.save(card);
  }

  async update(id: number, updateCardDto: UpdateCardDto): Promise<Card> {
    await this.cardRepository.update(id, updateCardDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.cardRepository.delete(id);
  }
}
