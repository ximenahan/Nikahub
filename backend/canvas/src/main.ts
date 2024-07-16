import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Adjust this to your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Enable validation globally
  app.useGlobalPipes(new ValidationPipe());

  // Integrates Swagger for API documentation
  setupSwagger(app);

  await app.listen(3001);
  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
