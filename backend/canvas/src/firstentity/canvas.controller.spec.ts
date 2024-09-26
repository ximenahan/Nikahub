// src/firstentity/canvas.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CanvasController } from './canvas.controller';
import { CanvasService } from './canvas.service';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import { NotFoundException } from '@nestjs/common';

describe('CanvasController', () => {
  let controller: CanvasController;
  let service: CanvasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CanvasController],
      providers: [
        {
          provide: CanvasService,
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

    controller = module.get<CanvasController>(CanvasController);
    service = module.get<CanvasService>(CanvasService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of canvases', async () => {
      const canvases = [
        { id: 1, name: 'Canvas One', cards: [] },
        { id: 2, name: 'Canvas Two', cards: [] },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValue(canvases as any);

      expect(await controller.findAll()).toEqual(canvases);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single canvas', async () => {
      const canvas = { id: 1, name: 'Canvas One', cards: [] };

      jest.spyOn(service, 'findOne').mockResolvedValue(canvas as any);

      expect(await controller.findOne(1)).toEqual(canvas);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when canvas is not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new canvas', async () => {
      const createDto: CreateCanvasDto = {
        name: 'New Canvas',
        createdAt: undefined,
      };
      const createdCanvas = { id: 1, ...createDto, cards: [] };

      jest.spyOn(service, 'create').mockResolvedValue(createdCanvas as any);

      expect(await controller.create(createDto)).toEqual(createdCanvas);
      expect(service.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the updated canvas', async () => {
      const updateDto: UpdateCanvasDto = { name: 'Updated Canvas' };
      const updatedCanvas = { id: 1, ...updateDto, cards: [] };

      jest.spyOn(service, 'update').mockResolvedValue(updatedCanvas as any);

      expect(await controller.update(1, updateDto)).toEqual(updatedCanvas);
      expect(service.update).toHaveBeenCalledWith(1, updateDto);
    });

    it('should throw NotFoundException when updating a non-existent canvas', async () => {
      const updateDto: UpdateCanvasDto = { name: 'Updated Canvas' };

      jest.spyOn(service, 'update').mockRejectedValue(new NotFoundException());

      await expect(controller.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove the canvas', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      expect(await controller.remove(1)).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when removing a non-existent canvas', async () => {
      jest.spyOn(service, 'remove').mockRejectedValue(new NotFoundException());

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
