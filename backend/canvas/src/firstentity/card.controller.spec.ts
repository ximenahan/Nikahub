// src/firstentity/card.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CardController } from './card.controller';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { NotFoundException } from '@nestjs/common';

describe('CardController', () => {
  let controller: CardController;
  let service: CardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardController],
      providers: [
        {
          provide: CardService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CardController>(CardController);
    service = module.get<CardService>(CardService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cards', async () => {
      const cards = [
        {
          id: 1,
          content: 'Card One',
          canvasId: 1,
          positionX: 0,
          positionY: 0,
          width: 100,
          height: 100,
        },
        {
          id: 2,
          content: 'Card Two',
          canvasId: 1,
          positionX: 100,
          positionY: 100,
          width: 150,
          height: 150,
        },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(cards as any);

      expect(await controller.findAll()).toEqual(cards);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single card', async () => {
      const card = {
        id: 1,
        content: 'Card One',
        canvasId: 1,
        positionX: 0,
        positionY: 0,
        width: 100,
        height: 100,
      };

      jest.spyOn(service, 'findOne').mockResolvedValue(card as any);

      expect(await controller.findOne(1)).toEqual(card);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when card is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new card', async () => {
      const createDto: CreateCardDto = {
        title: 'New Card Title',
        content: 'New Card',
        canvasId: 1,
        positionX: 50,
        positionY: 50,
        createdAt: new Date(),
        width: 200,
        height: 150,
      };
      const createdCard = { id: 1, ...createDto };

      jest.spyOn(service, 'create').mockResolvedValue(createdCard as any);

      expect(await controller.create(createDto)).toEqual(createdCard);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the updated card', async () => {
      const updateDto: UpdateCardDto = { content: 'Updated Card' };
      const updatedCard = {
        id: 1,
        content: 'Updated Card',
        canvasId: 1,
        positionX: 0,
        positionY: 0,
        width: 100,
        height: 100,
      };

      jest.spyOn(service, 'update').mockResolvedValue(updatedCard as any);

      expect(await controller.update(1, updateDto)).toEqual(updatedCard);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when updating a non-existent card', async () => {
      const updateDto: UpdateCardDto = { content: 'Updated Card' };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove the card', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing a non-existent card', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
