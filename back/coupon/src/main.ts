import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Main');
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS || 'http://34.64.132.7:8080',
    methods: ['GET', 'POST'],
    credentials: true,
  });

  const port = process.env.PORT || 8085;
  await app.listen(port);
  logger.log(`Coupon service is running on port ${port}`);
}
bootstrap();