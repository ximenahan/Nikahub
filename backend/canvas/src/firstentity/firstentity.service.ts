// src/firstentity/firstentity.service.ts
import { Injectable } from '@nestjs/common';
import { CreateFirstentityDto } from './dto/create-firstentity.dto';
import { UpdateFirstentityDto } from './dto/update-firstentity.dto';

@Injectable()
export class FirstentityService {
  create(createFirstentityDto: CreateFirstentityDto) {
    // Use createFirstentityDto to create a new entity
    return `This action adds a new firstentity with data: ${JSON.stringify(createFirstentityDto)}`;
  }

  findAll() {
    return `This action returns all firstentity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firstentity`;
  }

  update(id: number, updateFirstentityDto: UpdateFirstentityDto) {
    // Use updateFirstentityDto to update the entity
    return `This action updates a #${id} firstentity with data: ${JSON.stringify(updateFirstentityDto)}`;
  }

  remove(id: number) {
    return `This action removes a #${id} firstentity`;
  }
}
