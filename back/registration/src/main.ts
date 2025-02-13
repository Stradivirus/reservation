import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS || 'http://34.64.206.210:8000',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  const port = process.env.PORT || 8010;
  await app.listen(port);
  logger.log(`Registration service is running on port ${port}`);
}
bootstrap();