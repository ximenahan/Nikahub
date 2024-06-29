import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Canvas } from './entities/canvas.entity';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';

@Injectable()
export class CanvasService {
  constructor(
    @InjectRepository(Canvas)
    private canvasRepository: Repository<Canvas>,
  ) {}

  findAll(): Promise<Canvas[]> {
    return this.canvasRepository.find({ relations: ['cards'] });
  }

  async findOne(id: number): Promise<Canvas> {
    // eslint-disable-next-line prettier/prettier
    const canvas = await this.canvasRepository.findOne({ where: { id }, relations: ['cards'] });
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
    const result = await this.canvasRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Canvas with ID ${id} not found`);
    }
  }
}
