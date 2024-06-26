import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CanvasService } from './canvas.service';
//import { Canvas } from './entities/canvas.entity';
import { CreateCanvasDto } from './dto/create-canvas.dto';
import { UpdateCanvasDto } from './dto/update-canvas.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('canvases')
@Controller('canvases')
export class CanvasController {
  constructor(private readonly canvasService: CanvasService) {}

  @Get()
  @ApiOperation({ summary: 'Get all canvases' })
  @ApiResponse({ status: 200, description: 'A list of canvases' })
  findAll() {
    return this.canvasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a canvas by ID' })
  @ApiParam({ name: 'id', description: 'The canvas ID' })
  @ApiResponse({ status: 200, description: 'A canvas object' })
  findOne(@Param('id') id: number) {
    return this.canvasService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new canvas' })
  @ApiBody({ type: CreateCanvasDto })
  @ApiResponse({ status: 201, description: 'The created canvas' })
  create(@Body() createCanvasDto: CreateCanvasDto) {
    return this.canvasService.create(createCanvasDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a canvas by ID' })
  @ApiParam({ name: 'id', description: 'The canvas ID' })
  @ApiBody({ type: UpdateCanvasDto })
  @ApiResponse({ status: 200, description: 'The updated canvas' })
  update(@Param('id') id: number, @Body() updateCanvasDto: UpdateCanvasDto) {
    return this.canvasService.update(+id, updateCanvasDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a canvas by ID' })
  @ApiParam({ name: 'id', description: 'The canvas ID' })
  @ApiResponse({ status: 200, description: 'The deleted canvas' })
  remove(@Param('id') id: number) {
    return this.canvasService.remove(+id);
  }
}
