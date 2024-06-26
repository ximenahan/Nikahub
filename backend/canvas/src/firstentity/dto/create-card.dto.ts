// src/firstentity/dto/create-card.dto.ts
import { IsString, IsDate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCardDto {
  @ApiProperty({ description: 'The title of the card' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'The content of the card' })
  @IsString()
  content: string;

  @ApiProperty({ description: 'The creation date of the card' })
  @IsDate()
  createdAt: Date;
}
