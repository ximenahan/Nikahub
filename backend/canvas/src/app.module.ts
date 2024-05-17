import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
import { FirstentityModule } from './firstentity/firstentity.module';

@Module({
imports: [
    TypeOrmModule.forRoot({
      type: 'postgres', // Database type
      host: 'localhost', // Database host
      port: 5432, // Database port
      username: 'bruce', // Database username
      password: 'bruce12345', // Database password
      database: 'firstdatabase', // Database name
      entities: [__dirname + '/firstentity/*.entity{.ts,.js}'], // Path to your entities (models)
      synchronize: true, // If true, TypeORM will synchronize the schema based on your models at runtime    
    }),
    FirstentityModule,
],
  controllers: [], //controllers: [AppController],
  providers: [], //providers: [AppService],
})
export class AppModule {}
