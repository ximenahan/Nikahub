// src/firstentity/dto/create-card.dto.ts
import { IsString, IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateCardDto {
  @ApiProperty({ description: 'The title of the card' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Example sanitization
  title: string;

  @ApiProperty({ description: 'The content of the card' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Example sanitization
  content: string;

  // eslint-disable-next-line prettier/prettier
  @ApiProperty({ description: 'The creation date of the card', required: false })
  @IsDate()
  @IsNotEmpty()
  @Type(() => Date) // Transform to Date instance
  createdAt: Date;

  @ApiProperty({ description: 'The X position of the card on the canvas' })
  @IsNumber()
  @IsNotEmpty()
  positionX: number;

  @ApiProperty({ description: 'The Y position of the card on the canvas' })
  @IsNumber()
  @IsNotEmpty()
  positionY: number;

  @ApiProperty({ description: 'The width of the card' })
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty({ description: 'The height of the card' })
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty({ description: 'The ID of the canvas this card belongs to' })
  @IsNumber()
  @IsNotEmpty()
  canvasId: number;
}
