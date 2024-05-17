import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FirstentityService } from './firstentity.service';
import { CreateFirstentityDto } from './dto/create-firstentity.dto';
import { UpdateFirstentityDto } from './dto/update-firstentity.dto';

@Controller('firstentity')
export class FirstentityController {
  constructor(private readonly firstentityService: FirstentityService) {}

  @Post()
  create(@Body() createFirstentityDto: CreateFirstentityDto) {
    return this.firstentityService.create(createFirstentityDto);
  }

  @Get()
  findAll() {
    return this.firstentityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.firstentityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFirstentityDto: UpdateFirstentityDto) {
    return this.firstentityService.update(+id, updateFirstentityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.firstentityService.remove(+id);
  }
}
