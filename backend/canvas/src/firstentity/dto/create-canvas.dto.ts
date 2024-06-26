import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';

export class CreateCanvasDto {
  @ApiProperty({ description: 'The name of the canvas' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'The creation date of the canvas' })
  @IsDate()
  createdAt: Date;
}
