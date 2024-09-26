// src/firstentity/canvas.service.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { CanvasService } from './canvas.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Canvas } from './entities/canvas.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';

describe('CanvasService', () => {
  let service: CanvasService;
  let repository: Repository<Canvas>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CanvasService,
        {
          provide: getRepositoryToken(Canvas),
          useClass: Repository, // Using the actual Repository class for TypeORM
        },
      ],
    }).compile();

    service = module.get<CanvasService>(CanvasService);
    repository = module.get<Repository<Canvas>>(getRepositoryToken(Canvas));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of canvases', async () => {
      const canvases: Canvas[] = [
        { id: 1, name: 'Canvas One', cards: [] } as Canvas,
        { id: 2, name: 'Canvas Two', cards: [] } as Canvas,
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(canvases);

      const result = await service.findAll();
      expect(result).toEqual(canvases);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['cards'] });
    });
  });

  describe('findOne', () => {
    it('should return a canvas if found', async () => {
      const canvas: Canvas = { id: 1, name: 'Canvas One', cards: [] } as Canvas;
      jest.spyOn(repository, 'findOne').mockResolvedValue(canvas);

      const result = await service.findOne(1);
      expect(result).toEqual(canvas);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cards'],
      });
    });

    it('should throw NotFoundException if canvas not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 999 },
        relations: ['cards'],
      });
    });
  });

  describe('create', () => {
    it('should create and return a new canvas', async () => {
      const createDto: CreateCanvasDto = {
        name: 'New Canvas',
        createdAt: undefined,
      };
      const savedCanvas: Canvas = { id: 1, ...createDto, cards: [] } as Canvas;

      jest.spyOn(repository, 'create').mockReturnValue(savedCanvas);
      jest.spyOn(repository, 'save').mockResolvedValue(savedCanvas);

      const result = await service.create(createDto);
      expect(result).toEqual(savedCanvas);
      expect(repository.create).toHaveBeenCalledWith(createDto);
      expect(repository.save).toHaveBeenCalledWith(savedCanvas);
    });
  });

  describe('update', () => {
    it('should update and return the updated canvas', async () => {
      const updateDto: UpdateCanvasDto = { name: 'Updated Canvas' };
      const existingCanvas: Canvas = {
        id: 1,
        name: 'Old Canvas',
        cards: [],
      } as Canvas;
      jest.spyOn(service, 'findOne').mockResolvedValue(existingCanvas);
      const updatedCanvas: Canvas = {
        id: 1,
        ...updateDto,
        cards: [],
      } as Canvas;
      jest.spyOn(service, 'findOne').mockResolvedValue(updatedCanvas);
      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 1, raw: undefined, generatedMaps: [] });

      const result = await service.update(1, updateDto);
      expect(result).toEqual(updatedCanvas);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if updating a non-existent canvas', async () => {
      const updateDto: UpdateCanvasDto = { name: 'Updated Canvas' };

      jest
        .spyOn(repository, 'update')
        .mockResolvedValue({ affected: 0, raw: undefined, generatedMaps: [] });
      jest.spyOn(service, 'findOne').mockRejectedValue(new NotFoundException());

      await expect(service.update(999, updateDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(repository.update).toHaveBeenCalledWith(999, updateDto);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('remove', () => {
    it('should remove the canvas if it exists', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 1, raw: undefined });

      await service.remove(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });
    it('should throw NotFoundException if canvas does not exist', async () => {
      jest
        .spyOn(repository, 'delete')
        .mockResolvedValue({ affected: 0, raw: undefined });

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
      expect(repository.delete).toHaveBeenCalledWith(999);
    });
  });
});
