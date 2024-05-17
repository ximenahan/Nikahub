// src/firstentity/entities/card.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Canvas } from './canvas.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column()
  createdAt: Date;

  @ManyToOne(() => Canvas, canvas => canvas.cards)
  canvas: Canvas;
}
