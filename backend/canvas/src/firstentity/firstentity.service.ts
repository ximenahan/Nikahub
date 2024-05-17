import { Injectable } from '@nestjs/common';
import { CreateFirstentityDto } from './dto/create-firstentity.dto';
import { UpdateFirstentityDto } from './dto/update-firstentity.dto';

@Injectable()
export class FirstentityService {
  create(createFirstentityDto: CreateFirstentityDto) {
    return 'This action adds a new firstentity';
  }

  findAll() {
    return `This action returns all firstentity`;
  }

  findOne(id: number) {
    return `This action returns a #${id} firstentity`;
  }

  update(id: number, updateFirstentityDto: UpdateFirstentityDto) {
    return `This action updates a #${id} firstentity`;
  }

  remove(id: number) {
    return `This action removes a #${id} firstentity`;
  }
}
