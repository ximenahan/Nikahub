import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Card } from './card.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Canvas {
  @ApiProperty({ example: '1', description: 'The ID of the canvas' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'My Canvas', description: 'The name of the canvas' })
  @Column()
  name: string;

  @ApiProperty({
    example: '2021-01-01T00:00:00.000Z',
    description: 'The creation date of the canvas',
  })
  @Column()
  createdAt: Date;

  @OneToMany(() => Card, (card) => card.canvas)
  cards: Card[];
}
