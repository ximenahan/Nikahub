// src/firstentity/entities/canvas.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Card } from './card.entity';

@Entity()
export class Canvas {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  createdAt: Date;

  @OneToMany(() => Card, card => card.canvas)
  cards: Card[];

}
