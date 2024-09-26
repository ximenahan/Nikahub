// src/firstentity/card.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CardService } from './card.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Card } from './entities/card.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

describe('CardService', () => {
  let service: CardService;
  let repository: jest.Mocked<Repository<Card>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardService,
        {
          provide: getRepositoryToken(Card),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            preload: jest.fn(), // **Added** preload mock
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CardService>(CardService);
    repository = module.get<jest.Mocked<Repository<Card>>>(
      getRepositoryToken(Card),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cards', async () => {
      const cards: Card[] = [
        {
          id: 1,
          content: 'Card One',
          canvasId: 1,
          positionX: 0,
          positionY: 0,
          width: 100,
          height: 100,
        } as Card,
        {
          id: 2,
          content: 'Card Two',
          canvasId: 1,
          positionX: 100,
          positionY: 100,
          width: 150,
          height: 150,
        } as Card,
      ];

      repository.find.mockResolvedValue(cards);

      const result = await service.findAll();
      expect(result).toEqual(cards);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single card if found', async () => {
      const card: Card = {
        id: 1,
        content: 'Card One',
        canvasId: 1,
        positionX: 0,
        positionY: 0,
        width: 100,
        height: 100,
      } as Card;

      repository.findOne.mockResolvedValue(card);

      const result = await service.findOne(1);
      expect(result).toEqual(card);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['canvas'], // Ensure 'relations' matches your service implementation
      });
    });

    it('should throw NotFoundException if card not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['canvas'], // Ensure 'relations' matches your service implementation
      });
    });
  });

  describe('create', () => {
    it('should create and return a new card', async () => {
      const createDto: CreateCardDto = {
        // **Ensure that 'title' and 'createdAt' are valid properties in Card entity**
        content: 'New Card',
        canvasId: 1,
        positionX: 50,
        positionY: 50,
        width: 200,
        height: 150,
        title: '',
        createdAt: undefined,
      };
      const createdCard: Card = { id: 1, ...createDto } as Card;

      repository.create.mockReturnValue(createdCard);
      repository.save.mockResolvedValue(createdCard);

      const result = await service.create(createDto);
      expect(result).toEqual(createdCard);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(createdCard);
    });
  });

  describe('update', () => {
    it('should update and return the updated card', async () => {
      const updateDto: UpdateCardDto = { content: 'Updated Card' };
      const existingCard: Card = {
        id: 1,
        content: 'Old Card',
        canvasId: 1,
        positionX: 0,
        positionY: 0,
        width: 100,
        height: 100,
      } as Card;
      const updatedCard: Card = { ...existingCard, ...updateDto } as Card;

      // **Mock repository.preload to return the updatedCard**
      repository.preload.mockResolvedValue(updatedCard);

      // **Mock repository.save to return the updatedCard**
      repository.save.mockResolvedValue(updatedCard);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedCard);
      expect(repository.preload).toHaveBeenCalledWith({
        id: 1,
        ...updateDto,
      });
      expect(repository.save).toHaveBeenCalledWith(updatedCard);
    });

    it('should throw NotFoundException if updating a non-existent card', async () => {
      const updateDto: UpdateCardDto = { content: 'Updated Card' };

      // **Mock repository.preload to return null, indicating card not found**
      repository.preload.mockResolvedValue(null);

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.preload).toHaveBeenCalledWith({
        id: 999,
        ...updateDto,
      });
      // **No need to mock or expect repository.save since preload returned null**
    });
  });

  describe('remove', () => {
    it('should remove the card if it exists', async () => {
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if card does not exist', async () => {
      repository.delete.mockResolvedValue({ affected: 0 } as any);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });
});
