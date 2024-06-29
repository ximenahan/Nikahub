// src/firstentity/entities/card.entity.ts
// eslint-disable-next-line prettier/prettier
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
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

  @ApiProperty({
    example: 100,
    description: 'The X position of the card on the canvas',
  })
  @Column('float')
  positionX: number;

  @ApiProperty({
    example: 150,
    description: 'The Y position of the card on the canvas',
  })
  @Column('float')
  positionY: number;

  @ApiProperty({
    example: 200,
    description: 'The width of the card',
  })
  @Column('float')
  width: number;

  @ApiProperty({
    example: 300,
    description: 'The height of the card',
  })
  @Column('float')
  height: number;

  @ManyToOne(() => Canvas, (canvas) => canvas.cards)
  @JoinColumn({ name: 'canvasId' })
  canvas: Canvas;

  @ApiProperty({
    example: 1,
    description: 'The ID of the canvas this card belongs to',
  })
  @Column()
  canvasId: number; // This column is used for the relationship
}
