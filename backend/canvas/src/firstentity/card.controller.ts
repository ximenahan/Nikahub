// src/firstentity/card.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('cards')
@Controller('cards')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cards' })
  @ApiResponse({ status: 200, description: 'A list of cards' })
  findAll() {
    return this.cardService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a card by ID' })
  @ApiParam({ name: 'id', description: 'The card ID' })
  @ApiResponse({ status: 200, description: 'A card object' })
  findOne(@Param('id') id: number) {
    return this.cardService.findOne(+id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new card' })
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: 201, description: 'The created card' })
  create(@Body() createCardDto: CreateCardDto) {
    return this.cardService.create(createCardDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a card by ID' })
  @ApiParam({ name: 'id', description: 'The card ID' })
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({ status: 200, description: 'The updated card' })
  update(@Param('id') id: number, @Body() updateCardDto: UpdateCardDto) {
    return this.cardService.update(+id, updateCardDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a card by ID' })
  @ApiParam({ name: 'id', description: 'The card ID' })
  @ApiResponse({ status: 200, description: 'The deleted card' })
  remove(@Param('id') id: number) {
    return this.cardService.remove(+id);
  }
}
