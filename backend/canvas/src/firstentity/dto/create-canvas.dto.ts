// src/firstentity/dto/create-canvas.dto.ts
import { IsString, IsDate, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';

export class CreateCanvasDto {
  @ApiProperty({ description: 'The name of the canvas' })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim()) // Example sanitization
  name: string;

  @ApiProperty({
    description: 'The creation date of the canvas',
    required: false,
  })
  @IsDate()
  @IsOptional()
  @Type(() => Date) // Transform to Date instance
  createdAt: Date;
}
