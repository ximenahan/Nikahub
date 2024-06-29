import { DataSource } from 'typeorm';
import { Card } from './firstentity/entities/card.entity';
import { Canvas } from './firstentity/entities/canvas.entity';

async function updateCards() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'bruce',
    password: 'bruce12345',
    database: 'firstdatabase',
    entities: [Card, Canvas],
    synchronize: true,
  });

  await dataSource.initialize();

  const cards = await dataSource.getRepository(Card).find();
  const canvas = await dataSource.getRepository(Canvas).findOneBy({ id: 1 }); // Assuming you have at least one canvas

  if (canvas) {
    for (const card of cards) {
      if (!card.canvas) {
        card.canvas = canvas;
        await dataSource.getRepository(Card).save(card);
      }
    }
  }

  await dataSource.destroy();
}

updateCards().then(() => {
  console.log('All cards updated with canvasId');
});
