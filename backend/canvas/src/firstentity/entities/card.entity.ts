// src/firstentity/entities/card.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Canvas } from './canvas.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Card {
  @ApiProperty({ example: '1', description: 'The ID of the card' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Card Title', description: 'The title of the card' })
  @Column()
  title: string;

  @ApiProperty({
    example: 'Card content',
    description: 'The content of the card',
  })
  @Column()
  content: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The creation date of the card',
  })
  @Column()
  createdAt: Date;

  @ManyToOne(() => Canvas, (canvas) => canvas.cards)
  canvas: Canvas;
}
