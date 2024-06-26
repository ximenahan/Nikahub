import { Injectable } from '@nestjs/common';
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
    return this.canvasRepository.find();
  }

  findOne(id: number): Promise<Canvas> {
    return this.canvasRepository.findOne({ where: { id } });
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
    await this.canvasRepository.delete(id);
  }
}
